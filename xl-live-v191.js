/**
* Rex 模块：XLive Men v1.9.1（离线收藏强行拉视频 + 登录校验改走收藏接口）
*
* 模块 ID: user.xllive191   ← Rex 里导入时若提示"已存在相同 ID"，用"覆盖文件"
*
* v1.9.1 关键变化（2026-11-18）：
*   1) 我的最爱：离线主播若没带 videos[]，强行拉一次主页视频
*      （/api/live/videos?id=<主播 id>），保证离线录像一定出现，
*      不依赖收藏接口是否附带；失败的单个主播不影响整个列表。
*   2) 我的账号：登录校验改走真正需要登录的收藏接口
*      （/api/live/favorites），/api/live/me 探针会误报 403
*      （Cookie 有效它也 403），不再以它为准；探针只作后备。
*   3) 模块 ID 改为 user.xllive191，子模块 ID 改为 xl191-*。
*
* v1.9 关键变化（2026-11-18，配中继 2022ceb1）：
* 1) 分类只留网站的 8 个：老爹 / 成熟 / 老爷爷 / 中文 / 肌肉发达 / 中 / 矮胖 / 大
* （kind 取值即中继 tag：daddies / mature / grandpas / chinese /
* muscle / medium / chunky / big；翻页走 hasMore，limit=12）。
* 2) 「推荐」改走中继 /api/live/recommended（登录后个性化），
* 「我的最爱」走 /api/live/favorites（在线+离线合并，离线主播附 videos[]）。
* 两者都登录门控：未登录时只显示一条提示，不调接口。
* 3) 离线主播的录像直接可播：每条视频带 hls（中继 /api/vod/playlist 反代），
* 点开即播；accessMode=paidOrFanClub（cost 99）的是预告片，模块标“需购买”。
* 4) 状态徽标：按 isLive + status 显示 在播 / 离线 / 未知，另标 群演/私密/公开。
* 5) hls 地址做归一化：中继若回 127.0.0.1/localhost，一律换成中继公网地址。
* 6) 模块 ID 改为 user.xllive19，子模块 ID 改为 xl19-*（防 Rex 旧 ID 缓存）。
*
* v1.8 关键变化（2026-11-18）：
* 1) 分类名翻成中文（只改显示名，kind 取值保持英文，接口不受影响）。
* 2) 模块 ID 改为 user.xllive18，子模块 ID 改为 xl18-*。
*
* v1.7 关键变化（2026-11-18，配中继 v1.8.1）：
* 1) 处理 hls:null：中继没热好时回 ok:false + hls:null + hint，
* 模块不再显示"❌ 没拿到播放地址"，改显示"直播 · 起播中" + 提示语。
*
* v1.6 关键变化（2026-11-18）：
* 1) 新增「推荐」tab：把最对味的 5 个分类并起来，去重后按观众数排。
*
* v1.5 关键变化（2026-11-18）：
* 1) API_BASE 改指新加坡 VPS 中继 http://49.0.207.168:8788。
*
* v1.4 关键变化（修 "no session" 与 "一直转圈"）：
* 1) 播放地址改为：/api/live/hls/<房间号>。
* 2) 去掉 setTimeout 轮询（Rex 没有 setTimeout）。
*
* 相对 v1.2 的变化：
* 1) 新增「我的账号」页：可粘贴站点登录 Cookie / 访问 Token（存在 Rex 本机）。
* 2) 列表与播放请求会自动带上 Cookie / Token 头，由中继注入到浏览器。
*
* 说明：Cookie/Token 只用于"让你自己的账号在浏览器里生效"，
* 私密/付费房能否出画面仍取决于该账号是否持有对应票据。
*/

var API_BASE = "http://49.0.207.168:8788";

var XL_COOKIE_KEY = "xl_cookie";
var XL_TOKEN_KEY = "xl_token";

WidgetMetadata = {
id: "user.xllive191",
title: "XLive Men",
description: "xlivesex 男同直播 · 中继取流，标准 HLS；8 分类 + 登录推荐/最爱 + 离线录像",
author: "YG",
version: "1.9.1",
requiredVersion: "0.0.1",
detailCacheDuration: 0,
site: "https://zh.xlivesex.com",
iconurl: "https://zh.xlivesex.com/favicon.ico",

modules: [
{
id: "xl191-account",
title: "我的账号",
description: "粘贴登录 Cookie / Token（可选，存在本机）",
requiresWebView: false,
cacheDuration: 0,
functionName: "loadAccount",
type: "list",
params: [
{ name: "cookie", title: "登录 Cookie", type: "input", value: ""},
{ name: "token", title: "访问 Token（可留空）", type: "input", value: ""},
],
},
{
id: "xl191-resource",
title: "直播播放",
description: "按需起播（真实画面，标准 HLS）",
requiresWebView: false,
cacheDuration: 0,
functionName: "loadResource",
type: "stream",
params: [
{ name: "link", title: "房间链接", type: "input", value: ""},
{ name: "title", title: "标题", type: "input", value: ""},
],
},
{ id: "xl191-rec", title: "推荐", description: "登录后个性化推荐（需 Cookie）", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "rec"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl191-fav", title: "我的最爱", description: "登录后看收藏主播与离线录像", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "fav"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl191-daddies", title: "老爹", description: "老爹分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "daddies"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl191-mature", title: "成熟", description: "成熟分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "mature"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl191-grandpas", title: "老爷爷", description: "老爷爷分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "grandpas"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl191-chinese", title: "中文", description: "中文分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "chinese"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl191-muscle", title: "肌肉发达", description: "肌肉发达分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "muscle"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl191-medium", title: "中", description: "中体型分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "medium"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl191-chunky", title: "矮胖", description: "矮胖分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "chunky"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl191-big", title: "大", description: "大体型分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "big"}, { name: "page", title: "页码", type: "page"}]},
],
};

// ───────────── 凭据存取（只在本机） ─────────────

function storeGet(key) {
try {
if (typeof Widget!== "undefined" && Widget.storage && typeof Widget.storage.get === "function") {
return Widget.storage.get(key) || "";
}
} catch (e) { /* ignore */}
return "";
}

function storeSet(key, value) {
try {
if (typeof Widget!== "undefined" && Widget.storage && typeof Widget.storage.set === "function") {
Widget.storage.set(key, String(value == null? "": value));
return true;
}
} catch (e) { /* ignore */}
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
var url = API_BASE.replace(/\/+$/, "") + path + (qs.length? "?" + qs.join("&"): "");

var headers = {};
var c = cookieHeader();
var t = tokenHeader();
if (c) headers["X-XL-Cookie"] = c;
if (t) headers["X-XL-Token"] = t;

var resp = await Widget.http.get(url, { headers: headers, allow_redirects: true});
var data = resp && resp.data!== undefined? resp.data: resp;
if (typeof data === "string") {
try { data = JSON.parse(data);} catch (e) { throw new Error("接口非 JSON: " + String(data).slice(0, 80));}
}
return data || {};
}

// ───────────── hls 地址归一化 ─────────────

function normalizeHls(url) {
var u = String(url || "");
if (!u) return u;
var base = API_BASE.replace(/\/+$/, "");
// 中继若回了本机地址（127.0.0.1 / localhost），一律换成中继公网地址
u = u.replace(/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/, base);
if (u.charAt(0) === "/") return base + u;
return u;
}

function isVodLink(link) {
return String(link || "").indexOf("xl://vod/") === 0;
}

function vodHlsFromLink(link) {
try {
var enc = String(link).slice("xl://vod/".length);
if (!enc) return "";
return normalizeHls(decodeURIComponent(enc));
} catch (e) { return "";}
}

// ───────────── 我的账号 ─────────────

async function loadAccount(params) {
params = params || {};
var inCookie = params.cookie!= null? String(params.cookie).trim(): "";
var inToken = params.token!= null? String(params.token).trim(): "";

var touched = false;
if (inCookie) { storeSet(XL_COOKIE_KEY, cleanCookie(inCookie)); touched = true;}
if (inToken) { storeSet(XL_TOKEN_KEY, inToken); touched = true;}

var savedCookie = cookieHeader();
var savedToken = tokenHeader();

// 提交了东西就顺手校验一次：用真正需要登录的收藏接口验
// （/api/live/me 探针会误报 403，Cookie 有效它也 403，不以它为准；探针只作后备）
var check = null;
if (touched) {
try {
var favCheck = await apiGet("/api/live/favorites", {});
if (favCheck && favCheck.needLogin) { check = { loggedIn: false }; }
else if (favCheck && favCheck.ok) { check = { loggedIn: true }; }
else { try { check = await apiGet("/api/live/me", {}); } catch (e2) { check = { ok: false, error: String(e2.message || e2) }; } }
} catch (e) {
try { check = await apiGet("/api/live/me", {}); } catch (e2) { check = { ok: false, error: String(e.message || e) }; }
}
}

var items = [];

if (!savedCookie &&!savedToken) {
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
stateDesc = "中继已用这份 Cookie 通过登录态校验。去看私密房和我的最爱吧。";
} else {
stateTitle = "已保存，但校验未通过 ⚠️";
stateDesc = "收藏接口返回 needLogin，Cookie 可能过期或不完整。请在浏览器重新登录后复制整条 Cookie 再提交。";
}
}

items.push({
id: "xl-account-status",
type: "detail",
mediaType: "movie",
title: stateTitle,
description: stateDesc + " Cookie 长度 " + savedCookie.length + (savedToken? " · 含 Token": ""),
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
return m + ":" + (r < 10? "0" + r: r);
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

function statusBits(r) {
var bits = [];
if (r.viewers) bits.push("观众 " + r.viewers);
if (r.isLive) bits.push("在播");
else if (r.status === "offline") bits.push("离线");
else if (r.status === "unknown" ||!r.status) bits.push("未知");
else bits.push("离线");
if (r.status === "groupShow") bits.push("群演");
else if (r.status === "private") bits.push("私密");
else if (r.status === "public") bits.push("公开");
return bits;
}

function roomItem(r) {
var item = {
id: String(r.id),
type: "detail",
mediaType: "movie",
title: r.title || r.username || String(r.id),
link: "xl://room/" + r.id + "/" + (r.username || ""),
description: statusBits(r).join(" · "),
};
return withImages(item, r.cover);
}

function videoItem(v, userId) {
var bits = [];
if (v.duration) bits.push(xlSec(v.duration));
if (v.playable === false) bits.push("不可播");
else bits.push("可播");
if (v.accessMode === "paidOrFanClub") {
bits.push("需购买" + (v.cost? " · ¥" + v.cost: ""));
bits.push("预告片");
}
var hls = normalizeHls(v.hls || "");
var item = {
id: "vod-" + String(v.id || "") + "-" + String(userId || ""),
type: "detail",
mediaType: "movie",
title: v.title || "录像",
link: "xl://vod/" + encodeURIComponent(hls),
description: bits.join(" · "),
};
return withImages(item, v.cover);
}

function loginHintItem(tabTitle) {
return [{
id: "xl-login-hint",
type: "detail",
mediaType: "movie",
title: "未登录",
description: "「" + tabTitle + "」需要登录：先在「我的账号」粘贴 Cookie，保存后再打开。",
link: "xl://account",
}];
}

function emptyHintItem(id, title, desc) {
return [{
id: id,
type: "detail",
mediaType: "movie",
title: title,
description: desc,
link: "xl://account",
}];
}

async function loadList(params) {
params = params || {};
var kind = params.kind || "daddies";
var page = parseInt(String(params.page == null? "1": params.page), 10);
if (!isFinite(page) || page < 1) page = 1;

// ── 推荐：登录门控，走中继推荐接口（登录后个性化） ──
if (kind === "rec") {
if (!cookieHeader()) return loginHintItem("推荐");
var rec = await apiGet("/api/live/recommended", { limit: 60, page: page});
if (rec && rec.needLogin) return loginHintItem("推荐");
var recRooms = (rec && rec.rooms) || [];
if (!recRooms.length) {
if (rec && rec.ok === false) return emptyHintItem("xl-rec-error", "推荐未加载", "推荐接口未返回内容：" + (rec.hint || rec.error || "未知"));
return emptyHintItem("xl-rec-empty", "暂无推荐", "推荐列表是空的，稍后再来。");
}
var recItems = [];
for (var i = 0; i < recRooms.length; i++) {
if (recRooms[i] && recRooms[i].id) recItems.push(roomItem(recRooms[i]));
}
return recItems;
}

// ── 我的最爱：登录门控，在线+离线合并；离线主播的录像直接列出来点开即播 ──
if (kind === "fav") {
if (!cookieHeader()) return loginHintItem("我的最爱");
if (page > 1) return []; // 收藏接口不翻页，一次全回
var fav = await apiGet("/api/live/favorites", {});
if (fav && fav.needLogin) return loginHintItem("我的最爱");
var favRooms = (fav && fav.rooms) || [];
if (!favRooms.length) {
if (fav && fav.ok === false) return emptyHintItem("xl-fav-error", "收藏未加载", "收藏接口未返回内容：" + (fav.hint || fav.error || "未知"));
return emptyHintItem("xl-fav-empty", "暂无收藏", "收藏列表是空的。去网站上点关注，主播就会出现在这里。");
}
// 离线主播若没带 videos[]，强行拉一次主页视频（/api/live/videos），
// 保证离线录像一定出现，不依赖收藏接口是否附带；单个失败不影响列表
var needFetch = [];
for (var fi = 0; fi < favRooms.length; fi++) {
var fr0 = favRooms[fi];
if (fr0 && fr0.id && !fr0.isLive && !(fr0.videos && fr0.videos.length)) needFetch.push(fr0);
}
if (needFetch.length) {
var fetched = await Promise.all(needFetch.map(function (fr) {
return apiGet("/api/live/videos", { id: fr.id }).catch(function () { return null; });
}));
for (var fj = 0; fj < needFetch.length; fj++) {
var vd = fetched[fj];
if (vd && vd.videos && vd.videos.length) needFetch[fj].videos = vd.videos;
}
}
var favItems = [];
for (var j = 0; j < favRooms.length; j++) {
var fr = favRooms[j];
if (!fr ||!fr.id) continue;
var vids = fr.videos || [];
if (!fr.isLive && vids.length) {
// 离线主播：直接列出它的录像，点开即播
for (var k = 0; k < vids.length; k++) {
if (vids[k] && vids[k].id) favItems.push(videoItem(vids[k], fr.id));
}
} else {
favItems.push(roomItem(fr));
}
}
return favItems;
}

// ── 8 个分类：真翻页（hasMore 由中继给，Rex 按页拉） ──
var data = await apiGet("/api/live/list", { tag: kind, page: page, limit: 12});
var rooms = (data && data.rooms) || [];
var items = [];
for (var m = 0; m < rooms.length; m++) {
if (rooms[m] && rooms[m].id) items.push(roomItem(rooms[m]));
}
return items;
}

// ───────────── 详情（预热起播） ─────────────

function parseLink(link) {
var raw = String(link || "").trim();
var m = raw.match(/(\d{5,})(?:\/([\w.\-]+))?/);
if (!m) return { id: "", user: ""};
return { id: m[1], user: m[2] || ""};
}

async function loadDetail(link) {
// 录像：地址已知，不用预热
if (isVodLink(link)) {
return {
id: "vod",
type: "detail",
mediaType: "movie",
title: "录像",
link: link,
description: "点播放开始加载（中继 VOD 反代）",
};
}

var p = parseLink(link);
if (!p.id) throw new Error("无法识别房间链接：" + link);

try { apiGet("/api/live/play", { id: p.id, user: p.user}).catch(function () {});} catch (e) {}

return {
id: p.id,
type: "detail",
mediaType: "movie",
title: "房间 " + p.id,
link: "xl://room/" + p.id + "/" + p.user,
description: "点播放开始加载（首次约 10–20 秒起播）" + (cookieHeader()? " · 登录态": ""),
};
}

// ───────────── 播放 ─────────────

async function loadResource(params) {
var link = "";
if (typeof params === "string") link = params;
else if (params) link = params.link || params.url || params.id || "";

// 录像：链接里就是 hls，直接交给播放器
if (isVodLink(link)) {
var vhls = vodHlsFromLink(link);
if (!vhls) {
return [{ name: "不可播", description: "这条录像暂不可播（付费/未公开）。", url: ""}];
}
return [{ name: "录像", description: "中继 VOD 反代 · 标准 HLS", url: vhls}];
}

var p = parseLink(link);
if (!p.id) {
return [{ name: "⚠️ 未收到房间 id", description: "link=" + String(link).slice(0, 80), url: ""}];
}

// 一次拿不到（中继刚重启/网络抖动）就立刻再试一次；不用任何定时器
var data = null;
var lastErr = "";
for (var attempt = 0; attempt < 2; attempt++) {
try {
data = await apiGet("/api/live/play", { id: p.id, user: p.user});
if (data && (data.hls || data.error || data.hint)) break;
} catch (e) {
lastErr = String(e.message || e);
data = null;
}
}
if (!data) {
return [{ name: "❌ 中继不可达", description: (lastErr || "两次请求都没拿到响应").slice(0, 120), url: ""}];
}

// 只要给了链接就直接交给播放器（v1.8.1 起，没热好时中继不再给空清单，
// 而是回 hls:null + hint；拿到链接才播，不会播死清单）。
if (data && data.hls) {
var ready =!!data.ok;
return [{
name: ready? "直播 · 实时" + (cookieHeader()? " · 登录态": ""): "直播 · 起播中",
description: ready
? "中继取流 · " + (data.segments || 0) + " 段缓冲"
: "中继正在拉起浏览器，播放器会自动重试（约 10–20 秒）",
url: normalizeHls(data.hls),
}];
}

// v1.8.1：没热好（ok:false + hls:null + hint）不是失败，是让用户再点一次
if (data &&!data.hls && data.hint) {
return [{
name: "直播 · 起播中",
description: data.hint,
url: "",
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
