/**
 * Rex 模块：XLive Men（zh.xlivesex.com 男同直播）
 *
 * 结构照抄 xh-gay.js v20 的契约（ONE一个 v2.2.0 已验证的写法）：
 *   - 条目 type: "detail"，入口字段 link
 *   - 每个 module 带 requiresWebView: false
 *   - 只有 loadResource 带 type: "stream"
 *   - 顶层 search / detailCacheDuration
 *   - loadResource 返回 [{ name, description, url }]
 *
 * 数据来自自建后端（见 server.js）：
 *   GET {API}/api/live/list?tag=daddies&page=1   房间列表
 *
 * 关键设计（v1.0.3 网页播放版）：
 *   公开 HLS 地址播出来是 12 秒广告片（CDN 只给进过房间的观众放真流，
 *   直接拿 m3u8 去播拿不到），所以改成网页播放：点房间后在 Rex 的
 *   WebView 里打开网站房间页，用网站自己的播放器播直播。
 *   列表仍由后端供，播放模块 requiresWebView: true。
 */

// ★★★ 后端地址：新加坡服务器公网 IP，8787 端口 ★★★
var API_BASE = "http://49.0.207.168:8787";

// ★★★ 模块 ID。Rex 按 ID 缓存，每次改代码必须换新 ID ★★★
WidgetMetadata = {
  id: "user.xllive4",
  title: "XLive Men",
  description: "xlivesex 男同直播 · 网页播放（网站自己的播放器播直播）",
  author: "YG",
  version: "1.0.3",
  requiredVersion: "0.0.1",
  detailCacheDuration: 0,
  site: "https://zh.xlivesex.com",
  iconurl: "https://zh.xlivesex.com/favicon.ico",

  search: {
    title: "搜索主播",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "" },
    ],
  },

  modules: [
    {
      id: "xl-resource",
      title: "播放资源",
      description: "网页播放（网站自己的播放器播直播）",
      requiresWebView: true,
      cacheDuration: 0,
      functionName: "loadResource",
      type: "stream",
      params: [
        { name: "link", title: "房间链接", type: "input", value: "" },
        { name: "title", title: "标题", type: "input", value: "" },
      ],
    },
    {
      id: "xl-daddies",
      title: "Daddies",
      description: "daddies 分类在播房间",
      requiresWebView: false,
      cacheDuration: 0, // 直播实时刷新，不缓存
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "daddies" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xl-twinks",
      title: "Twinks",
      description: "twinks 分类在播房间",
      requiresWebView: false,
      cacheDuration: 0, // 直播实时刷新，不缓存
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "twinks" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xl-jocks",
      title: "Jocks",
      description: "jocks 分类在播房间",
      requiresWebView: false,
      cacheDuration: 0, // 直播实时刷新，不缓存
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "jocks" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xl-bears",
      title: "Bears",
      description: "bears 分类在播房间",
      requiresWebView: false,
      cacheDuration: 0, // 直播实时刷新，不缓存
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "bears" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xl-muscle",
      title: "Muscle",
      description: "muscle 分类在播房间",
      requiresWebView: false,
      cacheDuration: 0, // 直播实时刷新，不缓存
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "muscle" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xl-asian",
      title: "Asian",
      description: "asian 分类在播房间",
      requiresWebView: false,
      cacheDuration: 0, // 直播实时刷新，不缓存
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "asian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xl-latin",
      title: "Latin",
      description: "latin 分类在播房间",
      requiresWebView: false,
      cacheDuration: 0, // 直播实时刷新，不缓存
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "latin" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xl-black",
      title: "Black",
      description: "black 分类在播房间",
      requiresWebView: false,
      cacheDuration: 0, // 直播实时刷新，不缓存
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "black" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xl-mature",
      title: "Mature",
      description: "mature 分类在播房间",
      requiresWebView: false,
      cacheDuration: 0, // 直播实时刷新，不缓存
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "mature" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xl-college",
      title: "College",
      description: "college 分类在播房间",
      requiresWebView: false,
      cacheDuration: 0, // 直播实时刷新，不缓存
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "college" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xl-amateur",
      title: "Amateur",
      description: "amateur 分类在播房间",
      requiresWebView: false,
      cacheDuration: 0, // 直播实时刷新，不缓存
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "amateur" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xl-couples",
      title: "Couples",
      description: "couples 分类在播房间",
      requiresWebView: false,
      cacheDuration: 0, // 直播实时刷新，不缓存
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "couples" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
  ],
};

// ───────────────────────── 工具 ─────────────────────────

function xlSecondsToText(sec) {
  var s = Math.max(0, Math.round(Number(sec) || 0));
  var h = Math.floor(s / 3600);
  var m = Math.floor((s % 3600) / 60);
  var r = s % 60;
  var p = function (v) {
    return v < 10 ? "0" + v : String(v);
  };
  return h > 0 ? h + ":" + p(m) + ":" + p(r) : m + ":" + p(r);
}

function withImages(item, url) {
  if (!url) return item;
  item.coverUrl = url;
  item.posterUrl = url;
  item.posterURL = url;
  item.posterurl = url;
  item.poster_url = url;
  item.posterPath = url;
  item.poster_path = url;
  item.backdropPath = url;
  item.backdropPaths = [url];
  item.thumbnailUrl = url;
  item.imageUrl = url;
  item.detailPoster = url;
  item.detailPosterUrl = url;
  item.detailPosterURL = url;
  item.detail_poster = url;
  item.detail_poster_path = url;
  return item;
}

async function apiGet(path, query) {
  var qs = [];
  for (var k in query) {
    if (!Object.prototype.hasOwnProperty.call(query, k)) continue;
    qs.push(encodeURIComponent(k) + "=" + encodeURIComponent(String(query[k])));
  }
  var url = API_BASE.replace(/\/+$/, "") + path + (qs.length ? "?" + qs.join("&") : "");

  var resp = await Widget.http.get(url, { allow_redirects: true });
  var data = resp && resp.data !== undefined ? resp.data : resp;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      throw new Error("接口返回的不是 JSON：" + String(data).slice(0, 80));
    }
  }
  if (!data) throw new Error("接口空响应");
  return data;
}

// ───────────────────────── 列表 ─────────────────────────

async function loadList(params) {
  params = params || {};
  var kind = params.kind || "daddies";
  var page = parseInt(String(params.page == null ? "1" : params.page), 10);
  if (!isFinite(page) || page < 1) page = 1;

  console.log("[xl] loadList kind=" + kind + " page=" + page);

  var data = await apiGet("/api/live/list", { tag: kind, page: page });
  var rooms = (data && data.rooms) || [];

  var items = [];
  for (var i = 0; i < rooms.length; i++) {
    var r = rooms[i];
    if (!r || !r.id) continue;

    var bits = [];
    if (r.viewers) bits.push("观众 " + r.viewers);
    if (r.duration) bits.push("已播 " + xlSecondsToText(r.duration));
    if (!r.isOnline) bits.push("离线");
    if (r.status === "groupShow") bits.push("群演");
    else if (r.status === "private") bits.push("私密");

    var item = {
      id: String(r.id),
      type: "detail",
      mediaType: "movie",
      title: r.title || String(r.id),
      link: "https://zh.xlivesex.com/" + encodeURIComponent(r.title || r.id),
      description: bits.join(" · "),
    };
    if (r.duration) {
      item.duration = r.duration;
      item.durationText = xlSecondsToText(r.duration);
    }
    items.push(withImages(item, r.cover));
  }

  console.log("[xl] loadList -> " + items.length + " 条");
  return items;
}

// ───────────────────────── 搜索 ─────────────────────────
// 后端没有搜索接口：把 6 个分类的第 1 页都拉下来，按主播名/标题过滤。
// 直播间一直在变，搜的是当前在播的房间。

var XL_TAGS = ["daddies", "twinks", "jocks", "bears", "muscle", "asian", "latin", "black", "mature", "college", "amateur", "couples"];

async function searchVideos(params) {
  params = params || {};
  var keyword = String(params.keyword || "").trim().toLowerCase();
  if (!keyword) return [];

  console.log("[xl] search keyword=" + keyword);

  var out = [];
  var seen = {};
  for (var t = 0; t < XL_TAGS.length; t++) {
    var items;
    try {
      items = await loadList({ kind: XL_TAGS[t], page: 1 });
    } catch (e) {
      continue;
    }
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (seen[it.id]) continue;
      var hay = ((it.title || "") + " " + (it.id || "")).toLowerCase();
      if (hay.indexOf(keyword) < 0) continue;
      seen[it.id] = true;
      out.push(it);
    }
  }

  console.log("[xl] search -> " + out.length + " 条");
  return out;
}

// ───────────────────────── 详情（直播用不到，给个最小版） ─────────────────────────

function roomIdFromLink(link) {
  var raw = String(link || "").trim();
  if (!raw) return "";
  if (raw.indexOf("xl://room/") === 0) return raw.slice(10);
  if (/^\d+$/.test(raw)) return raw;
  var m = raw.match(/room\/(\d+)/);
  if (m) return m[1];
  return "";
}

// 从链接里拿主播名（网页地址 https://zh.xlivesex.com/<username>）
function usernameFromLink(link) {
  var raw = String(link || "").trim();
  var m = raw.match(/xlivesex\.com\/([^\/?#]+)/);
  if (m) return decodeURIComponent(m[1]);
  return "";
}

async function loadDetail(link) {
  var username = usernameFromLink(link);
  var id = roomIdFromLink(link);
  var title = username || ("房间 " + id);
  if (!username && !id) throw new Error("无法识别房间链接：" + link);

  return {
    id: id || username,
    type: "detail",
    mediaType: "movie",
    title: title,
    link: String(link),
    description: "直播房间（网页播放）",
  };
}

// ───────────────────────── 播放地址 ─────────────────────────

async function loadResource(params) {
  // Rex 有时传对象，有时直接传字符串
  var link = "";
  var title = "";
  if (typeof params === "string") link = params;
  else if (params) {
    link = params.link || params.url || params.id || "";
    title = params.title || "";
  }

  // 优先用 link 里的网页地址
  var webUrl = "";
  if (String(link).indexOf("http") === 0) webUrl = String(link);
  var username = usernameFromLink(link) || title;
  if (!webUrl && username) webUrl = "https://zh.xlivesex.com/" + encodeURIComponent(username);

  if (!webUrl) {
    return [{ name: "⚠️ 未收到房间地址", description: "传进来的 link=" + String(link).slice(0, 80), url: "" }];
  }

  console.log("[xl] loadResource webview -> " + webUrl);

  return [{
    name: "网页播放",
    description: "网站自己的播放器播直播",
    url: webUrl,
  }];
}

// 兼容别名
var getDetail = loadDetail;
var loadResources = loadResource;
var stream = loadResource;
var mediaHook = loadResource;
