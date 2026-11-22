// fav-sync.js — xl-live 收藏主播 ID 同步服务（独立小服务，不动主中继 relay.js）
// 跑在新加坡 VPS，端口 8789。只做两件事：收 ID、给列表。
//   GET /api/fav/add?id=253571608   → 把 ID 追加到 fav_ids.json（去重），回 {ok:true, ids:[...]}
//   GET /api/fav/list               → 回 {ok:true, ids:[...]}
// 数据文件：/opt/xl-relay/fav_ids.json（和主中继同目录，方便以后一起备份）。
// 首次启动文件不存在时，用 2026-11-22 Arue 发来的 20 个种子 ID 建文件。
// 启动：nohup node /opt/xl-relay/fav-sync.js > /var/log/xl-fav-sync.log 2>&1 &
// 依赖：只有 Node 自带 http/fs（不用装任何包）。
var http = require("http");
var fs = require("fs");

var PORT = 8789;
var FILE = "/opt/xl-relay/fav_ids.json";
var SEED_IDS = [253571608, 151302412, 243708997, 251951847, 12046, 105683156, 211294537, 166479363, 278446954, 172096253, 196850413, 272529666, 271645097, 52348649, 191368260, 289793073, 258636104, 157113092, 234292388, 519734];

function loadIds() {
  try {
    var raw = fs.readFileSync(FILE, "utf8");
    var d = JSON.parse(raw);
    var ids = Array.isArray(d) ? d : (d.ids || []);
    var out = [];
    for (var i = 0; i < ids.length; i++) {
      var n = parseInt(ids[i], 10);
      if (isFinite(n) && n > 0 && out.indexOf(n) < 0) out.push(n);
    }
    return out;
  } catch (e) {
    return null; // 文件不存在或坏了
  }
}

function saveIds(ids) {
  var tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify({ count: ids.length, ids: ids, updated: new Date().toISOString() }, null, 2), "utf8");
  fs.renameSync(tmp, FILE);
}

function send(res, code, obj) {
  var body = JSON.stringify(obj);
  res.writeHead(code, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) });
  res.end(body);
}

var server = http.createServer(function (req, res) {
  try {
    var u = new URL(req.url, "http://127.0.0.1");
    if (u.pathname === "/api/fav/list") {
      var ids = loadIds();
      if (ids === null) { ids = SEED_IDS.slice(); saveIds(ids); }
      return send(res, 200, { ok: true, count: ids.length, ids: ids });
    }
    if (u.pathname === "/api/fav/add") {
      var n = parseInt(u.searchParams.get("id"), 10);
      if (!isFinite(n) || n <= 0) return send(res, 400, { ok: false, error: "bad id" });
      var cur = loadIds();
      if (cur === null) { cur = SEED_IDS.slice(); }
      if (cur.indexOf(n) < 0) { cur.push(n); saveIds(cur); }
      return send(res, 200, { ok: true, count: cur.length, ids: cur });
    }
    if (u.pathname === "/health" || u.pathname === "/") {
      return send(res, 200, { ok: true, service: "xl-fav-sync", port: PORT });
    }
    return send(res, 404, { ok: false, error: "not found" });
  } catch (e) {
    return send(res, 500, { ok: false, error: String(e && e.message || e) });
  }
});

server.listen(PORT, "0.0.0.0", function () {
  console.log("[fav-sync] listening on 0.0.0.0:" + PORT + " file=" + FILE);
});
