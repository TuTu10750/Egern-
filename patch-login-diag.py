#!/usr/bin/env python3
"""patch-login-diag.py — 给 loginViaBrowser 加详细日志, 定位登录卡在哪一步.

在 FILL/点击/轮询的关键点打 log:
  - 输入框是否找到, 填表返回值
  - 点击后页面的 URL / 标题 / body 前 200 字 (看是不是报错/验证码/已登录)
  - 每次轮询是否看到 captcha iframe (更宽的选择器)
  - 每次轮询的 Cookie 数量 (看有没有任何 xlivesex Cookie 出现)
日志用 journalctl -u xl-relay 看。
"""
import sys

RELAY = "/opt/xl-relay/relay.js"
MARKER = "// __PATCH_LOGIN_DIAG_V1__"

# 锚点: FILL 后的判断 — 插入点击后快照日志
OLD_FILL_CHECK = """    const fill = await cdp.send("Runtime.evaluate", { expression: FILL_LOGIN_EXPR, awaitPromise: true, returnByValue: true });
    const fillRes = fill && fill.result && fill.result.value;
    if (fillRes !== "clicked") { loginState = { running: false, ok: false, reason: "填表失败: " + String(fillRes || "unknown"), at: Date.now() }; return loginState; }"""

NEW_FILL_CHECK = OLD_FILL_CHECK + """
    log(`[login] fill=${fillRes}`);
    try {
      const snap = await cdp.send("Runtime.evaluate", { expression: `JSON.stringify({ url: location.href, title: document.title, body: (document.body ? document.body.innerText : "").slice(0, 200) })`, returnByValue: true });
      log(`[login] after-click: ${snap && snap.result ? snap.result.value : "?"}`);
    } catch (_) {}"""

# 锚点: 轮询里的 captcha 检测 — 加更宽的检测 + Cookie 数量日志
OLD_POLL = """        const cap = await cdp.send("Runtime.evaluate", { expression: `!!document.querySelector('iframe[src*="cloudflare"], iframe[src*="challenges"], iframe[title*="Cloudflare"]') || /请验证您是真人/.test(document.body ? document.body.innerText : "")`, returnByValue: true });
        if (cap && cap.result && cap.result.value) captchaSeen = true;"""

NEW_POLL = """        const cap = await cdp.send("Runtime.evaluate", { expression: `JSON.stringify({ cf: !!document.querySelector('iframe[src*="cloudflare"], iframe[src*="challenges"], iframe[src*="turnstile"], iframe[title*="Cloudflare"], iframe[title*="challenge"]'), txt: /请验证您是真人|验证您是真人|Verify you are human|Are you a robot/i.test(document.body ? document.body.innerText : ""), frames: [...document.querySelectorAll("iframe")].map(f => (f.src || "").slice(0, 80)) })`, returnByValue: true });
        try {
          const c = cap && cap.result ? JSON.parse(cap.result.value) : {};
          if (c.cf || c.txt) captchaSeen = true;
          if (i % 10 === 0 || c.cf || c.txt) log(`[login] poll ${i}s cap=${JSON.stringify(c)} ckN=${list.length}`);
        } catch (_) { if (cap && cap.result && cap.result.value) captchaSeen = true; }"""


def main():
    src = open(RELAY, encoding="utf-8").read()
    if MARKER in src:
        print("已经打过登录诊断补丁，跳过")
        return 0
    if OLD_FILL_CHECK not in src:
        print("未找到填表锚点，补丁未应用", file=sys.stderr)
        return 1
    if OLD_POLL not in src:
        print("未找到轮询锚点，补丁未应用", file=sys.stderr)
        return 1
    import shutil, datetime
    bak = "%s.bak.logdiag.%s" % (RELAY, datetime.datetime.now().strftime("%H%M"))
    shutil.copy2(RELAY, bak)
    print("备份:", bak)
    src = src.replace(OLD_FILL_CHECK, NEW_FILL_CHECK, 1)
    src = src.replace(OLD_POLL, NEW_POLL, 1)
    # 把标记打在 loginState 定义处 (便于识别 / 防重复打)
    src = src.replace("let loginState =", MARKER + "\nlet loginState =", 1)
    open(RELAY, "w", encoding="utf-8").write(src)
    print("登录诊断补丁已应用")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
