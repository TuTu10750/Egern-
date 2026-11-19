#!/usr/bin/env python3
"""patch-login.py — relay v1.9.5: 服务器端 Cookie 登录态 (Cookie 文件方案)

背景: Rex 我的账号未登录, 中继是纯访客, 要登录的房间 (如 102560604) 0 分片。
自动密码登录被 Cloudflare 验证码挡住, 改走 Cookie 文件:
  爸爸手机浏览器登录后, 从 Network 请求头复制整串 Cookie,
  SSH 写进 /opt/xl-relay/.cookie, 中继启动时读入内存,
  模块没传 Cookie 时, list/play/VOD 一律用服务器这份登录态。

改动:
  1. 新增 serverCookie 全局 + loadServerCookie() (读 /opt/xl-relay/.cookie)
  2. authFrom() 没收到模块 Cookie 时回落到 serverCookie
  3. 新增 GET /api/live/login-status (只报有没有 Cookie 和长度, 不回显值)
  4. 新增 GET /api/live/reload-cookie (重读文件, 不用重启)
  5. 新增 GET /api/vod/list?userId= (用服务器 Cookie 代拉主播页视频列表)
     付费视频仍只给预告片, 不绕付费墙; 该接口只解决"列表看不到"的问题。

用法 (服务器上):
  printf '%s' '整串Cookie' > /opt/xl-relay/.cookie
  chmod 600 /opt/xl-relay/.cookie
  curl -s http://127.0.0.1:8788/api/live/reload-cookie
  curl -s http://127.0.0.1:8788/api/live/login-status
"""
import sys

RELAY = "/opt/xl-relay/relay.js"
MARKER = "// __PATCH_LOGIN_V1__"

OLD_AUTHFROM = """// 从请求里取鉴权信息（优先自定义头，兼容 query，方便 curl 调试）
function authFrom(req) {
  const u = new URL(req.url, "http://x");
  const q = u.searchParams;
  const hdrCookie = req.headers["x-xl-cookie"] || req.headers["x-cookie"] || req.headers["cookie"] || "";
  return {
    cookie: String(hdrCookie || q.get("cookie") || "").trim(),
    token: String(req.headers["x-xl-token"] || q.get("token") || "").trim(),
  };
}"""

NEW_AUTHFROM = MARKER + """
// ───────────── 服务器端登录态 (Cookie 文件方案) ─────────────
// 爸爸手机登录后把整串 Cookie 写进 /opt/xl-relay/.cookie (chmod 600),
// 中继启动时读入内存; 模块没传 Cookie 时, list/play/VOD 一律用这份。
// 注意: 站方按登录 IP 认人 (IP 绑定), 若 Cookie 的登录 IP 与服务器出口
// IP 不匹配, 站方仍可能当访客; 届时需走住宅/手机代理出口。
const COOKIE_FILE = "/opt/xl-relay/.cookie";
let serverCookie = "";
let serverCookieAt = 0;
function loadServerCookie() {
  try {
    const s = fs.readFileSync(COOKIE_FILE, "utf8").trim();
    if (s) { serverCookie = s; serverCookieAt = Date.now(); log(`server cookie loaded: len=${s.length}`); return true; }
    serverCookie = ""; log("server cookie file empty");
    return false;
  } catch (e) {
    serverCookie = "";
    log(`server cookie not loaded (${COOKIE_FILE} 缺失或不可读)`);
    return false;
  }
}
loadServerCookie();

// 从请求里取鉴权信息（优先自定义头，兼容 query，方便 curl 调试）
// 优先级: 模块请求头 Cookie > query cookie > 服务器端 Cookie 文件
function authFrom(req) {
  const u = new URL(req.url, "http://x");
  const q = u.searchParams;
  const hdrCookie = req.headers["x-xl-cookie"] || req.headers["x-cookie"] || req.headers["cookie"] || "";
  return {
    cookie: String(hdrCookie || q.get("cookie") || "").trim() || serverCookie || "",
    token: String(req.headers["x-xl-token"] || q.get("token") || "").trim(),
  };
}"""

OLD_TAGS = """    if (p === "/api/live/tags") return json(res, 200, { ok: true, tags: TAGS });"""

NEW_TAGS = OLD_TAGS + """
    if (p === "/api/live/login-status") return json(res, 200, { ok: true, hasCookie: !!serverCookie, cookieLen: serverCookie.length, loadedAt: serverCookieAt || 0 });
    if (p === "/api/live/reload-cookie") { const ok = loadServerCookie(); return json(res, 200, { ok, hasCookie: !!serverCookie, cookieLen: serverCookie.length }); }
    if (p === "/api/vod/list") {
      const uid = String(q.get("userId") || q.get("id") || "").replace(/[^0-9]/g, "");
      if (!uid) return json(res, 400, { ok: false, error: "缺少 userId" });
      const auth = authFrom(req);
      try {
        const r = await fetch(SITE + "/api/front/v2/users/" + uid + "/videos", { headers: { "User-Agent": UA, Referer: SITE + "/", Accept: "application/json", ...(auth.cookie ? { Cookie: auth.cookie } : {}) } });
        const txt = await r.text();
        res.writeHead(r.status, { "Content-Type": "application/json" });
        res.end(txt);
      } catch (e) { return json(res, 502, { ok: false, error: String((e && e.message) || e).slice(0, 120) }); }
      return;
    }"""


def main():
    src = open(RELAY, encoding="utf-8").read()
    if MARKER in src:
        print("已经打过登录补丁，跳过")
        return 0
    if OLD_AUTHFROM not in src:
        print("未找到 authFrom 锚点，补丁未应用", file=sys.stderr)
        return 1
    if OLD_TAGS not in src:
        print("未找到 /api/live/tags 锚点，补丁未应用", file=sys.stderr)
        return 1
    import shutil, datetime
    bak = "%s.bak.login.%s" % (RELAY, datetime.datetime.now().strftime("%H%M"))
    shutil.copy2(RELAY, bak)
    print("备份:", bak)
    src = src.replace(OLD_AUTHFROM, NEW_AUTHFROM, 1)
    src = src.replace(OLD_TAGS, NEW_TAGS, 1)
    open(RELAY, "w", encoding="utf-8").write(src)
    print("登录补丁已应用")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
