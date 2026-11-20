/*
 * XH Gay 模块 v29 — Arue 个人定制
 * © 2026 Arue (TuTu10750)。仅供个人使用，禁止商用、禁止倒卖、禁止去水印改名再发。
 * 本文件为明文 JS，技术上无法阻止复制；此声明为权利归属与使用许可说明。
 */
/**
 * Rex 模块：XH Gay v29（首页走官方站，其余走镜像站；复合推荐/个人爱好置顶）
 *
 * v29（2026-11-21）：画质切换。之前 loadDetail/loadResource 只取 master 清单里的最高档
 * （1080p/720p），手机直接拉高码率，段一断就定格/0 KB/s。v29 把 master 里的全部档位
 * （如 360p/480p/720p/1080p）都解析成独立线路，默认首播 480p（有 480 选 480，没有选
 * 最接近 480 的低档），想看高清再手动切高档；预览 MP4 仍保留在最后。只改选档逻辑，
 * 不改列表/搜索/分类/中继。模块 ID 改为 user.xhgay29，子模块 ID 改为 xh29-*。
 *
 * v28（2026-11-18）：复合推荐、个人爱好置顶。tab 顺序改为：复合推荐、
 * 个人爱好、播放资源、我的账号、首页、最新、热门、16 个最爱分类。
 * 另加版权头：本模块为 Arue 个人定制，仅供个人使用，禁止商用倒卖
 * （技术上拦不住复制，见下）。模块 ID 改为 user.xhgay29，子模块
 * ID 改为 xh29-*。
 *
 * v27（2026-11-18）：复合推荐分批抓。v26 的 6 组搜索并行发，网站对
 * 手机出口 IP 回了 HTTP 503（service unavailable），6 组全灭、连分
 * 类也跟着 503（日志：loadList mix items=0）。服务器这边测是 200，
 * 说明是出口 IP 被限流，不是模块错。改成 2 批、每批 3 组并行，峰值
 * 并发从 6 降到 3；单组失败照样不影响其他组。模块 ID 改为
 * user.xhgay29，子模块 ID 改为 xh29-*。
 *
 * v26（2026-11-18）：复合推荐改阈值匹配。爸爸进一步纠正：不是必须
 * 所有标签才推，带两三个对上标签的也能推；但也不能清空所有标签，
 * 那样会把最不喜欢的年轻、女性也带进来。v25 的首页那一半就是
 * 0 标签来源（太松），去掉。改回纯复合搜索，但每组取前 15 条
 * （原来 10 条）：搜索本身是相关性排序，前 10 多是全中，11-15 位
 * 是只中两三个的（实测仍对味，如日本西装老板操熊爸爸、JP O4M 136、
 * 热辣的日本老男人和男孩），正好是“两三个标签就推”。0 标签的
 * 进不来（不在任何一组搜索结果里）；年轻/女性也进不来（gay 分区
 * 搜索 + 爸爸/老人关键词天然筛掉）。一页封顶 90 条，去重。
 * 模块 ID 改为 user.xhgay29，子模块 ID 改为 xh29-*。
 *
 * v25（2026-11-18）：复合推荐改软推荐。v24 是硬筛（只出带指定关键词的
 * 片），爸爸要的是：带这些标签的要包含进来，但不带这些标签的也能推。
 * 改成两路交错：官方站个性化首页（网站自己的软推荐，不要求带标签）+
 * 6 组复合搜索（带标签的），1:1 交错拼成 60 条，去重。标签是加分项，
 * 不是硬门槛。模块 ID 改为 user.xhgay29，子模块 ID 改为 xh29-*。
 *
 * v24（2026-11-18）：新增「复合推荐」tab。网站的单分类太宽、分类页取交集
 * 几乎无重叠（实测 3 页交集 ja+daddy=0）、全站搜索会混进直男内容；只有
 * /gay/search/ 多关键词能按复合口味筛。6 个组合（日本爸爸 / 日本老人 /
 * 中国爸爸 / 日本熊 / 亚洲爸爸 / 日本爸爸手交）并行搜，各取前 10 条轮询
 * 拼成 60 条，去重。实测 8 组复合搜索均对味（日本老人/中国爸爸几乎全中）。
 * 模块 ID 改为 user.xhgay29，子模块 ID 改为 xh29-*（防 Rex 旧 ID 缓存）。
 *
 * v23（2026-11-18）：首页改走官方站。首页/个人爱好抓
 * https://zh.xhofficial.com/gay（拿真正的账号个性化推荐，刷多了会混进
 * 其他类型）；官方站抓不到或无视频时自动回退到镜像站，不让首页变空白。
 * 其余分类/搜索/详情仍走镜像站。官方站首页已实测可抓（51 条，thumbURL 结构一致）。
 * 模块 ID 改为 user.xhgay29，子模块 ID 改为 xh29-*（防 Rex 旧 ID 缓存）。
 *
 * v22（2026-11-18）：拆 tab 提速。主模块只留 6 个系统 tab + 14 个最爱分类
 * （爸爸、老的、爷爷、中年、成熟、亚洲人、强壮多毛男、素人、家庭自制、老少配、
 * 日本、中文色情、3P、人夫、微胖、制服——按两张收藏夹/首页截图的真实口味排，
 * 非站点顺序），共 22 个 tab；其余 360 个分类移到伴生模块 XH Gay 分类
 * （user.xhgaycat22）。
 * 首页/个人爱好仍是带 Cookie 的个性化推荐，越刷越懂你，偶尔也会推其他类型。
 * 模块 ID 改为 user.xhgay29，子模块 ID 改为 xh29-*（防 Rex 旧 ID 缓存）。
 * v21（2026-11-18）：修进 App 卡顿。列表封面改用 thumbURL（526×298），不用
 * imageURL（2560×1440）：首页 51 张封面全用大图解码要 ~750MB，Rex 进 App 就
 * 卡、掉帧；缩略图只要 ~32MB。详情页大图不受影响（parseDetail 用 og:image）。
 * 模块 ID 改为 user.xhgay21，子模块 ID 改为 xh21-*（防 Rex 旧 ID 缓存）。
 *
 * 契约严格对照 C:\Users\Fox-OS\Downloads\user.one.js（ONE一个 v2.2.0，Rex 已装成功）：
 *   - 条目 type: "detail"（不是 widget）
 *   - 条目入口字段 link
 *   - 顶层 loadDetail(link) 接收字符串 link
 *   - 顶层 search: { title, functionName, params }
 *   - 每个 module 带 requiresWebView: false
 *   - 只有 loadResource 带 type: "stream"
 *   - 顶层 detailCacheDuration
 *   - loadResource 返回 [{ name, description, url }]
 *   - childItems 承载多线路，每项 type: "url"
 */

WidgetMetadata = {
  id: "user.xhgay29",
  title: "XH Gay",
  description: "zh.xhzone.life 男同视频 · 最新/热门/分类/搜索，HLS 直连",
  author: "YG",
  version: "1.2.5",
  requiredVersion: "0.0.1",
  detailCacheDuration: 30,
  site: "https://zh.xhzone.life",
  iconurl: "https://zh.xhzone.life/favicon.ico",

  search: {
    title: "搜索 XH Gay",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "" },
    ],
  },

  modules: [
    {
      id: "xh29-mix",
      title: "复合推荐",
      description: "复合标签推送：日本爸爸 / 日本老人 / 中国爸爸 / 日本熊 / 亚洲爸爸 / 日本爸爸手交",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "mix" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-fav",
      title: "个人爱好",
      description: "主列表（两千多页），置顶",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "fav" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-resource",
      title: "播放资源",
      description: "按需解析 XH 播放地址（详情页调用）",
      requiresWebView: false,
      cacheDuration: 0,
      functionName: "loadResource",
      type: "stream",
      params: [
        { name: "link", title: "详情链接", type: "input", value: "" },
        { name: "title", title: "标题", type: "input", value: "" },
      ],
    },
    {
      id: "xh29-account",
      title: "我的账号",
      description: "粘贴登录 Cookie，开启按账号喜好推荐",
      requiresWebView: false,
      cacheDuration: 0,
      functionName: "loadAccount",
      type: "list",
      params: [
        { name: "cookie", title: "登录 Cookie", type: "input", value: "" },
      ],
    },
    {
      id: "xh29-home",
      title: "首页",
      description: "XH Gay 首页推荐",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "home" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-newest",
      title: "最新",
      description: "按上传时间倒序",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "newest" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-best",
      title: "热门",
      description: "按热度排序",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "best" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-old-young",
      title: "老少配",
      description: "老少配分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-old-young" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-daddy",
      title: "爸爸",
      description: "爸爸分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-daddy" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-amateur",
      title: "素人",
      description: "素人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-amateur" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-bear",
      title: "强壮多毛男",
      description: "强壮多毛男分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bear" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-homemade",
      title: "家庭自制",
      description: "家庭自制分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-homemade" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-middle-aged",
      title: "中年",
      description: "中年分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-middle-aged" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-dilf",
      title: "人夫",
      description: "人夫分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-dilf" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-mature",
      title: "成熟",
      description: "成熟分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-mature" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-grandpa",
      title: "爷爷",
      description: "爷爷分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-grandpa" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-old",
      title: "老的",
      description: "老的分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-old" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-asian",
      title: "亚洲人",
      description: "亚洲人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-asian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-chubby",
      title: "微胖",
      description: "微胖分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-chubby" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-threesome",
      title: "3P",
      description: "3P分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-threesome" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-uniform",
      title: "制服",
      description: "制服分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-uniform" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-zh",
      title: "中文色情",
      description: "中文色情分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-zh" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh29-cat-ja",
      title: "日本のアダルト動画",
      description: "日本のアダルト動画分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ja" },
        { name: "page", title: "页码", type: "page" },
      ],
    }

  ],
};

// ───────────────────────── 常量 ─────────────────────────

var XH_BASE = "https://zh.xhzone.life";
var XH_HOME_BASE = "https://zh.xhofficial.com"; // 首页/个人爱好走官方站
var XH_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

var STREAM_CACHE = {};
var STREAM_TTL = 10 * 60 * 1000;

// ───────────────────────── 账号 Cookie（按账号喜好推荐） ─────────────────────────
// Cookie 存在 Rex 本地（Widget.storage），不写进公开的模块文件。
// 用户在「我的账号」页粘贴登录 Cookie 后，列表请求会带上它，
// 网站按该账号的喜好返回推荐。Cookie 会过期，过期后重新粘贴。
var XH_COOKIE_KEY = "xh_cookie";

function xhGetCookie() {
  try {
    if (typeof Widget !== "undefined" && Widget.storage && typeof Widget.storage.get === "function") {
      var v = Widget.storage.get(XH_COOKIE_KEY);
      return typeof v === "string" ? v.trim() : "";
    }
  } catch (e) {}
  return "";
}

function xhSetCookie(value) {
  try {
    if (typeof Widget !== "undefined" && Widget.storage && typeof Widget.storage.set === "function") {
      Widget.storage.set(XH_COOKIE_KEY, String(value || "").trim());
      return true;
    }
  } catch (e) {}
  return false;
}

// 去掉 x_platform_switch，避免它强制移动端布局（移动端首屏只有 5 个视频）。
// 其余登录 Cookie 保留，用于按账号喜好推荐。
function xhCleanCookie(cookie) {
  if (!cookie) return "";
  var parts = String(cookie).split(";");
  var kept = [];
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i].trim();
    if (!p) continue;
    var name = p.split("=")[0].trim().toLowerCase();
    if (name === "x_platform_switch") continue;
    kept.push(p);
  }
  return kept.join("; ");
}

function xhHeaders() {
  var headers = {
    "User-Agent": XH_UA,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    Referer: XH_BASE + "/",
  };
  var cookie = xhCleanCookie(xhGetCookie());
  if (cookie) headers["Cookie"] = cookie;
  return headers;
}

function xhAbsolute(value) {
  if (!value) return "";
  var url = String(value).trim();
  if (!url) return "";
  if (url.indexOf("//") === 0) return "https:" + url;
  if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) return url;
  if (url.charAt(0) === "/") return XH_BASE + url;
  return XH_BASE + "/" + url;
}

function xhDecode(value) {
  if (!value) return "";
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (_, code) {
      return String.fromCharCode(parseInt(code, 10));
    })
    .replace(/&#x([0-9a-fA-F]+);/g, function (_, code) {
      return String.fromCharCode(parseInt(code, 16));
    })
    .replace(/\s+/g, " ")
    .trim();
}

function xhSlugFromUrl(url) {
  var m = String(url || "").match(/\/videos\/([^/?#]+)/);
  return m ? m[1] : "";
}

function xhSecondsToText(seconds) {
  var s = Math.max(0, Math.round(Number(seconds) || 0));
  var h = Math.floor(s / 3600);
  var m = Math.floor((s % 3600) / 60);
  var sec = s % 60;
  var pad = function (v) {
    return v < 10 ? "0" + v : String(v);
  };
  if (h > 0) return h + ":" + pad(m) + ":" + pad(sec);
  return m + ":" + pad(sec);
}

// 和 ONE 一样，把所有可能的图片字段都铺上，Rex 认哪个都行
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

// ───────────────────────── 请求 ─────────────────────────

function xhSleep(ms) {
  return new Promise(function (resolve) {
    if (typeof setTimeout === "function") setTimeout(resolve, ms);
    else resolve();
  });
}

function xhLooksLikeErrorPage(text) {
  if (!text || typeof text !== "string") return true;
  if (text.indexOf("error404-page") >= 0) return true;
  if (text.indexOf("error-page") >= 0 && text.indexOf("data-video-id=") < 0) return true;
  return false;
}

async function xhHttp(url) {
  var headers = xhHeaders();
  var lastError = null;
  // 网页是 GET 端点，先试 GET；POST 到页面 URL 会返回 404 错误页，必须识别出来再回落
  try {
    if (Widget.http && typeof Widget.http.get === "function") {
      var getResp = await Widget.http.get(url, { headers: headers });
      var getData = typeof getResp === "string" ? getResp : getResp && getResp.data;
      console.log("[xh.gay] GET " + url + " -> " + (typeof getData === "string" ? getData.length : "非字符串") + " 字符，预览：" + String(getData || "").slice(0, 150).replace(/\s+/g, " "));
      if (typeof getData === "string" && getData && !xhLooksLikeErrorPage(getData)) return getData;
      if (getData && !xhLooksLikeErrorPage(String(getData))) {
        try { return JSON.stringify(getData); } catch (_) { return String(getData); }
      }
      console.log("[xh.gay] GET 返回疑似错误页，改试 POST");
    }
  } catch (e) {
    console.log("[xh.gay] GET 抛错：" + e.message);
    lastError = e;
  }
  try {
    if (Widget.http && typeof Widget.http.post === "function") {
      var postResp = await Widget.http.post(url, "", { headers: headers });
      var postData = typeof postResp === "string" ? postResp : postResp && postResp.data;
      console.log("[xh.gay] POST " + url + " -> " + (typeof postData === "string" ? postData.length : "非字符串") + " 字符，预览：" + String(postData || "").slice(0, 150).replace(/\s+/g, " "));
      if (typeof postData === "string" && postData && !xhLooksLikeErrorPage(postData)) return postData;
      if (postData && !xhLooksLikeErrorPage(String(postData))) {
        try { return JSON.stringify(postData); } catch (_) { return String(postData); }
      }
      console.log("[xh.gay] POST 返回疑似错误页");
    }
  } catch (e) {
    console.log("[xh.gay] POST 抛错：" + e.message);
    lastError = e;
  }
  throw lastError || new Error("请求失败：" + url);
}

// Rex 里到网站的 TLS 连接会间歇性失败（09:12 日志：列表调用三次全是 TLS 错误），
// 3 次重试、间隔 2 秒不够。改成 5 次、退避 1s/2s/4s/8s，总窗口约 15 秒，
// 扛住短暂的网络抖动；如果 VPN 本身断了，重试也救不了。
async function fetchHtml(url) {
  var backoff = [1000, 2000, 4000, 8000];
  var lastError = null;
  for (var attempt = 1; attempt <= 5; attempt++) {
    try {
      var data = await xhHttp(url);
      if (data) return data;
      throw new Error("空内容：" + url);
    } catch (error) {
      lastError = error;
      console.log("[xh.gay] fetch 失败 第" + attempt + "/5次：" + error.message);
      if (attempt < 5) await xhSleep(backoff[attempt - 1]);
    }
  }
  throw lastError;
}

// ───────────────────────── 列表解析 ─────────────────────────

function parseList(html) {
  var items = [];
  if (!html) return items;
  var seen = {};

  // 页面里嵌了一份 videoThumbProps JSON（pageURL/thumbURL/imageURL），
  // 桌面版只给前几张卡直出 <img>，后面的卡是骨架占位、图全在这份 JSON 里。
  // 先按 slug 建表，列表封面优先用它，<img> src 只作兜底。
  var posterBySlug = {};
  var jsonRe = /"pageURL":"([^"]+?)","thumbURL":"([^"]*?)","imageURL":"([^"]*?)"/g;
  var jm;
  while ((jm = jsonRe.exec(html)) !== null) {
    var pSlug = xhSlugFromUrl(jm[1].replace(/\\\//g, "/"));
    var iUrl = (jm[2] || jm[3] || "").replace(/\\\//g, "/");
    if (pSlug && iUrl && !posterBySlug[pSlug]) posterBySlug[pSlug] = iUrl;
  }

  var cardRe =
    /<div[^>]*class="[^"]*video-thumb[^"]*"[^>]*data-video-id="(\d+)"[\s\S]*?(?=<div[^>]*class="[^"]*video-thumb[^"]*"[^>]*data-video-id="|<div class="[^"]*pagination|$)/g;

  var cardMatch;
  while ((cardMatch = cardRe.exec(html)) !== null) {
    var card = cardMatch[0];
    var hrefMatch = card.match(/href="(https:\/\/[^"\/]+\/videos\/[^"]+)"/i);
    if (!hrefMatch) continue;
    var url = hrefMatch[1];
    var slug = xhSlugFromUrl(url);
    if (!slug || seen[slug]) continue;
    seen[slug] = true;

    var title = "";
    var titleAttr = card.match(/\btitle="([^"]{2,300})"/i);
    if (titleAttr) title = xhDecode(titleAttr[1]);
    if (!title) {
      var ariaAttr = card.match(/aria-label="([^"]{2,300})"/i);
      if (ariaAttr) title = xhDecode(ariaAttr[1]);
    }
    if (!title) title = xhDecode(slug.replace(/-/g, " "));

    var poster = "";
    var imgMatch = card.match(/<img\b[^>]*\bsrc="([^"]+)"/i);
    if (imgMatch) poster = xhAbsolute(imgMatch[1]);
    if (!poster) {
      var srcsetMatch = card.match(/\bsrcset="(https:\/\/[^"\s]+)/i);
      if (srcsetMatch) poster = xhAbsolute(srcsetMatch[1]);
    }
    // v21：列表封面改用 JSON 里的 thumbURL（526×298），不用 imageURL（2560×1440）。
    // 首页一次 51 张封面，全用 2560×1440 解码要 ~750MB，Rex 进 App 就卡、掉帧；
    // 缩略图解码只要 ~32MB，列表小图完全够用。详情页大图不受影响（parseDetail 用 og:image）。
    // 桌面版后面的卡片没有 <img>，仍靠这份 JSON 兜底；thumbURL 为空时回退 imageURL。
    if (posterBySlug[slug]) poster = posterBySlug[slug];

    var durationText = "";
    var durBlock = card.match(/data-role="video-duration"[\s\S]{0,400}?<\/div>/i);
    if (durBlock) {
      var durText = durBlock[0].replace(/<[^>]+>/g, " ").match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
      if (durText) durationText = durText[1];
    }

    var descBits = [];
    var upMatch = card.match(/video-uploader__name[^>]*>([\s\S]{0,80}?)<\/a>/i);
    if (upMatch) {
      var up = xhDecode(upMatch[1].replace(/<[^>]+>/g, ""));
      if (up) descBits.push(up);
    }
    var viewBlock = card.match(/video-thumb-views[^>]*>([\s\S]{0,120}?)<\/div>/i);
    if (viewBlock) {
      var vt = xhDecode(viewBlock[1].replace(/<[^>]+>/g, ""));
      if (vt) descBits.push(vt);
    }
    if (durationText) descBits.push(durationText);

    var item = {
      id: slug,
      type: "detail",
      mediaType: "movie",
      title: title,
      link: url,
      description: descBits.join(" · "),
    };
    if (durationText) item.durationText = durationText;

    items.push(withImages(item, poster));
  }

  return items;
}

// ───────────────────────── 详情解析 ─────────────────────────

function parseDetail(html, fallbackUrl) {
  var result = {
    title: "",
    description: "",
    poster: "",
    durationText: "",
    durationSeconds: 0,
    m3u8: "",
    previewMp4: "",
    genreTitle: "",
    releaseDate: "",
  };
  if (!html) return result;

  var ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
  if (ogTitle) result.title = xhDecode(ogTitle[1]);
  if (!result.title) {
    var h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1) result.title = xhDecode(h1[1].replace(/<[^>]+>/g, ""));
  }

  var ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i);
  if (ogImage) result.poster = xhAbsolute(ogImage[1]);

  var ogDesc = html.match(/<meta\s+name="description"\s+content='([^']*)'/i);
  if (!ogDesc) ogDesc = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  if (ogDesc) result.description = xhDecode(ogDesc[1]);

  var m3u8 = html.match(/(https:\/\/video-[a-z0-9]+\.xhcdn\.com\/[^"'\s<>]+\.m3u8)/i);
  if (m3u8) result.m3u8 = m3u8[1].replace(/\\\//g, "/");

  var mp4 = html.match(/(https:\/\/thumb-[a-z0-9]+\.xhcdn\.com\/[^"'\s<>]+\.mp4)/i);
  if (mp4) result.previewMp4 = mp4[1].replace(/\\\//g, "/");

  var dur = html.match(/"duration":(\d+)/);
  if (dur) {
    result.durationSeconds = Number(dur[1]);
    result.durationText = xhSecondsToText(result.durationSeconds);
  }

  var genres = [];
  var genreRe = /href="https:\/\/[^\/]+\/(?:gay\/)?categories-([a-z0-9\-]+)"/gi;
  var gm;
  while ((gm = genreRe.exec(html)) !== null) {
    var g = xhDecode(gm[1]);
    if (g && genres.indexOf(g) === -1) genres.push(g);
  }
  result.genreTitle = genres.slice(0, 6).join(", ");

  return result;
}

// ───────────────────────── HLS 选档 ─────────────────────────

function resolveRelative(base, rel) {
  if (!rel) return "";
  if (/^https?:\/\//i.test(rel)) return rel;
  if (rel.indexOf("//") === 0) return "https:" + rel;

  var baseNoQuery = base.split("?")[0].split("#")[0];
  var lastSlash = baseNoQuery.lastIndexOf("/");
  var dir = lastSlash >= 0 ? baseNoQuery.slice(0, lastSlash + 1) : baseNoQuery + "/";
  if (rel.charAt(0) === "/") {
    var m = baseNoQuery.match(/^(https?:\/\/[^/]+)/);
    return (m ? m[1] : "") + rel;
  }
  return dir + rel;
}

function pickBestVariant(manifest, masterUrl) {
  var all = pickAllVariants(manifest, masterUrl);
  return all.length ? all[all.length - 1].uri : "";
}

// 取 master 清单里的全部档位，按码率从低到高排；没有档位信息时返回 []
// 每档：{ uri, bandwidth, height, res }，res 如 "480p"（取不到高度时为空）
function pickAllVariants(manifest, masterUrl) {
  if (!manifest || manifest.indexOf("#EXT-X-STREAM-INF") === -1) return [];
  var lines = manifest.split(/\r?\n/);
  var out = [];
  var seen = {};
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.indexOf("#EXT-X-STREAM-INF") !== 0) continue;

    var bwMatch = line.match(/BANDWIDTH=(\d+)/i);
    var resMatch = line.match(/RESOLUTION=(\d+)x(\d+)/i);
    var bandwidth = bwMatch ? Number(bwMatch[1]) : 0;
    var height = resMatch ? Number(resMatch[2]) : 0;

    var j = i + 1;
    while (j < lines.length && (!lines[j].trim() || lines[j].trim().charAt(0) === "#")) j++;
    if (j >= lines.length) break;
    var uri = resolveRelative(masterUrl, lines[j].trim());
    if (!uri || seen[uri]) continue;
    seen[uri] = 1;
    if (!height) {
      var hm = uri.match(/\/(\d+)p\.[^\/]*\.m3u8/i);
      if (hm) height = Number(hm[1]);
    }
    out.push({ bandwidth: bandwidth, height: height, uri: uri, res: height ? height + "p" : "" });
  }
  out.sort(function (a, b) {
    if (a.bandwidth !== b.bandwidth) return a.bandwidth - b.bandwidth;
    return a.height - b.height;
  });
  return out;
}

// 默认档：优先 480p，没有 480 就取最接近 480 的低档（360/240），再没有就取最低档
function pickDefaultVariant(variants) {
  if (!variants || !variants.length) return null;
  for (var i = 0; i < variants.length; i++) {
    if (variants[i].height === 480) return variants[i];
  }
  var below = null;
  for (var k = 0; k < variants.length; k++) {
    if (variants[k].height && variants[k].height < 480) below = variants[k];
  }
  if (below) return below;
  return variants[0];
}

// 取 master 清单里的最高档位；失败时返回 master 本身（兼容旧调用）
async function resolveBestVariant(masterUrl) {
  var all = await resolveAllVariants(masterUrl);
  if (all.bestUrl) return { url: all.bestUrl, res: all.bestRes };
  return { url: masterUrl, res: "" };
}

// 取 master 清单里的全部档位 + 默认档 + 最高档；失败时只剩 master 本身
// 返回 { variants:[{uri,bandwidth,height,res}], defaultUrl, defaultRes, bestUrl, bestRes }
async function resolveAllVariants(masterUrl) {
  var empty = { variants: [], defaultUrl: masterUrl, defaultRes: "", bestUrl: masterUrl, bestRes: "" };
  try {
    var manifest = await fetchHtml(masterUrl);
    var variants = pickAllVariants(manifest, masterUrl);
    if (!variants.length) return empty;
    var def = pickDefaultVariant(variants) || variants[0];
    var best = variants[variants.length - 1];
    return { variants: variants, defaultUrl: def.uri, defaultRes: def.res, bestUrl: best.uri, bestRes: best.res };
  } catch (e) {
    console.log("[xh.gay] 取档位失败：" + e.message);
  }
  return empty;
}

// 把全部档位排成线路：默认档（480p）放第一位，其余按从低到高排
function variantsToLines(all, masterUrl) {
  var lines = [];
  if (!all || !all.variants || !all.variants.length) {
    lines.push({ name: "HLS", description: "默认", url: masterUrl });
    return lines;
  }
  var defUrl = all.defaultUrl;
  var ordered = all.variants.slice().sort(function (a, b) {
    if (a.uri === defUrl) return -1;
    if (b.uri === defUrl) return 1;
    if (a.bandwidth !== b.bandwidth) return a.bandwidth - b.bandwidth;
    return a.height - b.height;
  });
  for (var i = 0; i < ordered.length; i++) {
    var v = ordered[i];
    var isDef = v.uri === defUrl;
    var isBest = v.uri === all.bestUrl;
    lines.push({
      name: "HLS " + (v.res || "默认"),
      description: isDef ? "默认·最顺" : (isBest ? "最高画质" : "画质 " + (v.res || "")),
      url: v.uri,
    });
  }
  return lines;
}

// ───────────────────────── 列表入口 ─────────────────────────

function listPath(kind) {
  switch (String(kind || "home")) {
    case "home":
      return "gay";
    case "fav":
      return "gay";
    case "history":
      return "my/watch-history";
    case "newest":
      return "gay/newest";
    case "best":
      return "gay/best";
    case "shorts":
      return "gay/shorts";
    case "channels":
      return "gay/channels";
    case "pornstars":
      return "gay/pornstars";
    default:
      // 任意 cat-<slug> 直接对应 gay/categories/<slug>，不用逐个写 case
      if (kind && kind.indexOf("cat-") === 0) return "gay/categories/" + kind.slice(4);
      return "gay";
  }
}

// ───────────────────────── 我的账号（登录 Cookie 设置） ─────────────────────────
// 「我的账号」页：粘贴登录 Cookie，保存在 Rex 本机（Widget.storage），
// 不写进公开的模块文件。保存后，列表请求会带上它，网站按该账号的喜好返回推荐。
// 输入框留空提交 = 清除已保存的 Cookie。
async function loadAccount(params) {
  params = params || {};
  var input = params.cookie != null ? String(params.cookie).trim() : "";
  if (input) {
    xhSetCookie(input);
    return [{
      id: "xh-account-saved",
      type: "detail",
      mediaType: "movie",
      title: "已保存",
      description: "登录信息已保存到本机。重新打开「个人爱好」即可看到按你账号喜好的推荐。Cookie 会过期，过期后重新粘贴一次。",
      link: "xh://account",
    }];
  }
  if (xhGetCookie()) {
    return [{
      id: "xh-account-status",
      type: "detail",
      mediaType: "movie",
      title: "已登录",
      description: "已保存登录信息。重新打开「个人爱好」即可看到按你账号喜好的推荐。如推荐变回通用内容，说明 Cookie 过期了，重新粘贴一次。",
      link: "xh://account",
    }];
  }
  return [{
    id: "xh-account-empty",
    type: "detail",
    mediaType: "movie",
    title: "未设置",
    description: "请在上方输入框粘贴登录 Cookie 后提交。Cookie 只存在本机，不会写进公开的模块文件。",
    link: "xh://account",
  }];
}

// 复合推荐：用 gay 分区搜索做复合标签（单分类太宽、分类页取交集几乎无重叠、
// 全站搜索会混进直男内容，只有 /gay/search/ 多关键词能按复合口味筛）。
// 6 个组合并行搜，各取前 10 条，轮询拼成一页 60 条，去重。
var MIX_QUERIES = ["日本 爸爸", "日本 老人", "中国 爸爸", "日本 熊", "亚洲 爸爸", "日本 爸爸 手交"];

async function gaySearch(query, page) {
  var encoded = encodeURIComponent(query);
  var url = page <= 1
    ? XH_BASE + "/gay/search/" + encoded
    : XH_BASE + "/gay/search/" + encoded + "/" + page;
  var html = await fetchHtml(url);
  return parseList(html);
}

async function loadMix(page) {
  // 阈值匹配：6 组复合搜索，分 2 批、每批 3 组并行（峰值并发 3，不触发 503 限流），
  // 每组取前 15 条，轮询拼成一页，去重，封顶 90。单组失败不影响其他组。
  var results = [];
  for (var b = 0; b < MIX_QUERIES.length; b += 3) {
    var batch = MIX_QUERIES.slice(b, b + 3);
    var part = await Promise.all(batch.map(function (q) {
      return gaySearch(q, page).catch(function () { return []; });
    }));
    results = results.concat(part);
  }
  var seen = {};
  var merged = [];
  var idx = 0;
  var PER = 15;
  var CAP = 90;
  while (merged.length < CAP && idx < PER) {
    var added = false;
    for (var i = 0; i < results.length; i++) {
      var list = results[i] || [];
      if (idx < list.length) {
        var v = list[idx];
        if (v && v.id && !seen[v.id]) {
          seen[v.id] = 1;
          merged.push(v);
          added = true;
        }
      }
    }
    if (!added) break;
    idx++;
  }
  return merged;
}

async function loadList(params) {
  params = params || {};
  var kind = params.kind || "home";
  var rawPage = params.page;
  var page = parseInt(String(rawPage == null ? "1" : rawPage), 10);
  if (!isFinite(page) || page < 1) page = 1;

  var path = listPath(kind);
  var url = page <= 1 ? XH_BASE + "/" + path : XH_BASE + "/" + path + "/" + page;
  // 复合推荐：6 个复合口味组合并行搜，轮询拼成一页（见 loadMix）
  if (kind === "mix") {
    var mixItems = await loadMix(page);
    console.log("[xh.gay] loadList mix items=" + mixItems.length);
    return mixItems;
  }

  // 首页/个人爱好走官方站（拿真正的账号个性化推荐），其余分类仍走镜像站
  var isHome = (kind === "home" || kind === "fav");
  var homeUrl = isHome
    ? (page <= 1 ? XH_HOME_BASE + "/" + path : XH_HOME_BASE + "/" + path + "/" + page)
    : "";

  // 观看历史要登录：没存 Cookie 时直接提示去「我的账号」设置，不要去抓登录页
  if (kind === "history" && !xhGetCookie()) {
    return [{
      id: "xh-history-need-login",
      type: "detail",
      mediaType: "movie",
      title: "请先登录",
      description: "观看历史要登录账号。先去「我的账号」页粘贴登录 Cookie，再打开本页。",
      link: "xh://account",
    }];
  }

  console.log("[xh.gay] loadList kind=" + kind + " page=" + page + " url=" + url);
  // 观看历史抓取失败也不要抛错（抛错会让 Rex 隐藏该标签），返回一条提示
  if (kind === "history") {
    try {
      var hHtml = await fetchHtml(url);
      var hItems = parseList(hHtml);
      console.log("[xh.gay] loadList history items=" + hItems.length);
      if (hItems.length) return hItems;
      return [{
        id: "xh-history-empty",
        type: "detail",
        mediaType: "movie",
        title: "暂无观看记录",
        description: "账号下暂时没有观看记录，或 Cookie 已过期。先去「我的账号」重新粘贴 Cookie 再试。",
        link: "xh://account",
      }];
    } catch (e) {
      console.log("[xh.gay] loadList history 失败：" + e.message);
      return [{
        id: "xh-history-error",
        type: "detail",
        mediaType: "movie",
        title: "观看历史加载失败",
        description: "网络或登录已过期：先去「我的账号」重新粘贴 Cookie 再试。错误：" + String(e.message || e).slice(0, 80),
        link: "xh://account",
      }];
    }
  }
  var html;
  var items;
  if (homeUrl) {
    try {
      html = await fetchHtml(homeUrl);
      items = parseList(html);
      if (!items.length) throw new Error("官方站首页无视频");
    } catch (e) {
      console.log("[xh.gay] 官方站首页失败，回退镜像站：" + e.message);
      html = await fetchHtml(url);
      items = parseList(html);
    }
  } else {
    html = await fetchHtml(url);
    items = parseList(html);
  }
  console.log("[xh.gay] loadList items=" + items.length);
  return items;
}

// ───────────────────────── 搜索 ─────────────────────────

async function searchVideos(params) {
  params = params || {};
  var keyword = String(params.keyword || params.query || params.q || "").trim();
  if (!keyword) return [];

  var page = parseInt(String(params.page == null ? "1" : params.page), 10);
  if (!isFinite(page) || page < 1) page = 1;

  var encoded = encodeURIComponent(keyword);
  var url = page <= 1
    ? XH_BASE + "/search/" + encoded
    : XH_BASE + "/search/" + encoded + "/" + page;

  console.log("[xh.gay] search=" + keyword + " page=" + page);
  var html = await fetchHtml(url);
  var items = parseList(html);
  console.log("[xh.gay] search items=" + items.length);

  // 和 ONE 的 detailKeyword 一样：返回一个 detail 条目，把结果塞进 relatedItems
  return {
    id: "xh-kw-" + keyword,
    type: "detail",
    mediaType: "movie",
    title: keyword,
    description: "搜索 · 共 " + items.length + " 条",
    link: "xh://k/" + encoded,
    relatedItems: items,
  };
}

// ───────────────────────── 详情 ─────────────────────────

function resolveLink(link) {
  var raw = String(link || "").trim();
  if (!raw) return "";
  if (raw.indexOf("xh://k/") === 0) return ""; // 关键词页不需要抓详情
  if (/^https?:\/\//.test(raw)) return xhAbsolute(raw);
  if (raw.indexOf("/videos/") === 0) return XH_BASE + raw;
  if (raw.indexOf("videos/") === 0) return XH_BASE + "/" + raw;
  // 纯 slug
  if (/^[a-z0-9\-]+$/i.test(raw)) return XH_BASE + "/videos/" + raw;
  return "";
}

async function resolveStream(url) {
  var cached = STREAM_CACHE[url];
  if (cached && Date.now() - cached.ts < STREAM_TTL) return cached;

  var html = await fetchHtml(url);
  var parsed = parseDetail(html, url);
  var rec = { parsed: parsed, ts: Date.now() };
  STREAM_CACHE[url] = rec;
  return rec;
}

async function loadDetail(link) {
  var raw = String(link || "").trim();

  // 关键词结果页
  if (raw.indexOf("xh://k/") === 0) {
    var kw = decodeURIComponent(raw.replace("xh://k/", ""));
    var found = await searchVideos({ keyword: kw, page: 1 });
    return found;
  }

  var url = resolveLink(raw);
  if (!url) {
    throw new Error("无法识别 XH 链接：" + raw);
  }

  var rec = await resolveStream(url);
  var p = rec.parsed;
  var slug = xhSlugFromUrl(url);

  // v29：默认播 480p（最顺），全部档位做成可切换的线路，不再默认最高档
  var allDetail = p.m3u8 ? await resolveAllVariants(p.m3u8) : null;
  var detailPlayUrl = (allDetail && allDetail.defaultUrl) || p.m3u8 || p.previewMp4 || "";

  var bits = [];
  if (p.genreTitle) bits.push(p.genreTitle);
  if (p.durationText) bits.push(p.durationText);
  var head = bits.join(" · ");
  var body = p.description || "";
  var desc = body ? (head ? head + "\n" + body : body) : head;

  var item = {
    id: slug,
    type: "detail",
    mediaType: "movie",
    title: p.title || xhDecode(slug.replace(/-/g, " ")),
    link: url,
    description: desc,
    overview: body,
    videoUrl: detailPlayUrl,
  };

  if (p.durationSeconds > 0) {
    item.duration = p.durationSeconds;
    item.durationText = p.durationText;
  }
  if (p.genreTitle) item.genreTitle = p.genreTitle;

  // 多线路塞进 childItems，和 ONE 的做法一致
  var lines = [];
  if (p.m3u8) {
    lines = lines.concat(variantsToLines(allDetail, p.m3u8));
  }
  if (p.previewMp4) {
    lines.push({ name: "预览 MP4", description: "低码率预览", url: p.previewMp4 });
  }
  if (lines.length) {
    item.childItems = lines.map(function (l, idx) {
      return {
        id: slug + "-" + (idx + 1),
        type: "url",
        mediaType: "movie",
        title: l.name,
        description: l.description,
        videoUrl: l.url,
        link: l.url,
      };
    });
  }

  console.log("[xh.gay] loadDetail title=" + item.title + " lines=" + lines.length);
  return withImages(item, p.poster);
}

// ───────────────────────── 播放资源 ─────────────────────────

async function loadResource(params) {
  params = params || {};
  console.log("[xh.gay] loadResource params=" + JSON.stringify(params));
  // Rex 可能直接传字符串链接，也可能传 {link,title} 对象，两种都接
  var link = "";
  if (typeof params === "string") link = params;
  else link = params.link || params.url || params.id || "";
  var url = resolveLink(link);
  console.log("[xh.gay] loadResource link=" + link + " -> url=" + url);

  if (!url) {
    console.log("[xh.gay] loadResource 无有效链接");
    return [{ name: "⚠️未收到链接", description: "params=" + JSON.stringify(params).slice(0, 120), url: XH_BASE + "/" }];
  }

  // 如果直接传进来的是 m3u8 地址，直接当 master 清单展开：全部档位都返回
  if (/\.m3u8(\?|#|$)/i.test(url)) {
    try {
      var all0 = await resolveAllVariants(url);
      var lines0 = variantsToLines(all0, url);
      console.log("[xh.gay] loadResource 直连 m3u8 资源数=" + lines0.length);
      return lines0;
    } catch (e) {
      console.log("[xh.gay] 展开 master 失败：" + e.message);
    }
    return [{ name: "HLS", description: "默认", url: url }];
  }

  var rec;
  try {
    rec = await resolveStream(url);
  } catch (error) {
    console.log("[xh.gay] loadResource 取详情失败：" + error.message);
    return [{ name: "❌抓详情失败", description: error.message, url: url }];
  }
  var p = rec.parsed;
  console.log("[xh.gay] loadResource 解析到 m3u8=" + (p.m3u8 ? "有" : "无") + " mp4=" + (p.previewMp4 ? "有" : "无"));

  var out = [];

  if (p.m3u8) {
    try {
      var allR = await resolveAllVariants(p.m3u8);
      out = out.concat(variantsToLines(allR, p.m3u8));
      console.log("[xh.gay] 展开 master 档位数=" + allR.variants.length + " 默认=" + allR.defaultRes);
    } catch (error) {
      console.log("[xh.gay] 展开 master 失败：" + error.message);
      out.push({ name: "HLS", description: "默认", url: p.m3u8 });
    }
  }

  if (p.previewMp4) {
    out.push({ name: "预览 MP4", description: "低码率预览", url: p.previewMp4 });
  }

  if (!out.length) {
    console.log("[xh.gay] loadResource 未解析到地址");
    return [{ name: "❌没解析到地址", description: "详情页已抓到但无 m3u8/mp4", url: url }];
  }

  console.log("[xh.gay] loadResource 资源数=" + out.length + " 首条=" + (out[0] ? out[0].url.slice(0, 90) : ""));
  return out;
}

// 兼容别名
var getDetail = loadDetail;
var loadResources = loadResource;
var stream = loadResource;
var mediaHook = loadResource;
