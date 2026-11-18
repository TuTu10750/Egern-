#!/usr/bin/env python3
"""修 xl-relay (v1.9.5) 的浏览器 OOM 死亡：看门狗重载风暴。

根因（2026-11-19 02:07 诊断，证据在 dmesg/journalctl）：
  1) dmesg 两次 cgroup OOM kill 了 chrome（anon-rss 706MB / 641MB），
     因为 xl-relay.service 的 MemoryMax=1200M 被打满。
  2) journalctl 显示 3 个会话（s99rsj7/skyfk3c/smbgmg4）卡在 0 段，
     看门狗每 5 秒 tick、每 ~10 秒重载一次页面，3 个会话轮流重载，
     浏览器不停重新导航、跑 JS，内存一路涨到 OOM 被杀。
  3) 重载永远修不好 0 段的会话（房间已下播/私密/页没起来），
     却一直循环重载，等于拿内存烧一个死房间。

改法：
  a) 重载节流：两次重载至少间隔 30 秒，不再每 10 秒一次。
  b) 死房间丢弃：一个会话重载 3 次仍 0 段，直接 drop，不再重载。
  c) 收到分片就清零重载计数（活房间不受影响）。

用法（服务器 root）：
  python3 /tmp/patch-watchdog.py
  node --check /opt/xl-relay/relay.js && systemctl restart xl-relay
"""
import sys
import shutil
import datetime

PATH = "/opt/xl-relay/relay.js"

OLD_WD = """    if (idle < 75000) {
      log(`[${sess.sid}] watchdog reload (idle ${Math.round(idle / 1000)}s)`);
      sess.recoverStage = 1;
      try { await sess.cdp.send("Page.reload", { ignoreCache: false }); } catch (_) {}
      sess.lastSegAt = Date.now() - 20000;                 // 给重载留启动时间
      setTimeout(() => armPage(sess, 3000), 2500);         // ← 关键：重载后重新点门
      return;
    }"""

NEW_WD = """    if (idle < 75000) {
      // 节流：两次重载至少间隔 30 秒，避免重载风暴把内存烧到 OOM
      const sinceReload = Date.now() - (sess.lastReloadAt || 0);
      if (sinceReload < 30000) return;
      sess.reloadCount = (sess.reloadCount || 0) + 1;
      // 重载 3 次仍 0 段：房间大概率已下播/私密，直接丢掉，别再烧内存
      if (sess.reloadCount >= 3 && sess.published.length === 0) {
        log(`[${sess.sid}] watchdog drop dead room (reload x${sess.reloadCount}, segs=0)`);
        sessions.delete(sess.sid);
        closeTab(sess);
        return;
      }
      log(`[${sess.sid}] watchdog reload #${sess.reloadCount} (idle ${Math.round(idle / 1000)}s)`);
      sess.recoverStage = 1;
      sess.lastReloadAt = Date.now();
      try { await sess.cdp.send("Page.reload", { ignoreCache: false }); } catch (_) {}
      sess.lastSegAt = Date.now() - 20000;                 // 给重载留启动时间
      setTimeout(() => armPage(sess, 3000), 2500);         // ← 关键：重载后重新点门
      return;
    }"""

# 收到分片就清零重载计数（活房间不受影响）
OLD_SEG = """  if (!sess.quality) sess.quality = seg.quality;
  sess.lastSegAt = Date.now();"""

NEW_SEG = """  if (!sess.quality) sess.quality = seg.quality;
  sess.lastSegAt = Date.now();
  sess.reloadCount = 0;"""


def main():
    with open(PATH, "r", encoding="utf-8") as f:
        src = f.read()

    if "watchdog drop dead room" in src:
        print("已经打过看门狗补丁，跳过。")
        return 0

    if OLD_WD not in src:
        print("找不到看门狗重载块，退出（可能版本不对）。")
        return 1
    if OLD_SEG not in src:
        print("找不到分片计数块，退出（可能版本不对）。")
        return 1

    bak = PATH + ".bak.watchdog." + datetime.datetime.now().strftime("%H%M")
    shutil.copyfile(PATH, bak)
    print("备份:", bak)

    src = src.replace(OLD_WD, NEW_WD, 1)
    src = src.replace(OLD_SEG, NEW_SEG, 1)
    with open(PATH, "w", encoding="utf-8") as f:
        f.write(src)
    print("已打补丁：重载节流 30s + 3 次 0 段丢会话 + 有段清零。")
    print("下一步：node --check /opt/xl-relay/relay.js && systemctl restart xl-relay")
    return 0


if __name__ == "__main__":
    sys.exit(main())
