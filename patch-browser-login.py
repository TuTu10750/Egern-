#!/usr/bin/env python3
"""patch-browser-login.py — relay v1.9.5: 中继浏览器直接登录 (不走 Cookie 文件)

前置: patch-login.py 已部署 (serverCookie + authFrom 回落 + login-status /
reload-cookie / vod/list)。本补丁在其上加浏览器登录:
  凭据放 /opt/xl-relay/.env (XL_USER= / XL_PASS=, chmod 600, 爸爸自己 SSH 写)。
  GET /api/live/login 触发: CDP 开登录页 https://zh.xlivesex.com/login,
  填用户名/密码, 点"登录", 等 session 出现, 取全部 Cookie 存 serverCookie。
  Cloudflare 验证码若出现且不自动放行, 登录失败并上报原因, 不死循环重试。
  登录成功后 list/play/VOD 一律用这份登录态 (authFrom 回落已存在)。

注意: 站方按登录 IP 认人 (IP 绑定)。若 Cookie 的登录 IP 与服务器出口 IP
不匹配, 站方仍可能当访客; 届时需走住宅/手机代理出口。
付费视频 (¥99) 仍只给预告片, 不绕付费墙。
"""
import sys

RELAY = "/opt/xl-relay/relay.js"
MARKER = "// __PATCH_BROWSER_LOGIN_V1__"

# 锚点 1: serverCookie 块 (patch-login.py 已加) — 在其后追加浏览器登录函数
OLD_COOKIE_BLOCK = """loadServerCookie();"""

NEW_COOKIE_BLOCK = MARKER + """
loadServerCookie();

// ───────────── 浏览器直接登录 ─────────────
// 凭据: /opt/xl-relay/.env, 两行: XL_USER=... / XL_PASS=... (chmod 600)
function readCreds() {
  try {
    const txt = fs.readFileSync("/opt/xl-relay/.env", "utf8");
    const m = {};
    for (const line of txt.split(/\\r?\\n/)) {
      const i = line.indexOf("=");
      if (i > 0) m[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    }
    return { user: m.XL_USER || "", pass: m.XL_PASS || "" };
  } catch (_) { return { user: "", pass: "" }; }
}

let loginState = { running: false, ok: false, reason: "未登录", at: 0 };
// React 受控输入框: 直接设 .value 会被 React 覆盖, 必须用原生 setter + 派发 input 事件
const FILL_LOGIN_EXPR = `(async () => {
  const u = document.querySelector('input[placeholder="用户名或邮箱"]');
  const p = document.querySelector('input[placeholder="密码"]');
  if (!u || !p) return "no-input";
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  const setVal = (el, v) => { setter.call(el, v); el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); };
  setVal(u, window.__XL_USER__);
  setVal(p, window.__XL_PASS__);
  await new Promise(r => setTimeout(r, 400));
  const btns = [...document.querySelectorAll("button")];
  const btn = btns.find(b => (b.textContent || "").trim() === "登录");
  if (!btn) return "no-button";
  btn.click();
  return "clicked";
})()`;

async function loginViaBrowser() {
  if (loginState.running) return { ok: false, reason: "登录进行中" };
  const { user, pass } = readCreds();
  if (!user || !pass) return { ok: false, reason: "凭据缺失: /opt/xl-relay/.env 里写 XL_USER= / XL_PASS=" };
  loginState = { running: true, ok: false, reason: "登录中", at: Date.now() };
  let cdp = null;
  let tabId = null;
  try {
    const tab = await newTab("https://zh.xlivesex.com/login");
    if (!tab) { loginState = { running: false, ok: false, reason: "浏览器未就绪 (/json/new 失败)", at: Date.now() }; return loginState; }
    tabId = tab.id;
    cdp = new CDPSession(tab.webSocketDebuggerUrl);
    await cdp.ready;
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Network.enable");
    // 等登录框出现 (最多 20s)
    let hasInput = false;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 1000));
      try {
        const r = await cdp.send("Runtime.evaluate", { expression: `!!document.querySelector('input[placeholder="用户名或邮箱"]')`, returnByValue: true });
        if (r && r.result && r.result.value) { hasInput = true; break; }
      } catch (_) {}
    }
    if (!hasInput) { loginState = { running: false, ok: false, reason: "登录页未加载出输入框", at: Date.now() }; return loginState; }
    // 注入凭据并提交 (凭据只进页面 JS 变量, 不写日志)
    await cdp.send("Runtime.evaluate", { expression: `window.__XL_USER__=${JSON.stringify(user)}; window.__XL_PASS__=${JSON.stringify(pass)}; "ok"`, returnByValue: true });
    const fill = await cdp.send("Runtime.evaluate", { expression: FILL_LOGIN_EXPR, awaitPromise: true, returnByValue: true });
    const fillRes = fill && fill.result && fill.result.value;
    if (fillRes !== "clicked") { loginState = { running: false, ok: false, reason: "填表失败: " + String(fillRes || "unknown"), at: Date.now() }; return loginState; }
    // 等 session Cookie 出现 (最多 30s), 同时检测 Cloudflare 验证码
    let captchaSeen = false;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 1000));
      try {
        const ck = await cdp.send("Network.getAllCookies");
        const list = (ck && ck.cookies) || [];
        const sess = list.find(c => c.name === "xlivesex_com_sessionId");
        if (sess) {
          const str = list.filter(c => (c.domain || "").includes("xlivesex.com")).map(c => c.name + "=" + c.value).join("; ");
          if (str) { serverCookie = str; serverCookieAt = Date.now(); loginState = { running: false, ok: true, reason: "登录成功", at: Date.now() }; log(`browser login ok: cookie len=${str.length}`); return loginState; }
        }
        const cap = await cdp.send("Runtime.evaluate", { expression: `!!document.querySelector('iframe[src*="cloudflare"], iframe[src*="challenges"], iframe[title*="Cloudflare"]') || /请验证您是真人/.test(document.body ? document.body.innerText : "")`, returnByValue: true });
        if (cap && cap.result && cap.result.value) captchaSeen = true;
      } catch (_) {}
    }
    loginState = { running: false, ok: false, reason: captchaSeen ? "Cloudflare 验证码挡住, 未自动放行 (需人工过验证码或换出口 IP)" : "登录超时: 30s 内未出现 session Cookie", at: Date.now() };
    return loginState;
  } catch (e) {
    loginState = { running: false, ok: false, reason: "登录异常: " + String((e && e.message) || e).slice(0, 100), at: Date.now() };
    return loginState;
  } finally {
    try { if (tabId) await cdp.send("Target.closeTarget", { targetId: tabId }); } catch (_) {}
    try { if (cdp && cdp.close) cdp.close(); } catch (_) {}
  }
}"""

# 锚点 2: login-status 路由 — 在其后追加 /api/live/login 触发端点
OLD_STATUS = """    if (p === "/api/live/login-status") return json(res, 200, { ok: true, hasCookie: !!serverCookie, cookieLen: serverCookie.length, loadedAt: serverCookieAt || 0 });"""

NEW_STATUS = OLD_STATUS + """
    if (p === "/api/live/login") { const r = await loginViaBrowser(); return json(res, 200, { ok: r.ok, reason: r.reason, hasCookie: !!serverCookie, cookieLen: serverCookie.length }); }
    if (p === "/api/live/login-state") return json(res, 200, { ok: true, state: loginState, hasCookie: !!serverCookie, cookieLen: serverCookie.length });"""


def main():
    src = open(RELAY, encoding="utf-8").read()
    if MARKER in src:
        print("已经打过浏览器登录补丁，跳过")
        return 0
    if OLD_COOKIE_BLOCK not in src:
        print("未找到 loadServerCookie() 锚点 (请先打 patch-login.py)，补丁未应用", file=sys.stderr)
        return 1
    if OLD_STATUS not in src:
        print("未找到 login-status 锚点，补丁未应用", file=sys.stderr)
        return 1
    import shutil, datetime
    bak = "%s.bak.blogin.%s" % (RELAY, datetime.datetime.now().strftime("%H%M"))
    shutil.copy2(RELAY, bak)
    print("备份:", bak)
    src = src.replace(OLD_COOKIE_BLOCK, NEW_COOKIE_BLOCK, 1)
    src = src.replace(OLD_STATUS, NEW_STATUS, 1)
    open(RELAY, "w", encoding="utf-8").write(src)
    print("浏览器登录补丁已应用")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
