#!/usr/bin/env python3
"""patch-login-diag2.py — 读回输入框的值 + 抓报错信息.

在填表后立即读回两个输入框的 .value (确认 React 是否认了填的值),
点击后 3 秒抓: 按钮 disabled 状态 / 页面错误文案 / 更长的 body.
"""
import sys

RELAY = "/opt/xl-relay/relay.js"
MARKER = "// __PATCH_LOGIN_DIAG2_V1__"

OLD = """    log(`[login] fill=${fillRes}`);"""

NEW = """    log(`[login] fill=${fillRes}`);
    try {
      const vals = await cdp.send("Runtime.evaluate", { expression: `JSON.stringify({ uLen: ((document.querySelector('input[placeholder="用户名或邮箱"]')||{}).value || "").length, pLen: ((document.querySelector('input[placeholder="密码"]')||{}).value || "").length, btnDisabled: (() => { const b=[...document.querySelectorAll("button")].find(x=>(x.textContent||"").trim()==="登录"); return b ? !!b.disabled : "no-btn"; })() })`, returnByValue: true });
      log(`[login] values: ${vals && vals.result ? vals.result.value : "?"}`);
    } catch (_) {}
    await new Promise(r => setTimeout(r, 3000));
    try {
      const err = await cdp.send("Runtime.evaluate", { expression: `JSON.stringify({ url: location.href, body: (document.body ? document.body.innerText : "").slice(0, 500), err: /错误|不正确|无效|失败|wrong|incorrect|invalid|failed/i.test(document.body ? document.body.innerText : "") })`, returnByValue: true });
      log(`[login] after-3s: ${err && err.result ? err.result.value : "?"}`);
    } catch (_) {}"""


def main():
    src = open(RELAY, encoding="utf-8").read()
    if MARKER in src:
        print("已经打过登录诊断2补丁，跳过")
        return 0
    if OLD not in src:
        print("未找到 fill 日志锚点，补丁未应用", file=sys.stderr)
        return 1
    import shutil, datetime
    bak = "%s.bak.logdiag2.%s" % (RELAY, datetime.datetime.now().strftime("%H%M"))
    shutil.copy2(RELAY, bak)
    print("备份:", bak)
    src = src.replace(OLD, NEW, 1)
    src = src.replace("let loginState =", MARKER + "\nlet loginState =", 1)
    open(RELAY, "w", encoding="utf-8").write(src)
    print("登录诊断2补丁已应用")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
