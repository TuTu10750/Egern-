/**
 * XLiveSex 直播接口服务
 *
 * 两个接口：
 *   GET /api/live/list?tag=daddies&page=1     直播间列表
 *   GET /api/live/play?id=185707842           解析播放地址（点开那一刻才调）
 *
 * 抓取用 curl 子进程：本机与 Linux 服务器都自带，且能自动走系统 HTTPS_PROXY。
 * 不引任何第三方依赖。
 *
 * 启动：
 *   node server.js                默认 0.0.0.0:8787
 *   PORT=9000 node server.js      指定端口
 */

const http = require("http");
const { execFile } = require("child_process");

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";
const SITE = "https://zh.xlivesex.com";
// 空设备：Windows 是 NUL，Linux/macOS 是 /dev/null（直接写 NUL 会在 Linux 下生成垃圾文件）
const NULL_DEV = process.platform === "win32" ? "NUL" : "/dev/null";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.0 Safari/605.1.15";

const BASE_HEADERS = {
  "User-Agent": UA,
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  Referer: SITE + "/",
};

// 分类白名单：只放 xlivesex 真实存在的 men 分类
const TAGS = [
  "daddies", "twinks", "jocks", "bears", "muscle", "asian",
  "latin", "black", "mature", "college", "amateur", "couples",
];

// ───────────────────────── HTTP 抓取 ─────────────────────────

function curl(url, extraArgs) {
  return new Promise((resolve, reject) => {
    const args = ["-sL", "-m", "25", "--compressed", "-w", "\n__CODE__%{http_code}"];
    for (const [k, v] of Object.entries(BASE_HEADERS)) args.push("-H", `${k}: ${v}`);
    if (extraArgs) args.push(...extraArgs);
    args.push(url);

    execFile("curl", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        // --compressed 偶发解码错误，退回不带压缩
        const retryArgs = args.filter((a) => a !== "--compressed");
        return execFile("curl", retryArgs, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
          (e2, out2) => {
            if (e2) return reject(new Error(`curl 失败: ${(stderr || err.message || "").slice(0, 160)}`));
            resolve(splitBody(out2));
          });
      }
      resolve(splitBody(stdout));
    });
  });
}

function splitBody(raw) {
  const i = raw.lastIndexOf("\n__CODE__");
  if (i < 0) return { status: 0, body: raw };
  return { status: Number(raw.slice(i + 9)), body: raw.slice(0, i) };
}

function curlStatus(url) {
  return new Promise((resolve) => {
    execFile(
      "curl",
      ["-sL", "-m", "12", "-o", NULL_DEV, "-w", "%{http_code}", "-H", `User-Agent: ${UA}`, url],
      { encoding: "utf8" },
      (err, stdout) => resolve(err ? "000" : String(stdout).trim())
    );
  });
}

// ───────────────────────── 解析 ─────────────────────────

function unescapeSlashes(s) {
  return String(s || "").replace(/\\\//g, "/").replace(/\\u002F/g, "/");
}

/**
 * 从页面里抠出最大的 models 数组。
 * 该站是 SSR，房间数据直接内嵌在 HTML 的 "models":[...] 里。
 */
function extractModels(html) {
  const starts = [];
  const re = /"models":\[/g;
  let m;
  while ((m = re.exec(html)) !== null) starts.push(m.index);

  for (const si of starts) {
    const start = html.indexOf("[", si);
    if (start < 0) continue;

    let depth = 0;
    let end = -1;
    for (let j = start; j < html.length; j++) {
      const c = html[j];
      if (c === "[") depth++;
      else if (c === "]") {
        depth--;
        if (depth === 0) { end = j; break; }
      }
    }
    if (end < 0) continue;

    try {
      const arr = JSON.parse(unescapeSlashes(html.slice(start, end + 1)));
      if (Array.isArray(arr) && arr.length && arr[0] && arr[0].streamName) return arr;
    } catch (_) { /* 继续试下一个 */ }
  }
  return [];
}

function snapshotOf(room) {
  // 该站封面有稳定模板：/snapshot/{modelId}/{timestamp}
  if (room.snapshotTimestamp) {
    return `https://img.doppiocdn.org/snapshot/${room.id}/${room.snapshotTimestamp}`;
  }
  return unescapeSlashes(room.avatarUrl || "") || "";
}

function liveSince(room) {
  // 用 statusChangedAt 推算"已播多久"，没有就返回 null
  if (!room.statusChangedAt) return null;
  const t = Date.parse(room.statusChangedAt);
  if (!isFinite(t)) return null;
  const sec = Math.floor((Date.now() - t) / 1000);
  return sec > 0 ? sec : null;
}

function toRoom(room) {
  return {
    id: String(room.id || room.streamName || ""),
    title: room.username || `room ${room.id}`,
    username: room.username || "",
    cover: snapshotOf(room),
    isOnline: Boolean(room.isOnline && room.isLive),
    isLive: Boolean(room.isLive),
    status: room.status || "",
    viewers: Number(room.viewersCount || 0),
    duration: liveSince(room),
    streamName: String(room.streamName || ""),
    // 注意：这里不放 hls 地址。列表不写死，播放时才解析。
  };
}

// ───────────────────────── 播放地址解析 ─────────────────────────

function hlsCandidates(id) {
  // 该站流名恒等于房间 id；地址模板来自页面内嵌配置
  const hosts = ["edge-hls.doppiocdn.media", "edge-hls.doppiocdn.org"];
  const suffixes = ["", "_240p"];
  const out = [];
  for (const h of hosts) {
    for (const s of suffixes) {
      out.push(`https://${h}/hls/${id}/master/${id}${s}.m3u8`);
    }
  }
  return out;
}

/**
 * 从直播页实时抓最新地址。
 * 列表里的 hlsPlaylist 会失效（实测有 404 的情况），所以必须现抓。
 */
async function hlsFromListPage(id) {
  for (const tag of TAGS) {
    let page;
    try {
      page = await curl(`${SITE}/men/${tag}`);
    } catch (_) {
      continue;
    }
    if (page.status !== 200) continue;

    const rooms = extractModels(page.body);
    const hit = rooms.find((r) => String(r.id) === String(id) || String(r.streamName) === String(id));
    if (hit && hit.hlsPlaylist) {
      return { url: unescapeSlashes(hit.hlsPlaylist), room: hit, from: `men/${tag}` };
    }
  }
  return null;
}

async function resolvePlay(id) {
  // 1. 先试构造地址（快，无额外请求）
  for (const candidate of hlsCandidates(id)) {
    const code = await curlStatus(candidate);
    if (code === "200") {
      return { hls: candidate, quality: candidate.includes("_240p") ? "240p" : "source", source: "template" };
    }
  }

  // 2. 回退：抓列表页拿页面里给的最新地址
  const found = await hlsFromListPage(id);
  if (found) {
    const code = await curlStatus(found.url);
    if (code === "200") {
      return {
        hls: found.url,
        quality: found.url.includes("_240p") ? "240p" : "source",
        source: `list:${found.from}`,
      };
    }
  }

  return null;
}

// ───────────────────────── 路由 ─────────────────────────

function json(res, code, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

async function handleList(query, res) {
  const tag = (query.get("tag") || "daddies").toLowerCase().replace(/[^a-z0-9-]/g, "");
  const page = Math.max(1, parseInt(query.get("page") || "1", 10) || 1);

  const path = page === 1 ? `/men/${tag}` : `/men/${tag}/${page}`;
  const url = SITE + path;

  let resp;
  try {
    resp = await curl(url);
  } catch (e) {
    return json(res, 502, { ok: false, error: "抓取失败", detail: e.message, url });
  }

  if (resp.status !== 200) {
    return json(res, 502, { ok: false, error: `站点返回 ${resp.status}`, url });
  }

  const rooms = extractModels(resp.body).map(toRoom).filter((r) => r.id);
  if (!rooms.length) {
    return json(res, 200, {
      ok: true, tag, page, count: 0, liveCount: 0, rooms: [],
      note: "该分类没有解析到房间，可能分类名不对或页面结构变了",
      source: url,
    });
  }

  return json(res, 200, {
    ok: true,
    tag,
    page,
    count: rooms.length,
    liveCount: rooms.filter((r) => r.isOnline).length,
    source: url,
    fetchedAt: new Date().toISOString(),
    rooms,
  });
}

async function handlePlay(query, res) {
  const id = String(query.get("id") || "").replace(/[^0-9a-zA-Z_-]/g, "");
  if (!id) {
    return json(res, 400, { ok: false, error: "缺少 id 参数" });
  }

  let hit;
  try {
    hit = await resolvePlay(id);
  } catch (e) {
    return json(res, 502, { ok: false, error: "解析失败", detail: e.message, id });
  }

  if (!hit) {
    return json(res, 404, {
      ok: false,
      id,
      error: "没有解析到可播地址",
      hint: "主播可能没在播，或 streamName 与 id 不一致",
    });
  }

  return json(res, 200, {
    ok: true,
    id,
    hls: hit.hls,
    quality: hit.quality,
    source: hit.source,
    resolvedAt: new Date().toISOString(),
  });
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    });
    return res.end();
  }

  try {
    if (u.pathname === "/health") {
      return json(res, 200, { ok: true, service: "xhlive", uptime: process.uptime() });
    }
    if (u.pathname === "/api/live/tags") {
      return json(res, 200, { ok: true, tags: TAGS });
    }
    if (u.pathname === "/api/live/list") {
      return await handleList(u.searchParams, res);
    }
    if (u.pathname === "/api/live/play") {
      return await handlePlay(u.searchParams, res);
    }
    return json(res, 404, {
      ok: false,
      error: "未知路径",
      routes: ["/api/live/list", "/api/live/play", "/api/live/tags", "/health"],
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: String(e.message || e) });
  }
});

if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`xhlive api listening on http://${HOST}:${PORT}`);
    console.log(`  list : http://127.0.0.1:${PORT}/api/live/list?tag=daddies&page=1`);
    console.log(`  play : http://127.0.0.1:${PORT}/api/live/play?id=185707842`);
  });
}

module.exports = { extractModels, toRoom, resolvePlay, curl };
