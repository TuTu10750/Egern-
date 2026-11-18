#!/usr/bin/env python3
"""修 xl-relay 看门狗第二弹：重载循环锁死，永远升不到重建。

根因（2026-11-19 02:27 诊断，会话 s3fqitp / 房间 276071019）：
  会话有 29 段，分片在 02:25:11 停掉（msn=544 之后再无新段）。
  看门狗 02:25:43 / 02:26:13 / 02:26:43 连重载 3 次，分片仍不恢复。
  原因是重载分支里有 `sess.lastSegAt = Date.now() - 20000`，
  每次重载都把 idle 重置回 20 秒，idle 永远到不了 75 秒的重建阈值，
  看门狗被锁死在“重载→重置→再重载”的死循环里。
  而 Page.reload 本身可能已失效（CDP 断了、标签页挂了），
  重载多少次都没用，必须升级到硬重建（reopenSession）。

改法：
  a) 重载分支删掉 `lastSegAt = Date.now() - 20000`，让 idle 真实增长，
     自然升级到重建（75s）/丢弃（150s）。节流仍靠 lastReloadAt（30s）。
  b) 重载 3 次还没恢复（不管有没有段），直接硬重建标签页，
     别再 reload——reload 失效时只有重建能救。
  c) reopenSession 里清零 reloadCount / lastReloadAt，
     否则重建完的会话带着旧计数， stalls 后立刻又重建，死循环。
"""
import sys
import shutil
import datetime

PATH = "/opt/xl-relay/relay.js"

OLD_RELOAD = """    if (idle < 75000) {
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

NEW_RELOAD = """    if (idle < 75000) {
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
      // 重载 3 次还没恢复（有段也一样）：Page.reload 可能已失效，直接硬重建
      if (sess.reloadCount >= 3) {
        log(`[${sess.sid}] watchdog rebuild after 3 reloads (idle ${Math.round(idle / 1000)}s)`);
        sess.recoverStage = 2;
        await reopenSession(sess);
        return;
      }
      log(`[${sess.sid}] watchdog reload #${sess.reloadCount} (idle ${Math.round(idle / 1000)}s)`);
      sess.recoverStage = 1;
      sess.lastReloadAt = Date.now();
      try { await sess.cdp.send("Page.reload", { ignoreCache: false }); } catch (_) {}
      // 注意：不再重置 lastSegAt——让 idle 真实增长，才能自然升级到重建/丢弃。
      // 否则每次重载都把 idle 打回 20s，永远到不了 75s 的重建阈值，死循环。
      setTimeout(() => armPage(sess, 3000), 2500);         // ← 关键：重载后重新点门
      return;
    }"""

# reopenSession 里清零重载计数（否则重建完带着旧计数，stall 后立刻又重建）
OLD_REOPEN = """  sess.lastError = "";
  sess.lastSegAt = Date.now();
  sess.startedAt = Date.now();
  try { await openRoom(sess); } catch (e) {"""

NEW_REOPEN = """  sess.lastError = "";
  sess.lastSegAt = Date.now();
  sess.startedAt = Date.now();
  sess.reloadCount = 0;
  sess.lastReloadAt = 0;
  try { await openRoom(sess); } catch (e) {"""


def main():
    with open(PATH, "r", encoding="utf-8") as f:
        src = f.read()

    if "watchdog rebuild after 3 reloads" in src:
        print("已经打过看门狗第二弹补丁，跳过。")
        return 0

    if OLD_RELOAD not in src:
        print("找不到重载分支，退出（可能版本不对）。")
        return 1
    if OLD_REOPEN not in src:
        print("找不到 reopenSession 计数位，退出（可能版本不对）。")
        return 1

    bak = PATH + ".bak.watchdog2." + datetime.datetime.now().strftime("%H%M")
    shutil.copyfile(PATH, bak)
    print("备份:", bak)

    src = src.replace(OLD_RELOAD, NEW_RELOAD, 1)
    src = src.replace(OLD_REOPEN, NEW_REOPEN, 1)
    with open(PATH, "w", encoding="utf-8") as f:
        f.write(src)
    print("已打补丁：重载不再重置 idle + 3 次重载升重建 + 重建清零计数。")
    print("下一步：node --check /opt/xl-relay/relay.js && systemctl restart xl-relay")
    return 0


if __name__ == "__main__":
    sys.exit(main())
