/**
 * Rex 模块：XLive Men v1.5（直播 + 账号，链接抗重启）
 *
 * 模块 ID: user.xllive15   ← Rex 里导入时若提示"已存在相同 ID"，用"覆盖文件"
 *
 * v1.5 关键变化（2026-11-18）：
 *   1) API_BASE 改指新加坡 VPS 中继 http://49.0.207.168:8788
 *      （旧 trycloudflare 隧道已死；中继 MemoryMax 已放宽到 1G，
 *       2026-11-18 起播验证通过：真视频 33 段/168 秒）
 *   2) 模块 ID 改为 user.xllive15，子模块 ID 改为 xl15-*（防 Rex 旧 ID 缓存）
 *
 * v1.4 关键变化（修 "no session" 与 "一直转圈"）：
 *   1) 播放地址改为【按房间号寻址】：/api/live/hls/<房间号>
 *      中继重启/会话回收后，播放器再请求会自动重建会话，不会再撞 no session
 *   2) 去掉 setTimeout 轮询（Rex 没有 setTimeout）：一次拿到链接就返回，
 *      起播中由播放器自己重试，界面不再无限等待
 *   3) 私密/群演的打码流由中继过滤，不会混进正片
 *
 * 相对 v1.2 的变化：
 *   1) 新增「我的账号」页：可粘贴站点登录 Cookie / 访问 Token
 *      - 存在 Rex 本机（Widget.storage），不写进模块文件
 *      - 保存后自动调 /api/live/me 校验是否真的登录成功
 *   2) 列表与播放请求会自动带上 Cookie / Token 头，由中继注入到浏览器
 *   3) 留空提交 = 清除该项
 *
 * 说明：Cookie/Token 只用于"让你自己的账号在浏览器里生效"，
 *       私密/付费房能否出画面仍取决于该账号是否持有对应票据。
 */

var API_BASE = "http://49.0.207.168:8788";

var XL_COOKIE_KEY = "xl_cookie";
var XL_TOKEN_KEY = "xl_token";

WidgetMetadata = {
  id: "user.xllive15",
  title: "XLive Men",
  description: "xlivesex 男同直播 · 中继取流，标准 HLS；可选登录 Cookie",
  author: "YG",
  version: "1.5.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 0,
  site: "https://zh.xlivesex.com",
  iconurl: "https://zh.xlivesex.com/favicon.ico",

  modules: [
    {
      id: "xl15-account",
      title: "我的账号",
      description: "粘贴登录 Cookie / Token（可选，存在本机）",
      requiresWebView: false,
      cacheDuration: 0,
      functionName: "loadAccount",
      type: "list",
      params: [
        { name: "cookie", title: "登录 Cookie", type: "input", value: "" },
        { name: "token", title: "访问 Token（可留空）", type: "input", value: "" },
      ],
    },
    {
      id: "xl15-resource",
      title: "直播播放",
      description: "按需起播（真实画面，标准 HLS）",
      requiresWebView: false,
      cacheDuration: 0,
      functionName: "loadResource",
      type: "stream",
      params: [
        { name: "link", title: "房间链接", type: "input", value: "" },
        { name: "title", title: "标题", type: "input", value: "" },
      ],
    },
    { id: "xl15-daddies", title: "Daddies", description: "daddies 分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "daddies" }, { name: "page", title: "页码", type: "page" } ] },
    { id: "xl15-twinks",  title: "Twinks",  description: "twinks 分类",  requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "twinks" },  { name: "page", title: "页码", type: "page" } ] },
    { id: "xl15-jocks",   title: "Jocks",   description: "jocks 分类",   requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "jocks" },   { name: "page", title: "页码", type: "page" } ] },
    { id: "xl15-bears",   title: "Bears",   description: "bears 分类",   requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "bears" },   { name: "page", title: "页码", type: "page" } ] },
    { id: "xl15-muscle",  title: "Muscle",  description: "muscle 分类",  requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "muscle" },  { name: "page", title: "页码", type: "page" } ] },
    { id: "xl15-asian",   title: "Asian",   description: "asian 分类",   requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "asian" },   { name: "page", title: "页码", type: "page" } ] },
    { id: "xl15-latin",   title: "Latin",   description: "latin 分类",   requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "latin" },   { name: "page", title: "页码", type: "page" } ] },
    { id: "xl15-black",   title: "Black",   description: "black 分类",   requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "black" },   { name: "page", title: "页码", type: "page" } ] },
    { id: "xl15-mature",  title: "Mature",  description: "mature 分类",  requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "mature" },  { name: "page", title: "页码", type: "page" } ] },
    { id: "xl15-college", title: "College", description: "college 分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "college" }, { name: "page", title: "页码", type: "page" } ] },
    { id: "xl15-amateur", title: "Amateur", description: "amateur 分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "amateur" }, { name: "page", title: "页码", type: "page" } ] },
    { id: "xl15-couples", title: "Couples", description: "couples 分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "couples" }, { name: "page", title: "页码", type: "page" } ] },
  ],
};

// ───────────── 凭据存取（只在本机） ─────────────

function storeGet(key) {
  try {
    if (typeof Widget !== "undefined" && Widget.storage && typeof Widget.storage.get === "function") {
      return Widget.storage.get(key) || "";
    }
  } catch (e) { /* ignore */ }
  return "";
}

function storeSet(key, value) {
  try {
    if (typeof Widget !== "undefined" && Widget.storage && typeof Widget.storage.set === "function") {
      Widget.storage.set(key, String(value == null ? "" : value));
      return true;
    }
  } catch (e) { /* ignore */ }
  return false;
}

// 去掉 CF / ABTest / 统计类噪声，只留鉴权相关的
function cleanCookie(cookie) {
  if (!cookie) return "";
  var drop = /^(__cf|cf_|_ga|_gid|_fbp|ABTest_|ab_|avStartedAt|_dd_)/i;
  var out = [];
  var parts = String(cookie).split(";");
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i].trim();
    if (!p || p.indexOf("=") <= 0) continue;
    var name = p.slice(0, p.indexOf("=")).trim();
    if (drop.test(name)) continue;
    out.push(p);
  }
  return out.join("; ");
}

function cookieHeader() {
  var c = cleanCookie(storeGet(XL_COOKIE_KEY));
  return c;
}

function tokenHeader() {
  return String(storeGet(XL_TOKEN_KEY) || "").trim();
}

// ───────────── HTTP ─────────────

async function apiGet(path, query) {
  var qs = [];
  for (var k in query) {
    if (!Object.prototype.hasOwnProperty.call(query, k)) continue;
    if (query[k] == null || query[k] === "") continue;
    qs.push(encodeURIComponent(k) + "=" + encodeURIComponent(String(query[k])));
  }
  var url = API_BASE.replace(/\/+$/, "") + path + (qs.length ? "?" + qs.join("&") : "");

  var headers = {};
  var c = cookieHeader();
  var t = tokenHeader();
  if (c) headers["X-XL-Cookie"] = c;
  if (t) headers["X-XL-Token"] = t;

  var resp = await Widget.http.get(url, { headers: headers, allow_redirects: true });
  var data = resp && resp.data !== undefined ? resp.data : resp;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch (e) { throw new Error("接口非 JSON: " + String(data).slice(0, 80)); }
  }
  return data || {};
}


// ───────────── 我的账号 ─────────────

async function loadAccount(params) {
  params = params || {};
  var inCookie = params.cookie != null ? String(params.cookie).trim() : "";
  var inToken = params.token != null ? String(params.token).trim() : "";

  var touched = false;
  if (inCookie) { storeSet(XL_COOKIE_KEY, cleanCookie(inCookie)); touched = true; }
  if (inToken) { storeSet(XL_TOKEN_KEY, inToken); touched = true; }

  var savedCookie = cookieHeader();
  var savedToken = tokenHeader();

  // 提交了东西就顺手校验一次
  var check = null;
  if (touched) {
    try { check = await apiGet("/api/live/me", {}); } catch (e) { check = { ok: false, error: String(e.message || e) }; }
  }

  var items = [];

  if (!savedCookie && !savedToken) {
    items.push({
      id: "xl-account-empty",
      type: "detail",
      mediaType: "movie",
      title: "未登录（匿名模式）",
      description: "公开房/群演房不需要登录也能看。要看私密房请把浏览器里已登录的 Cookie 粘到「登录 Cookie」提交；Token 可留空。",
      link: "xl://account",
    });
    return items;
  }

  var stateTitle = "已保存";
  var stateDesc = "登录信息已存在本机。列表/播放请求会自动带上它。";
  if (check) {
    if (check.loggedIn) {
      stateTitle = "已登录 ✅";
      stateDesc = "中继已用这份 Cookie 通过登录态校验（streamSpecifics 200）。去看私密房吧。";
    } else {
      stateTitle = "已保存，但校验未通过 ⚠️";
      stateDesc = "接口探针返回 " + (check.probeStatus || "?") + "，通常意味着 Cookie 过期或不完整。请在浏览器重新登录后复制整条 Cookie 再提交。";
    }
  }

  items.push({
    id: "xl-account-status",
    type: "detail",
    mediaType: "movie",
    title: stateTitle,
    description: stateDesc + " Cookie 长度 " + savedCookie.length + (savedToken ? " · 含 Token" : ""),
    link: "xl://account",
  });

  items.push({
    id: "xl-account-help",
    type: "detail",
    mediaType: "movie",
    title: "怎么拿 Cookie",
    description: "浏览器登录 zh.xlivesex.com → F12 → Network → 任一请求的 Request Headers 里复制整条 Cookie；或在 Console 执行 document.cookie。粘贴后提交即可。留空提交=清除。",
    link: "xl://account",
  });

  return items;
}

// ───────────── 列表 ─────────────

function xlSec(sec) {
  var s = Math.max(0, Math.round(Number(sec) || 0));
  var m = Math.floor(s / 60), r = s % 60;
  return m + ":" + (r < 10 ? "0" + r : r);
}

function withImages(item, url) {
  if (!url) return item;
  item.coverUrl = url; item.posterUrl = url; item.posterURL = url;
  item.posterurl = url; item.poster_url = url; item.posterPath = url;
  item.poster_path = url; item.backdropPath = url; item.backdropPaths = [url];
  item.thumbnailUrl = url; item.imageUrl = url; item.detailPoster = url;
  item.detailPosterUrl = url; item.detailPosterURL = url;
  item.detailPosterUrl_ = url; item.detail_poster = url; item.detail_poster_path = url;
  return item;
}

async function loadList(params) {
  params = params || {};
  var kind = params.kind || "daddies";
  var page = parseInt(String(params.page == null ? "1" : params.page), 10);
  if (!isFinite(page) || page < 1) page = 1;

  var data = await apiGet("/api/live/list", { tag: kind, page: page });
  var rooms = (data && data.rooms) || [];
  var items = [];

  for (var i = 0; i < rooms.length; i++) {
    var r = rooms[i];
    if (!r || !r.id) continue;

    var bits = [];
    if (r.viewers) bits.push("观众 " + r.viewers);
    bits.push(r.isLive ? "在播" : "离线");
    if (r.status === "groupShow") bits.push("群演");
    else if (r.status === "private") bits.push("私密");
    else if (r.status === "public") bits.push("公开");

    var item = {
      id: String(r.id),
      type: "detail",
      mediaType: "movie",
      title: r.title || String(r.id),
      link: "xl://room/" + r.id + "/" + (r.username || ""),
      description: bits.join(" · "),
    };
    items.push(withImages(item, r.cover));
  }
  return items;
}

// ───────────── 详情（预热起播） ─────────────

function parseLink(link) {
  var raw = String(link || "").trim();
  var m = raw.match(/(\d{5,})(?:\/([\w.\-]+))?/);
  if (!m) return { id: "", user: "" };
  return { id: m[1], user: m[2] || "" };
}

async function loadDetail(link) {
  var p = parseLink(link);
  if (!p.id) throw new Error("无法识别房间链接：" + link);

  try { apiGet("/api/live/play", { id: p.id, user: p.user }).catch(function () {}); } catch (e) {}

  return {
    id: p.id,
    type: "detail",
    mediaType: "movie",
    title: "房间 " + p.id,
    link: "xl://room/" + p.id + "/" + p.user,
    description: "点播放开始加载（首次约 10–20 秒起播）" + (cookieHeader() ? " · 登录态" : ""),
  };
}

// ───────────── 播放 ─────────────

async function loadResource(params) {
  var link = "";
  if (typeof params === "string") link = params;
  else if (params) link = params.link || params.url || params.id || "";

  var p = parseLink(link);
  if (!p.id) {
    return [{ name: "⚠️ 未收到房间 id", description: "link=" + String(link).slice(0, 80), url: "" }];
  }

  // 一次拿不到（中继刚重启/网络抖动）就立刻再试一次；不用任何定时器
  var data = null;
  var lastErr = "";
  for (var attempt = 0; attempt < 2; attempt++) {
    try {
      data = await apiGet("/api/live/play", { id: p.id, user: p.user });
      if (data && (data.hls || data.error)) break;
    } catch (e) {
      lastErr = String(e.message || e);
      data = null;
    }
  }
  if (!data) {
    return [{ name: "❌ 中继不可达", description: (lastErr || "两次请求都没拿到响应").slice(0, 120), url: "" }];
  }

  // 只要给了链接就直接交给播放器：没出片时中继回的是"合法空清单"，
  // 播放器会自己重试，等分片进来就自动起播（不再用 setTimeout 阻塞界面）。
  if (data && data.hls) {
    var ready = !!data.ok;
    return [{
      name: ready ? "直播 · 实时" + (cookieHeader() ? " · 登录态" : "") : "直播 · 起播中",
      description: ready
        ? "中继取流 · " + (data.segments || 0) + " 段缓冲"
        : "中继正在拉起浏览器，播放器会自动重试（约 10–20 秒）",
      url: data.hls,
    }];
  }

  return [{
    name: "❌ 没拿到播放地址",
    description: (data && (data.hint || data.error)) || "中继未返回 hls",
    url: "",
  }];
}

// 兼容别名
var getDetail = loadDetail;
var loadResources = loadResource;
var stream = loadResource;
var mediaHook = loadResource;