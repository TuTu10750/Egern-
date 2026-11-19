#!/usr/bin/env python3
"""patch-login-diag3.py — 登录时记录全部网络请求, 看登录接口到底发没发、回了什么.

在 loginViaBrowser 的 CDP 会话上挂 Network.requestWillBeSent /
Network.responseReceived, 只记 login/auth/token/captcha 相关 + 全部 POST,
打 [login-net] 日志。帮助判断: 是点击没触发提交, 还是接口静默拒绝。
"""
import sys

RELAY = "/opt/xl-relay/relay.js"
MARKER = "// __PATCH_LOGIN_DIAG3_V1__"

# 锚点: cdp.ready 之后、填表之前 — 挂网络监听
OLD = """    cdp = new CDPSession(tab.webSocketDebuggerUrl);
    await cdp.ready;
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Network.enable");"""

NEW = """    cdp = new CDPSession(tab.webSocketDebuggerUrl);
    await cdp.ready;
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Network.enable");
    cdp.onEvent = (m) => {
      try {
        if (m.method === "Network.requestWillBeSent") {
          const r = m.params.request || {};
          const u = r.url || "";
          if (/login|auth|token|captcha|challenge|turnstile/i.test(u) || (r.method || "") === "POST") log(`[login-net] ${r.method} ${u.slice(0, 160)}`);
        }
        if (m.method === "Network.responseReceived") {
          const r = m.params.response || {};
          const u = r.url || "";
          if (/login|auth|token|captcha|challenge|turnstile/i.test(u)) log(`[login-net] <- ${r.status} ${u.slice(0, 160)}`);
        }
        if (m.method === "Network.loadingFailed") {
          const u = (m.params || {}).errorText || "";
          log(`[login-net] FAIL ${u.slice(0, 120)}`);
        }
      } catch (_) {}
    };"""


def main():
    src = open(RELAY, encoding="utf-8").read()
    if MARKER in src:
        print("已经打过登录诊断3补丁，跳过")
        return 0
    if OLD not in src:
        print("未找到 CDP ready 锚点，补丁未应用", file=sys.stderr)
        return 1
    import shutil, datetime
    bak = "%s.bak.logdiag3.%s" % (RELAY, datetime.datetime.now().strftime("%H%M"))
    shutil.copy2(RELAY, bak)
    print("备份:", bak)
    src = src.replace(OLD, NEW, 1)
    src = src.replace("let loginState =", MARKER + "\nlet loginState =", 1)
    open(RELAY, "w", encoding="utf-8").write(src)
    print("登录诊断3补丁已应用")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
