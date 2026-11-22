/**
* Rex 模块：XLive Men v1.9.17（录像重封装：修"画面冻住、进度条继续走"）
*
* v1.9.17 关键变化（2026-11-22）：
*   1) 录像中继线自动加 &fix=1：中继用 ffmpeg 把源站混剪 HLS 重封装成
*      时间戳连续的干净 HLS（源站 trailer.m3u8 每段 tfdt 跳 90 秒、moov 声明
*      上千秒但实际只有几十秒画面，播放器按 moov 建轴→画面冻住、进度条照走）。
*   2) 保留一条"录像 · 原始"线：ffmpeg 重封装失败时仍可播（虽然可能冻帧）。
*   3) 保留 v1.9.16 房型预检、v1.9.15 房型识别、v1.9.14 重试、v1.9.13 兜底链、v1.9.12 guard。
*   4) 播放时自动收藏默认开：不用手动去设置里填 1；不想自动收藏时填 0 关掉。
*
* v1.9.16 关键变化（2026-11-22）：
*   1) 播放前先预检房型：群演房(groupShow)、私密房(private)、已离线(isLive=false)
*      直接只试 1 次中继，拿不到就立刻返回标注 + 兜底，不再白等 4 次轮询（约 60 秒）。
*   2) 公开房/未知房照常 4 次轮询，保证起播成功率。
*   3) 标注文案分得更细：群演房需购票 / 私密房需登录 / 主播已下播离线 / 不在直播列表。
*   4) 保留 v1.9.15 房型识别、v1.9.14 重试节奏、v1.9.13 兜底链、v1.9.12 防串台 guard。
*
* v1.9.15 关键变化（2026-11-22）：
*   1) 播放时实时查房型（/api/live/list 的 status）：群演房(groupShow)、私密房(private)、
*      已离线、不在列表，各自给准确文案，不再把"群演房要购票"误报成"起播失败"。
*   2) 列表描述里的"群演/私密"改成更明确的"群演房·需购票 / 私密房·需登录"。
*   3) 房型查询带 60 秒缓存，连续播放不重复拉全量列表。
*   4) 保留 v1.9.14 重试节奏、v1.9.13 直连探测/录像兜底、v1.9.12 防串台 guard。
*
* v1.9.14 关键变化（2026-11-22）：
*   1) 起播重试改成"真的等"：中继首次起播 10~25 秒，旧版两次请求间隔 0.5 秒
*      全撞在没热完的窗口里，等于没试。现在最多 4 次、每次间隔 2.5 秒，
*      配合中继 PLAY_WAIT_MS=10000，单次 /play 内部等 10 秒 → 总计约 40~50 秒。
*   2) 去掉"同 sid + 0 段提前退出"：实测会话在后台持续抓段，隔几秒再请求
*      往往就有了（peaoativo：首次 0 段，重试 13 段）。提前退出会误杀这种能救的房。
*   3) 保留 v1.9.13 的直连探测、录像兜底、状态提示、v1.9.12 防串台 guard。
*
* v1.9.13 关键变化（2026-11-22）：
*   1) 修复「一次拿不到再试一次」对 hls:null + hint 不生效的 bug：
*      break 条件不再把 hint 当成功，起播中再试 1 次（共 2 次，约 60s；同 sid 且 0 段直接放弃）。
*   2) 直连线加内容探测：拉 m3u8 看 #EXT-X-ENDLIST / 段数时长，
*      预告片标注 ⚠️，真直播标注「已验证直播」。
*   3) 兜底链：中继 → 直连（内容验证）→ 该主播最近录像 → 可见状态提示，
*      让「房间有内容可取」的情况都返回至少一条有 url 的可播线。
*   4) 保留 v1.9.12 的外站链接 guard。
*
* 模块 ID: user.xllive1917   ← Rex 里导入时若提示"已存在相同 ID"，用"覆盖文件"
*
* v1.9.11 关键变化（2026-11-21）：
*   1) 直播也加直连线：loadResource 拿到中继地址后，再给两条直连线——
*      「直播·直连」源站 720p master（edge-hls.doppiocdn.media，实测 200，
*      单档 1280x720/9.2Mbps）和「直播·直连 240p」（同站 _240p，424x240/
*      0.63Mbps，低码率最顺）。中继线仍默认第一位（中继固定 480p）。
*      直连地址用房间 id 拼模板：https://edge-hls.doppiocdn.media/hls/<id>/
*      master/<id>.m3u8，id 即 streamName（列表里 streamName=id）。
*   2) 模块 ID 改为 user.xllive1917，子模块 ID 改为 xl1917-*。
*
* v1.9.10 关键变化（2026-11-21）：
*   1) 修「我的最爱」录像卡顿：之前只给一条中继 VOD 线（/api/vod/playlist），
*      中继单档、无低画质可切（实测：relay 回的 VOD 清单是单档，源站 MP4
*      只有 720p/1080p，480p/360p 都是 404），且手机→Egern→同台中继→源站
*      是双倍过 VPS，段一慢就定格/0 KB/s。v1.9.10 在 loadResource 里给录像
*      多加一条「直连」线：把中继地址里的 u= 参数解出来，直接播源站地址，
*      不过中继；中继线仍保留，默认仍是中继，哪条顺用哪条。只改 xl-live，
*      不动 xh-gay 视频模块（v29 那次改错了模块）。
*   2) 模块 ID 改为 user.xllive1917，子模块 ID 改为 xl1917-*。
*
* v1.9.9 关键变化（2026-11-19）：
*   1) 播放即收藏改成开关，默认关。点开看一眼不喜欢的主播不会再
*      污染列表。想开的话去「我的账号」→「播放时自动收藏」填 1
*      提交一次就行；想关就把那栏留空提交。开关存在本机。
*   2) 模块 ID 改为 user.xllive1917，子模块 ID 改为 xl1917-*。
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
id: "user.xllive1917",
  // v1.9.12: foreign-link guards (see loadResource/loadDetail)
title: "XLive Men",
description: "xlivesex 男同直播 · 中继取流，标准 HLS；8 分类 + 免登录推荐/最爱 + 离线录像",
author: "YG",
version: "1.9.17",
requiredVersion: "0.0.1",
detailCacheDuration: 0,
site: "https://zh.xlivesex.com",
iconurl: "https://zh.xlivesex.com/favicon.ico",

modules: [
{
id: "xl1917-account",
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
{ name: "autoFav", title: "播放时自动收藏（填 1 开启，填 0 关闭，默认开）", type: "input", value: ""},
],
},
{
id: "xl1917-resource",
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
{ id: "xl1917-rec", title: "推荐", description: "按收藏推（免登录）", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "rec"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1917-fav", title: "我的最爱", description: "关注主播的视频（免登录）", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "fav"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1917-daddies", title: "老爹", description: "老爹分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "daddies"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1917-mature", title: "成熟", description: "成熟分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "mature"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1917-grandpas", title: "老爷爷", description: "老爷爷分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "grandpas"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1917-chinese", title: "中文", description: "中文分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "chinese"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1917-muscle", title: "肌肉发达", description: "肌肉发达分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "muscle"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1917-medium", title: "中", description: "中体型分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "medium"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1917-chunky", title: "矮胖", description: "矮胖分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "chunky"}, { name: "page", title: "页码", type: "page"}]},
{ id: "xl1917-big", title: "大", description: "大体型分类", requiresWebView: false, cacheDuration: 60, functionName: "loadList", params: [ { name: "kind", title: "分类", type: "constant", value: "big"}, { name: "page", title: "页码", type: "page"}]},
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

// 播放时自动收藏是否开启（本机存的，默认开；填 0 才关）
function autoFavOn() {
return String(storeGet(XL_AUTOFAV_KEY) || "").trim() !== "0";
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
if (r.status === "groupShow") bits.push("群演房·需购票");
else if (r.status === "private") bits.push("私密房·需登录");
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

// ───────────── v1.9.13：兜底取流工具 ─────────────

// 中继起播轮询参数（常量，方便按实测调整）
var RELAY_POLL_MAX = 4;        // 最多请求次数
var RELAY_POLL_GAP_MS = 2500;  // 每轮间隔：给中继留出热会话的时间

// 温和 sleep：Rex 模块环境若有 setTimeout 就用，否则退化为立即 resolve
function softSleep(ms) {
return new Promise(function (resolve) {
try { if (typeof setTimeout === "function") { setTimeout(resolve, ms); return; } } catch (e) {}
resolve();
});
}

// v1.9.15：房型查询。返回 {status, isLive, viewers} 或 null（不在列表/查询失败）
// 60 秒缓存，避免连续播放重复拉全量列表（约 200 房）
var __statusCache = { t: 0, map: null };
async function roomStatusOf(id, user) {
var now = Date.now();
if (!__statusCache.map || now - __statusCache.t > 60000) {
try {
var d = await apiGet("/api/live/list", { all: 1 });
var rooms = (d && d.rooms) || [];
var map = {};
for (var i = 0; i < rooms.length; i++) {
var r = rooms[i];
if (!r || !r.id) continue;
var rec = { status: r.status || "", isLive: r.isLive, viewers: r.viewers };
map[String(r.id)] = rec;
if (r.username) map["u:" + r.username] = rec;
}
__statusCache = { t: now, map: map };
} catch (e) { return null; }
}
return __statusCache.map[String(id)] || (user? __statusCache.map["u:" + user]: null) || null;
}

// 纯文本 GET（m3u8 不能走 apiGet 的 JSON 解析）
async function httpText(url) {
var resp = await Widget.http.get(url, { allow_redirects: true });
var body = resp && resp.data !== undefined ? resp.data : resp;
if (typeof body === "string") return body;
if (body && typeof body.toString === "function") return String(body);
return "";
}

// 内容探测：拉直连 m3u8，判断真直播 / 预告片 / 录播
// 依据：media playlist 带 #EXT-X-ENDLIST → 预告/录播；直播清单无 ENDLIST
async function probeDirectLive(m3u8) {
var info = { url: m3u8, live: false, preview: false, segments: 0, duration: 0, note: "" };
try {
var txt = await httpText(m3u8);
if (!txt || txt.charAt(0) !== "#") { info.note = "非 m3u8（拿到 " + String(txt).slice(0, 40) + "）"; return info; }
// master playlist：跟随第一个 variant；跟随失败则回退用 master 本身判断
if (/#EXT-X-STREAM-INF/i.test(txt)) {
var masterTxt = txt;
var ls = txt.split(/\r?\n/);
for (var i = 0; i < ls.length - 1; i++) {
if (!/^#EXT-X-STREAM-INF/i.test(ls[i].trim())) continue;
var v = "";
for (var j = i + 1; j < ls.length; j++) {
var t = ls[j].trim();
if (t && t.charAt(0) !== "#") { v = t; break; }
}
if (v) {
if (!/^https?:\/\//i.test(v)) v = m3u8.slice(0, m3u8.lastIndexOf("/") + 1) + v;
try {
var vtxt = await httpText(v);
if (vtxt && vtxt.charAt(0) === "#") { info.url = v; txt = vtxt; }
} catch (e2) {}
break;
}
}
if (!/#EXTINF/i.test(txt) && !/#EXT-X-STREAM-INF/i.test(txt)) txt = masterTxt;
}
var segs = 0, dur = 0, lines = txt.split(/\r?\n/);
for (var k = 0; k < lines.length; k++) {
var m = lines[k].match(/^#EXTINF:([0-9.]+)/i);
if (m) { segs++; dur += parseFloat(m[1]) || 0; }
}
info.segments = segs;
info.duration = Math.round(dur);
if (/blurred|160p/i.test(txt + " " + info.url)) {
info.preview = true;
info.note = "打码预览流（付费未解锁）· " + segs + " 段 / " + info.duration + "s";
} else if (/#EXT-X-ENDLIST/i.test(txt)) {
info.preview = true;
info.note = "清单带 ENDLIST = 预告/录播 · " + segs + " 段 / " + info.duration + "s";
} else if (segs <= 4 && dur < 40) {
info.preview = true;
info.note = "清单过短（" + segs + " 段 / " + info.duration + "s），疑似 12s 预告片";
} else {
info.live = true;
info.note = "真直播清单 · " + segs + " 段 / " + info.duration + "s · 无 ENDLIST";
}
} catch (e) {
info.note = "探测失败：" + String(e.message || e).slice(0, 70);
}
return info;
}

// 录像兜底：房间下播/打码时，给该主播最近一条可播录像
async function vodFallback(roomId) {
try {
var d = await apiGet("/api/live/videos", { id: roomId });
var vids = (d && d.videos) || [];
for (var i = 0; i < vids.length; i++) {
var v = vids[i];
if (!v || v.playable === false) continue;
var hls = normalizeHls(v.hls || "");
if (!hls) continue;
return { hls: hls, title: v.title || "最近录像", duration: v.duration || 0 };
}
} catch (e) {}
return null;
}

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
// v1.9.17：中继线加 fix=1，让中继用 ffmpeg 重封装成连续时间戳，修画面冻住。
var vodLines = [];
var vfix = vhls + (vhls.indexOf("?") >= 0 ? "&" : "?") + "fix=1";
vodLines.push({ name: "录像 · 中继（已修时间轴）", description: "中继重封装 · 时间戳连续，不再冻帧（首次约 1~5 秒）", url: vfix });
// 原始反代留作备选：重封装失败或无 ffmpeg 时可回退（可能冻帧）
vodLines.push({ name: "录像 · 原始", description: "中继原样反代 · 混剪源可能冻帧，备用", url: vhls });
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

// 播放即收藏（开关，默认开）：除非「播放时自动收藏」填了 0，
// 否则播放就自动把主播加进关注列表；不想加就填 0 关掉
if (autoFavOn()) {
try {
var playId = parseInt(p.id, 10);
if (isFinite(playId) && playId > 0) {
var curFav = favIds();
if (curFav.indexOf(playId) < 0) { curFav.push(playId); storeSet(XL_FAV_IDS_KEY, curFav.join(",")); }
}
} catch (e) { /* 收藏失败不影响播放 */ }
}

// ── v1.9.13 兜底链：中继轮询 → 直连内容验证 → 录像兜底 → 可见状态 ──

// 第 0 层（v1.9.16）：房型预检。群演/私密/已离线的房，中继以游客身份抓不到真流，
// 提前识别、只试 1 次，避免让用户白等 4 次轮询（约 60 秒）才看到"起播失败"。
var pre = null, quickTip = "", quickFail = false, listKnown = false;
try { pre = await roomStatusOf(p.id, p.user); } catch (e) { pre = null; }
if (pre) {
listKnown = true;
if (pre.status === "groupShow") { quickFail = true; quickTip = "群演房 · 需购票进入，游客没有流（不是故障）"; }
else if (pre.status === "private") { quickFail = true; quickTip = "私密房 · 需登录/购票才能看"; }
else if (pre.isLive === false) { quickFail = true; quickTip = "主播已下播/离线"; }
}
// 列表缓存可用但查不到这个 ID：基本是已下播/旧房号，也只试 1 次
var statusReady = !!__statusCache.map;
if (statusReady && !pre) { quickFail = true; quickTip = "不在当前直播列表（可能已下播/离线）"; }
var pollMax = quickFail ? 1 : RELAY_POLL_MAX;

// 第 1 层：中继起播轮询。hint（起播中）不再 break，继续等到拿到 hls。
var data = null, lastErr = "", lastHint = "";
for (var attempt = 0; attempt < pollMax; attempt++) {
try {
data = await apiGet("/api/live/play", { id: p.id, user: p.user });
if (data && data.hls) break;                                   // 拿到地址，成功
if (data && data.error) { lastHint = data.hint || data.error; break; } // 打码/下播等明确错误
// hint / 0 段：会话可能在后台继续热，隔几秒再来一次
lastHint = (data && data.hint) || "";
} catch (e) { lastErr = String(e.message || e); data = null; }
if (attempt < pollMax - 1) await softSleep(RELAY_POLL_GAP_MS);
}

var lines = [];

// 第 2 层：中继线（有 hls 才给，默认第一位）
if (data && data.hls) {
lines.push({
name: "直播 · 中继" + (cookieHeader()? " · 登录态": ""),
description: "中继取流 · 480p · " + (data.segments || 0) + " 段缓冲",
url: normalizeHls(data.hls),
});
}

// 第 3 层：直连线（内容验证）。master 与 240p 同源，只探测一次。
var masterUrl = "https://edge-hls.doppiocdn.media/hls/" + p.id + "/master/" + p.id + ".m3u8";
var lowUrl = "https://edge-hls.doppiocdn.media/hls/" + p.id + "/master/" + p.id + "_240p.m3u8";
var probe = await probeDirectLive(masterUrl);
var directTag = probe.live ? "（已验证直播）" : (probe.preview ? " ⚠️预告/打码" : "（未验证）");
var directDesc = "源站直连 · " + probe.note;
var direct720 = { name: "直播 · 直连 720p" + directTag, description: directDesc, url: probe.url || masterUrl };
var direct240 = { name: "直播 · 直连 240p" + directTag, description: directDesc + " · 低码率", url: lowUrl };

// 真直播的直连排在中继后面；预告/打码的直连压到最后，避免用户优先点到预告片
if (probe.live) { lines.push(direct720); lines.push(direct240); }

// 第 4 层：录像兜底（房间下播/打码时仍有一条真实内容可播）
var vod = null;
if (!(data && data.hls)) {
vod = await vodFallback(p.id);
if (vod) {
lines.push({
name: "回放 · 最近录像",
description: "房间暂无直播流 · " + vod.title + (vod.duration ? " · " + xlSec(vod.duration) : ""),
url: vod.hls,
});
}
}

// 第 5 层：预告/打码的直连放录像之后；探测失败(404/空)的直连压到最末
if (probe.preview) { lines.push(direct720); lines.push(direct240); }
else if (!probe.live) {
var badProbe = /非 m3u8|探测失败/.test(probe.note);
if (!vod || badProbe) { lines.push(direct720); lines.push(direct240); }
}

// 第 6 层：房型准确识别 + 状态写进描述（Rex 隐藏空 url 行，状态挂在可播线路描述上）
if (!(data && data.hls) && lines.length) {
var why = lastHint || lastErr || "中继未返回 hls";
var tip = quickTip;
if (!tip) {
var st = pre;
if (!st) { try { st = await roomStatusOf(p.id, p.user); } catch (e) { st = null; } }
if (!st) tip = "不在当前直播列表（可能已下播/离线）";
else if (st.status === "groupShow") tip = "群演房 · 需购票进入，游客没有流（不是故障）";
else if (st.status === "private") tip = "私密房 · 需登录/购票才能看";
else if (st.isLive === false) tip = "主播已下播/离线";
else tip = "公开房 · 起播未完成，稍后重试";
}
lines[0].description = "⚠️ " + tip + " · 中继：" + String(why).slice(0, 70) + " · " + lines[0].description;
}

return lines.length ? lines : [{ name: "❌ 无可用资源", description: "中继、直连、录像均未返回内容", url: "" }];
}

// 兼容别名
var getDetail = loadDetail;
var loadResources = loadResource;
var stream = loadResource;
var mediaHook = loadResource;
