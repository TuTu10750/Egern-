#!/usr/bin/env python3
"""给 xl-relay (v1.9.5) 的 /api/live/list 加 all=1 全量模式。

用法（在服务器上，root）：
  python3 /tmp/patch-allrooms.py
  node --check /opt/xl-relay/relay.js && systemctl restart xl-relay

原理：
  原来的 handleList 一次只向站方 get-list 要 limit 个（默认 24，最多 60），
  模块一次只拿一页，所以一个分类看着只有 37 个左右。
  加 all=1 之后，中继内部循环翻页（offset 0/60/120...，每页 60 个，
  最多 10 页=600 个），去重、按在播优先排序，一次性返回全量。
  模块不用改：照常请求 /api/live/list?tag=daddies&all=1 即可。
  不加 all 时行为完全不变（分页、limit、兜底都原样）。
"""
import re
import sys
import shutil
import datetime

PATH = "/opt/xl-relay/relay.js"

NEW_HANDLELIST = r'''async function handleList(q, res, req) {
  const tag = String(q.get("tag") || "daddies");
  const page = Math.max(1, parseInt(String(q.get("page") || "1"), 10) || 1);
  const limit = Math.min(60, Math.max(6, parseInt(String(q.get("limit") || process.env.LIST_LIMIT || "24"), 10) || 24));
  const auth = authFrom(req);
  const wantAll = q.get("all") === "1";

  const tagId = TAG_MAP[tag] || tag;

  // all=1：循环翻页取全量（一个分类在播的所有房间）
  if (wantAll) {
    const allRooms = [];
    const seen = new Set();
    const PAGE_LIMIT = 60;
    const MAX_PAGES = 10; // 最多 600 个，防死循环
    for (let p = 0; p < MAX_PAGES; p++) {
      const body = {
        primaryTag: "men",
        filterGroupTags: [[tagId]],
        parentTag: tagId,
        sortBy: "stripRanking",
        limit: PAGE_LIMIT,
        offset: p * PAGE_LIMIT,
        userRole: "user",
      };
      const d = await curlPost(SITE + "/api/front/models/get-list", body, auth.cookie);
      const models = (d && Array.isArray(d.models)) ? d.models : [];
      if (!models.length) break;
      for (const m of models) {
        const room = mapModel(m);
        if (room && !seen.has(room.id)) { seen.add(room.id); allRooms.push(room); }
      }
      if (models.length < PAGE_LIMIT) break; // 最后一页
    }
    allRooms.sort((a, b) => (b.isLive - a.isLive) || (b.viewers - a.viewers));
    return json(res, 200, {
      ok: true, tag, tagId, page: 1, limit: allRooms.length,
      count: allRooms.length,
      liveCount: allRooms.filter((r) => r.isLive).length,
      hasMore: false,
      rooms: allRooms,
    });
  }

  const body = {
    primaryTag: "men",
    filterGroupTags: [[tagId]],
    parentTag: tagId,
    sortBy: "stripRanking",
    limit,
    offset: (page - 1) * limit,
    userRole: "user",
  };

  let models = null;
  const d = await curlPost(SITE + "/api/front/models/get-list", body, auth.cookie);
  if (d && Array.isArray(d.models)) models = d.models;

  if (!models) {
    // 兜底：SSR 首屏（仅第 1 页）
    if (page > 1) return json(res, 200, { ok: true, tag, page, count: 0, rooms: [], hasMore: false, reason: "api-fallback-page1-only" });
    const html = await getText(SITE + `/men/${tag}`, auth.cookie);
    const parsed = html ? extractModels(html) : [];
    models = parsed;
  }

  const rooms = models.map(mapModel).filter(Boolean);
  // 状态容错：不在服务端按状态过滤，只把在播的排前面
  rooms.sort((a, b) => (b.isLive - a.isLive) || (b.viewers - a.viewers));

  return json(res, 200, {
    ok: true, tag, tagId, page, limit,
    count: rooms.length,
    liveCount: rooms.filter((r) => r.isLive).length,
    hasMore: rooms.length >= limit,
    rooms,
  });
}'''


def main():
    with open(PATH, "r", encoding="utf-8") as f:
        src = f.read()

    if 'wantAll' in src and 'MAX_PAGES' in src:
        print("已经打过 all=1 补丁，跳过。")
        return 0

    # 定位 handleList：从 "async function handleList" 到下一个顶层 "function playlist"
    start = src.find("async function handleList(q, res, req) {")
    if start < 0:
        print("找不到 handleList，退出。")
        return 1
    end_marker = "\nfunction playlist(sess, origin) {"
    end = src.find(end_marker, start)
    if end < 0:
        print("找不到 playlist 边界，退出。")
        return 1

    bak = PATH + ".bak.allrooms." + datetime.datetime.now().strftime("%H%M")
    shutil.copyfile(PATH, bak)
    print("备份:", bak)

    new_src = src[:start] + NEW_HANDLELIST + "\n\n" + src[end + 1:]
    with open(PATH, "w", encoding="utf-8") as f:
        f.write(new_src)
    print("已替换 handleList，加入 all=1 全量模式。")
    print("下一步：node --check /opt/xl-relay/relay.js && systemctl restart xl-relay")
    return 0


if __name__ == "__main__":
    sys.exit(main())
