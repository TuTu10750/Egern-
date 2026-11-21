/**
* Rex 模块：XLive Men v1.9.11（自动收藏改成开关，默认关）
*
* 模块 ID: user.xllive1911   ← Rex 里导入时若提示"已存在相同 ID"，用"覆盖文件"
*
* v1.9.11 关键变化（2026-11-21）：
*   1) 直播也加直连线：loadResource 拿到中继地址后，再给两条直连线——
*      「直播·直连」源站 720p master（edge-hls.doppiocdn.media，实测 200，
*      单档 1280x720/9.2Mbps）和「直播·直连 240p」（同站 _240p，424x240/
*      0.63Mbps，低码率最顺）。中继线仍默认第一位（中继固定 480p）。
*      直连地址用房间 id 拼模板：https://edge-hls.doppiocdn.media/hls/<id>/
*      master/<id>.m3u8，id 即 streamName（列表里 streamName=id）。
*   2) 模块 ID 改为 user.xllive1911，子模块 ID 改为 xl1912-*。
*
* v1.9.10 关键变化（2026-11-21）：
*   1) 修「我的最爱」录像卡顿：之前只给一条中继 VOD 线（/api/vod/playlist），
*      中继单档、无低画质可切（实测：relay 回的 VOD 清单是单档，源站 MP4
*      只有 720p/1080p，480p/360p 都是 404），且手机→Egern→同台中继→源站
*      是双倍过 VPS，段一慢就定格/0 KB/s。v1.9.10 在 loadResource 里给录像
*      多加一条「直连」线：把中继地址里的 u= 参数解出来，直接播源站地址，
*      不过中继；中继线仍保留，默认仍是中继，哪条顺用哪条。只改 xl-live，
*      不动 xh-gay 视频模块（v29 那次改错了模块）。
*   2) 模块 ID 改为 user.xllive1911，子模块 ID 改为 xl1912-*。
*
* v1.9.9 关键变化（2026-11-19）：
*   1) 播放即收藏改成开关，默认关。点开看一眼不喜欢的主播不会再
*      污染列表。想开的话去「我的账号」→「播放时自动收藏」填 1
*      提交一次就行；想关就把那栏留空提交。开关存在本机。
*   2) 模块 ID 改为 user.xllive1911，子模块 ID 改为 xl1912-*。
*
* v1.9.8 关键变化（2026-11-19）：
*   1) 播放即收藏：点开哪个主播的直播间看，就自动把它加进关注列表，
*      不用再回首页→设置→模块→我的账号→调参数→填 ID。看过的都
*      自动进「我的最爱」，以后只管看，收藏自己长出来。
*      （后发现问题：看一眼不喜欢的也会进列表，造成污染，v1.9.9 改成开关默认关。）
*   2) 模块 ID 改为 user.xllive198，子模块 ID 改为 xl198-*。
*
* v1.9.7 关键变化（2026-11-19）：
*   1) 直播详情页顶部显示「主播 ID：253571608」，长按就能复制，
*      复制完去「我的账号」→「添加主播 ID」粘贴就行。Rex 模块没有
*      剪贴板 API，做不了一键复制按钮，长按复制是最直接的办法。
*      （后经实测：Rex 里长按复制不了，这条放弃，仅保留 ID 显示。）
*   2) 模块 ID 改为 user.xllive197，子模块 ID 改为 xl197-*。
*
* v1.9.6 关键变化（2026-11-19）：
*   1) 「我的账号」新增「添加主播 ID」：只填一个新 ID，自动追加到
*      已存的关注列表后面，不覆盖已有的。Rex 的输入框每次都是空的，
*      再也不用整串重贴。想整串替换仍用「关注主播 ID」那一栏。
*   2) 模块 ID 改为 user.xllive196，子模块 ID 改为 xl196-*。
*
* v1.9.5 关键变化（2026-11-19）：
*   1) 修 v1.9.4 的显示 bug：没贴 Cookie 时「我的账号」直接返回
*      「未登录」，看不到已存的关注主播 ID。现在未登录也显示
*      「关注主播：253571608,151302412,61584846」，提交后立刻能确认。
*   2) 模块 ID 改为 user.xllive195，子模块 ID 改为 xl195-*。
*
* v1.9.4 关键变化（2026-11-19）：
*   1) 「我的最爱」不再写死两个主播 ID。关注主播 ID 存在 Rex 本机
*      （Widget.storage），在「我的账号」里贴一串逗号隔开的 ID 就能改；
*      关注了新人，把新 ID 加进去提交一次就行。没填过就默认
*      253571608、151302412。
*   2) 模块 ID 改为 user.xllive194，子模块 ID 改为 xl194-*。
*
* v1.9.3 关键变化（2026-11-19，API 不鉴权实锤后）：
*   1) 「推荐」免登录：不再走登录门控。直接并取 4 个最对味的分类
*      （老爹 daddies / 老爷爷 grandpas / 成熟 mature / 中文 chinese），
*      去重后按观众数排，取前 60，本地 24/页出。不用 Cookie。
*   2) 「我的最爱」免登录：不再走登录门控。直接按关注主播 ID
*      （253571608、151302412）拉各自主页视频（/api/live/videos），
*      付费（paidOrFanClub/cost 99）只放预告片，免费放正片。
*      不用 Cookie，接口不鉴权（2026-11-19 14:37 实测）。
*   3) 模块 ID 改为 user.xllive193，子模块 ID 改为 xl193-*。
*
* v1.9.2 关键变化（2026-11-19，配中继 all=1 补丁）：
*   1) 8 个分类一次拿全量（/api/live/list?all=1）：一个分类在播的
*      所有房间一次返回（daddies 实测 235 个），不再 12 个一页翻 20 页。
*   2) 防卡顿：全量只存内存，本地按 24 个一页出，Rex 一次只渲染
*      24 个封面；滑到底再出下一页，不重复请求。
*   3) 老中继（不支持 all=1）自动退回原来的 12/页翻页。
*   4) 模块 ID 改为 user.xllive192，子模块 ID 改为 xl192-*。
*
* v1.9.1 关键变化（2026-11-18）：
*   1) 我的最爱：离线主播若没带 videos[]，强行拉一次主页视频
*      （/api/live/videos?id=<主播 id>），保证离线录像一定出现，
*      不依赖收藏接口是否附带；失败的单个主播不影响整个列表。
*   2) 我的账号：登录校验改走真正需要登录的收藏接口
*      （/api/live/favorites），/api/live/me 探针会误报 403
*      （Cookie 有效它也 403），不再以它为准；探针只作后备。
*   3) 模块 ID 改为 user.xllive192，子模块 ID 改为 xl192-*。
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
var XL_FAV_IDS_KEY = "xl_fav_ids";
var XL_AUTOFAV_KEY = "xl_autofav";
// 默认关注主播（2026-11-19 实测，favoriteIds Cookie）：253571608、151302412
var DEFAULT_FAV_IDS = [253571608, 151302412];

// 分类全量缓存：同一次 Rex 会话内有效（key=分类，rooms=全量房间）
var __catCache = null;
// 推荐缓存：同一次 Rex 会话内有效（前 60）
var __recCache = null;

WidgetMetadata = {
id: "user.xllive1912",
  // v1.9.12: foreign-link guards (see loadResource/loadDetail)
title: "XLive Men",
description: "xlivesex 男同直播 · 中继取流，标准 HLS；8 分类 + 免登录推荐/最爱 + 离线录像",
author: "YG",
version: "1.9.12",
requiredVersion: "0.0.1",
detailCacheDuration: 0,
site: "https://zh.xlivesex.com",
iconurl: "https://zh.xlivesex.com/favicon.ico",

modules: [
{
id: "xl1912-account",
title: "我的账号",
description: "粘贴登录 Cookie / Token（可选，存在本机）",
requiresWebView: false,
cacheDuration: 0,
functionName: "loadAccount",
type: "list",
params: [
{ name: "cookie", title: "登录 Cookie", type: "input", value: ""},
{ name: "token", title: "访问 Token（可留空）", type: "input", value: ""},
{ name: "favIds", title: "关注主播 ID（整串替换，逗号隔开）", type: "input", value: ""},
{ name: "addFavId", title: "添加主播 ID（只加这一个，不覆盖已有的）", type: "input", value: ""},
{ name: "autoFav", title: "播放时自动收藏（填 1 开启，填 0 关闭，默认关）", type: "input", value: ""},
],
},
{
id: "xl1912-resource",
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
{ id: "xl1912-rec", title: "推荐", description: "按收藏推（免登录）", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "rec"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1912-fav", title: "我的最爱", description: "关注主播的视频（免登录）", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "fav"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1912-daddies", title: "老爹", description: "老爹分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "daddies"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1912-mature", title: "成熟", description: "成熟分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "mature"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1912-grandpas", title: "老爷爷", description: "老爷爷分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "grandpas"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1912-chinese", title: "中文", description: "中文分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "chinese"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1912-muscle", title: "肌肉发达", description: "肌肉发达分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "muscle"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1912-medium", title: "中", description: "中体型分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "medium"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1912-chunky", title: "矮胖", description: "矮胖分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "chunky"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1912-big", title: "大", description: "大体型分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "big"}, { name: "page", title: "页码", type: "page"}]},
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

// 关注主播 ID：读本机存的（逗号隔开），没存过就用默认两个
function favIds() {
var raw = String(storeGet(XL_FAV_IDS_KEY) || "").trim();
if (!raw) return DEFAULT_FAV_IDS.slice();
var out = [];
var parts = raw.split(",");
for (var i = 0; i < parts.length; i++) {
var n = parseInt(parts[i].trim(), 10);
if (isFinite(n) && n > 0 && out.indexOf(n) < 0) out.push(n);
}
return out.length ? out : DEFAULT_FAV_IDS.slice();
}

// 播放时自动收藏是否开启（本机存的，默认关）
function autoFavOn() {
return String(storeGet(XL_AUTOFAV_KEY) || "").trim() === "1";
}

// 清洗一串主播 ID：只留数字，逗号隔开，去重
function cleanFavIds(raw) {
var out = [];
var parts = String(raw || "").split(",");
for (var i = 0; i < parts.length; i++) {
var n = parseInt(parts[i].trim(), 10);
if (isFinite(n) && n > 0 && out.indexOf(n) < 0) out.push(n);
}
return out.join(",");
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

// v1.9.10：从中继 VOD 地址里把源站地址解出来（?u=<encoded源站>），直连用。
// 中继地址形如 http://49.0.207.168:8788/api/vod/playlist?u=https%3A%2F%2Fhls.strpst.com%2F...
// 不是中继地址、或解不出 u= 时返回 ""。
function vodDirectFromRelay(relayUrl) {
try {
var u = String(relayUrl || "");
var m = u.match(/[?&]u=([^&]+)/);
if (!m) return "";
var direct = decodeURIComponent(m[1]);
if (!/^https?:\/\//i.test(direct)) return "";
return direct;
} catch (e) { return "";}
}

// ───────────── 我的账号 ─────────────

async function loadAccount(params) {
params = params || {};
var inCookie = params.cookie!= null? String(params.cookie).trim(): "";
var inToken = params.token!= null? String(params.token).trim(): "";
var inFavIds = params.favIds!= null? String(params.favIds).trim(): "";
var inAddFavId = params.addFavId!= null? String(params.addFavId).trim(): "";
var inAutoFav = params.autoFav!= null? String(params.autoFav).trim(): "";

var touched = false;
if (inCookie) { storeSet(XL_COOKIE_KEY, cleanCookie(inCookie)); touched = true;}
if (inToken) { storeSet(XL_TOKEN_KEY, inToken); touched = true;}
if (inFavIds) { storeSet(XL_FAV_IDS_KEY, cleanFavIds(inFavIds)); touched = true;}
if (inAutoFav) { storeSet(XL_AUTOFAV_KEY, inAutoFav === "1"? "1": "0"); touched = true;}
// 只加一个：追加到已存列表后面，不覆盖；已在列表里就不重复加
if (inAddFavId) {
var addN = parseInt(inAddFavId, 10);
if (isFinite(addN) && addN > 0) {
var cur = favIds();
if (cur.indexOf(addN) < 0) { cur.push(addN); storeSet(XL_FAV_IDS_KEY, cur.join(",")); }
touched = true;
}
}

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
description: "公开房/群演房不需要登录也能看。要看私密房请把浏览器里已登录的 Cookie 粘到「登录 Cookie」提交；Token 可留空。关注主播：" + favIds().join(",") + "（在「关注主播 ID」里改，逗号隔开）。自动收藏：" + (autoFavOn()? "开": "关") + "。",
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
stateDesc += " 关注主播：" + favIds().join(",") + "（在「关注主播 ID」里改，逗号隔开）。自动收藏：" + (autoFavOn()? "开": "关") + "（在「播放时自动收藏」里填 1 开 / 填 0 关）。";

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
description: statusBits(r).join(" · ") + " · ID:" + r.id,
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

// ── 推荐：免登录。并取 4 个最对味的分类，去重后按观众数排，取前 60 ──
if (kind === "rec") {
var REC_TAGS = ["daddies", "grandpas", "mature", "chinese"];
var PAGE_SIZE_REC = 24;
var recTop = (__recCache && __recCache.key === "rec_top60") ? __recCache.rooms : null;
if (!recTop) {
var recLists = await Promise.all(REC_TAGS.map(function (tag) {
return apiGet("/api/live/list", { tag: tag, all: 1 }).catch(function () { return null; });
}));
var seenRec = {};
var mergedRec = [];
for (var ri = 0; ri < recLists.length; ri++) {
var rr = (recLists[ri] && recLists[ri].rooms) || [];
for (var rj = 0; rj < rr.length; rj++) {
var room = rr[rj];
if (!room || !room.id || seenRec[room.id]) continue;
seenRec[room.id] = true;
mergedRec.push(room);
}
}
mergedRec.sort(function (a, b) { return (Number(b.viewers) || 0) - (Number(a.viewers) || 0); });
recTop = mergedRec.slice(0, 60);
if (recTop.length) __recCache = { key: "rec_top60", rooms: recTop };
}
if (!recTop || !recTop.length) return emptyHintItem("xl-rec-empty", "暂无推荐", "推荐列表是空的，稍后再来。");
var recStart = (page - 1) * PAGE_SIZE_REC;
var recSlice = recTop.slice(recStart, recStart + PAGE_SIZE_REC);
var recItems = [];
for (var i = 0; i < recSlice.length; i++) {
if (recSlice[i] && recSlice[i].id) recItems.push(roomItem(recSlice[i]));
}
return recItems;
}

// ── 我的最爱：免登录。按本机存的关注主播 ID 拉各自主页视频 ──
// 关注了新人：在「我的账号」里把新 ID 加进「关注主播 ID」提交一次就行
if (kind === "fav") {
if (page > 1) return []; // 一次全回，不翻页
var FAV_STREAMER_IDS = favIds();
var favResults = await Promise.all(FAV_STREAMER_IDS.map(function (sid) {
return apiGet("/api/live/videos", { id: sid }).catch(function () { return null; });
}));
var favItems = [];
for (var fi = 0; fi < favResults.length; fi++) {
var fvd = favResults[fi];
var fvids = (fvd && fvd.videos) || [];
for (var fk = 0; fk < fvids.length; fk++) {
if (fvids[fk] && fvids[fk].id) favItems.push(videoItem(fvids[fk], FAV_STREAMER_IDS[fi]));
}
}
if (!favItems.length) return emptyHintItem("xl-fav-empty", "暂无收藏视频", "关注的主播还没有录像，或接口未返回内容。");
return favItems;
}

// ── 8 个分类：一次拿全量（all=1），本地按 24/页出，防 235 个封面一次渲染卡顿 ──
var PAGE_SIZE = 24;
var cacheKey = "all_" + kind;
var allRooms = null;
if (__catCache && __catCache.key === cacheKey) allRooms = __catCache.rooms;
if (!allRooms) {
var allData = await apiGet("/api/live/list", { tag: kind, all: 1 });
allRooms = (allData && allData.rooms) || [];
if (allRooms.length) __catCache = { key: cacheKey, rooms: allRooms };
}
if (!allRooms.length) {
// 老中继（不支持 all=1）退回原来的 12/页翻页
var data = await apiGet("/api/live/list", { tag: kind, page: page, limit: 12});
var rooms = (data && data.rooms) || [];
var items = [];
for (var m = 0; m < rooms.length; m++) {
if (rooms[m] && rooms[m].id) items.push(roomItem(rooms[m]));
}
return items;
}
var start = (page - 1) * PAGE_SIZE;
var slice = allRooms.slice(start, start + PAGE_SIZE);
var items = [];
for (var m = 0; m < slice.length; m++) {
if (slice[m] && slice[m].id) items.push(roomItem(slice[m]));
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

// 外站 http(s) 链接不是直播房间：直接拒绝，不替别的模块解析
if (/^https?:\/\//.test(String(link || ""))) throw new Error("不是直播链接：" + String(link).slice(0, 80));
var p = parseLink(link);
if (!p.id) throw new Error("无法识别房间链接：" + link);

try { apiGet("/api/live/play", { id: p.id, user: p.user}).catch(function () {});} catch (e) {}

return {
id: p.id,
type: "detail",
mediaType: "movie",
title: "房间 " + p.id,
link: "xl://room/" + p.id + "/" + p.user,
description: "主播 ID：" + p.id + "（长按可复制，去「我的账号」→「添加主播 ID」粘贴）\n点播放开始加载（首次约 10–20 秒起播）" + (cookieHeader()? " · 登录态": ""),
};
}

// ───────────── 播放 ─────────────

async function loadResource(params) {
var link = "";
if (typeof params === "string") link = params;
else if (params) link = params.link || params.url || params.id || "";

// Rex 会把同一条链接发给全部模块的 loadResource：本模块只认 xl:// 链接和
// 纯数字房间号；http(s) 外站链接（蓝果、XH 等）直接回 []，不回报错卡。
if (/^https?:\/\//.test(String(link || ""))) return [];

// 录像：链接里就是 hls，直接交给播放器
// v1.9.10：给两条线——中继线（默认）+ 直连线（源站，不过中继）。
// 源站 VOD 只有单档（720p/1080p，480p/360p 都是 404），做不出低画质切换；
// 直连是绕开“手机→Egern→同台中继→源站”双倍过 VPS 的另一条路，哪条顺用哪条。
if (isVodLink(link)) {
var vhls = vodHlsFromLink(link);
if (!vhls) {
return [{ name: "不可播", description: "这条录像暂不可播（付费/未公开）。", url: ""}];
}
var vodLines = [{ name: "录像 · 中继", description: "中继 VOD 反代 · 标准 HLS", url: vhls}];
var vdirect = vodDirectFromRelay(vhls);
if (vdirect && vdirect !== vhls) {
vodLines.push({ name: "录像 · 直连", description: "源站直连 · 不过中继，中继卡时切这条", url: vdirect});
}
return vodLines;
}

var p = parseLink(link);
if (!p.id) {
return [{ name: "⚠️ 未收到房间 id", description: "link=" + String(link).slice(0, 80), url: ""}];
}

// 播放即收藏（开关，默认关）：只在「播放时自动收藏」开了才加，
// 避免点开看一眼不喜欢的也进列表造成污染
if (autoFavOn()) {
try {
var playId = parseInt(p.id, 10);
if (isFinite(playId) && playId > 0) {
var curFav = favIds();
if (curFav.indexOf(playId) < 0) { curFav.push(playId); storeSet(XL_FAV_IDS_KEY, curFav.join(",")); }
}
} catch (e) { /* 收藏失败不影响播放 */ }
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

// v1.9.11：直播直连线。源站 master 只有单档 720p/9.2Mbps，另有 _240p
// 低档（424x240/0.63Mbps）。id 即 streamName（列表里 streamName=id）。
function liveDirectLines(roomId) {
var base = "https://edge-hls.doppiocdn.media/hls/" + roomId + "/master/" + roomId;
return [
{ name: "直播 · 直连", description: "源站直连 · 720p，不过中继", url: base + ".m3u8" },
{ name: "直播 · 直连 240p", description: "源站直连 · 240p 低码率最顺", url: base + "_240p.m3u8" },
];
}

// 只要给了链接就直接交给播放器（v1.8.1 起，没热好时中继不再给空清单，
// 而是回 hls:null + hint；拿到链接才播，不会播死清单）。
if (data && data.hls) {
var ready =!!data.ok;
var liveLines = [{
name: ready? "直播 · 中继" + (cookieHeader()? " · 登录态": ""): "直播 · 起播中",
description: ready
? "中继取流 · 480p · " + (data.segments || 0) + " 段缓冲"
: "中继正在拉起浏览器，播放器会自动重试（约 10–20 秒）",
url: normalizeHls(data.hls),
}];
return liveLines.concat(liveDirectLines(p.id));
}

// v1.8.1：没热好（ok:false + hls:null + hint）不是失败，是让用户再点一次
// v1.9.11：中继没热好时直连线照样能播，不用等中继
if (data &&!data.hls && data.hint) {
return [{
name: "直播 · 起播中",
description: data.hint,
url: "",
}].concat(liveDirectLines(p.id));
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
