/*
 * 蓝果模块 v1 — Arue 个人定制
 * © 2026 Arue (TuTu10750)。仅供个人使用，禁止商用、禁止倒卖、禁止去水印改名再发。
 * 本文件为明文 JS，技术上无法阻止复制；此声明为权利归属与使用许可说明。
 */
/**
 * Rex 模块：蓝果 v1（languo.ai 男同短剧 + 男同GV）
 *
 * 站点结构（2026-11-21 实测）：
 *   - 首页 / ：混合推荐卡片（短剧 + GV）
 *   - 男同短剧 /duanju/{n}/，男同GV /gv/{n}/，每页约 29 条
 *   - 热门 /gv/hot/{n}/，排行榜 /ranking/（单页，约 18 条）
 *   - 标签页 /gv/tags/{slug}/{n}/、/duanju/tags/{slug}/{n}/
 *   - 搜索 /search/?q={关键词}（实测 200，可出结果；注意 /search/video/{词}/
 *     只搜短剧分区，搜“熊男”会返回 0 条，所以全站搜索必须走 /search/?q=）
 *   - 详情页 /video/{id}/：<script id="videoInitialData"> 里有 epPlaySrcs /
 *     epPlaySrcsHevc（分集 -> 签名 m3u8），以及分集链接 /video/{id}/ep-N/
 *   - 分集页 /video/{id}/ep-N/：epPlaySrcs 是 N-1/N/N+1 的滑动窗口，
 *     所以拿第 N 集必须抓 ep-N 页，不能只抓详情页（详情页只给 1、2 集）
 *   - 总集数不在 JSON 里，详情页 HTML 里的全部 /video/{id}/ep-N/ 链接
 *     的最大值就是总集数（实测 990583：1-12 集，115 部多集剧，最多 38 集）
 *
 * 时效（最重要）：
 *   - m3u8 和封面 URL 都带 auth_key 签名，约 2 小时过期，过期后必须重抓。
 *   - 所以模块里任何地方都不缓存、不硬编码 m3u8：列表只带 id/标题/封面，
 *     播放地址只在 loadDetail / loadResource 当场抓详情页或分集页现取。
 *   - detailCacheDuration 设 30 分钟，远小于 2 小时签名有效期。
 *   - m3u8 是单档 media 清单（AES-128 加密分片），没有多档位可切；
 *     有 HEVC 的话给第二条线（HEVC），默认先播普通 HLS。
 *   - 列表封面也是现抓现签的，打开列表时就是新鲜的，不用调封面重签名接口
 *     （实测 POST /api/media/covers 对该 id 返回空 covers，不靠它）。
 *
 * 契约严格对照 ONE 一个 v2.2.0 / XH Gay v29：
 *   - 条目 type: "detail"，条目入口字段 link
 *   - 顶层 loadDetail(link) 接收字符串 link
 *   - 顶层 search: { title, functionName, params }
 *   - 每个 module 带 requiresWebView: false
 *   - 只有 loadResource 带 type: "stream"
 *   - 顶层 detailCacheDuration
 *   - loadResource 返回 [{ name, description, url }]
 *   - childItems 承载分集，每项 type: "url"，link 为 lg://ep/{id}/{n}，
 *     点分集时 Rex 调 loadResource 现取该集的新签名 m3u8。
 */

var LG_BASE = "https://languo.ai";
var LG_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
// 站点鉴权：X-LL-Visitor（32 位 hex），模块加载时随机生成一次即可，无需登录
var LG_VISITOR = (function () {
  var s = "";
  var hex = "0123456789abcdef";
  for (var i = 0; i < 32; i++) s += hex.charAt(Math.floor(Math.random() * 16));
  return s;
})();

WidgetMetadata = {
  id: "user.languo1",
  title: "蓝果",
  description: "languo.ai 蓝果短剧 · 男同短剧 / 男同GV，分集现取签名播放地址",
  author: "Arue",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 30,
  site: "https://languo.ai",
  iconurl: "https://languo.ai/favicon.ico",

  search: {
    title: "搜索蓝果",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "" },
    ],
  },

  modules: [
    {
      id: "lg1-home",
      title: "首页",
      description: "蓝果首页混合推荐：短剧 + GV",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "home" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "lg1-duanju",
      title: "男同短剧",
      description: "男同短剧列表，按更新排序",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "duanju" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "lg1-gv",
      title: "男同GV",
      description: "男同GV 列表，按更新排序",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "gv" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "lg1-hot",
      title: "热门",
      description: "GV 热门榜",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "hot" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "lg1-rank",
      title: "排行榜",
      description: "全站排行榜（单页）",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "rank" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "lg1-tag-bear",
      title: "熊男",
      description: "标签：熊男Bear",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "tag:gv/tags/xiongnanbear" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "lg1-tag-suit",
      title: "正装西装",
      description: "标签：正装西装",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "tag:gv/tags/zhengzhuangxizhuang" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "lg1-tag-sm",
      title: "主奴调教",
      description: "标签：主奴调教",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "tag:gv/tags/zhunutiaojiao" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "lg1-tag-fresh",
      title: "小鲜肉",
      description: "标签：小鲜肉",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "tag:gv/tags/xiaoxianrou" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "lg1-tag-ai",
      title: "AI短剧",
      description: "标签：AI短剧（男同短剧分区）",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "tag:duanju/tags/ai-drama" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "lg1-resource",
      title: "播放资源",
      description: "按需现取签名播放地址（详情页/分集页调用，2 小时有效）",
      requiresWebView: false,
      cacheDuration: 0,
      functionName: "loadResource",
      type: "stream",
      params: [
        { name: "link", title: "链接", type: "constant", value: "" },
      ],
    },
  ],
};

// ───────────────────────── 工具 ─────────────────────────

function lgHeaders() {
  return {
    "User-Agent": LG_UA,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "X-LL-Visitor": LG_VISITOR,
    Referer: LG_BASE + "/",
  };
}

function lgDecode(value) {
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

function lgAbsolute(value) {
  if (!value) return "";
  var url = String(value).trim();
  if (!url) return "";
  if (url.indexOf("//") === 0) return "https:" + url;
  if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) return url;
  if (url.charAt(0) === "/") return LG_BASE + url;
  return LG_BASE + "/" + url;
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

function lgSleep(ms) {
  return new Promise(function (resolve) {
    if (typeof setTimeout === "function") setTimeout(resolve, ms);
    else resolve();
  });
}

async function lgHttp(url) {
  var headers = lgHeaders();
  var lastError = null;
  try {
    if (Widget.http && typeof Widget.http.get === "function") {
      var resp = await Widget.http.get(url, { headers: headers });
      var data = typeof resp === "string" ? resp : resp && resp.data;
      if (typeof data === "string" && data) return data;
      if (data) {
        try { return JSON.stringify(data); } catch (_) { return String(data); }
      }
      throw new Error("空响应：" + url);
    }
  } catch (e) {
    lastError = e;
  }
  throw lastError || new Error("请求失败：" + url);
}

// Rex 里到网站的 TLS 连接会间歇性失败，5 次重试、退避 1s/2s/4s/8s
async function fetchHtml(url) {
  var backoff = [1000, 2000, 4000, 8000];
  var lastError = null;
  for (var attempt = 1; attempt <= 5; attempt++) {
    try {
      var data = await lgHttp(url);
      if (data) return data;
      throw new Error("空内容：" + url);
    } catch (error) {
      lastError = error;
      console.log("[languo] fetch 失败 第" + attempt + "/5次：" + error.message);
      if (attempt < 5) await lgSleep(backoff[attempt - 1]);
    }
  }
  throw lastError;
}

// ───────────────────────── 列表解析 ─────────────────────────

// 封面 data-src 是 webp（带 #fb= 编码的 jpeg 兜底）：优先用 jpeg 兜底，
// 兼容性更好；没有 fb 时去掉 # 后面的片段再用 webp。
function lgCoverFromDataSrc(dataSrc) {
  if (!dataSrc) return "";
  var raw = String(dataSrc).trim();
  var fb = raw.match(/#fb=(.+)$/);
  if (fb && fb[1]) {
    try { return decodeURIComponent(fb[1]); } catch (e) { /* 用原值 */ }
  }
  return raw.split("#")[0];
}

function parseCards(html) {
  var items = [];
  if (!html) return items;
  var seen = {};
  var cardRe = /<article[^>]*class="[^"]*ll-card[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
  var m;
  while ((m = cardRe.exec(html)) !== null) {
    var card = m[1] || "";
    var href = card.match(/href="\/video\/(\d+)\/"/);
    if (!href) continue;
    var id = href[1];
    if (seen[id]) continue;
    seen[id] = 1;

    var title = "";
    var h3 = card.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    if (h3) title = lgDecode(h3[1].replace(/<[^>]+>/g, ""));
    if (!title) {
      var alt = card.match(/alt="([^"]{2,300})"/i);
      if (alt) title = lgDecode(alt[1]);
    }
    if (!title) continue;

    var cover = "";
    var ds = card.match(/data-src="([^"]+)"/i);
    if (ds) cover = lgCoverFromDataSrc(lgDecode(ds[1]));
    if (!cover) {
      var img = card.match(/<img\b[^>]*\bsrc="([^"]+)"/i);
      if (img && img[1].indexOf("cover-placeholder") < 0) cover = lgAbsolute(img[1]);
    }

    var descBits = [];
    var ep = card.match(/class="[^"]*ll-card__ep[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
    if (ep) {
      var epText = lgDecode(ep[1].replace(/<[^>]+>/g, ""));
      if (epText) descBits.push(epText);
    }
    var score = card.match(/class="[^"]*ll-card__score[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
    if (score) {
      var sc = lgDecode(score[1].replace(/<[^>]+>/g, ""));
      if (sc) descBits.push(sc);
    }
    var tags = [];
    var tagRe = /<a[^>]*href="\/(?:gv|duanju)\/tags\/[^"]*"[^>]*>([^<]{1,30})<\/a>/g;
    var tm;
    while ((tm = tagRe.exec(card)) !== null) {
      var t = lgDecode(tm[1]);
      if (t && tags.indexOf(t) === -1) tags.push(t);
    }
    if (tags.length) descBits.push(tags.join(" / "));

    var item = {
      id: id,
      type: "detail",
      mediaType: "movie",
      title: title,
      link: LG_BASE + "/video/" + id + "/",
      description: descBits.join(" · "),
    };
    items.push(withImages(item, cover));
  }
  return items;
}

// ───────────────────────── 详情解析 ─────────────────────────

function parseInitialData(html) {
  if (!html) return null;
  var m = html.match(/<script[^>]*id="videoInitialData"[^>]*>([\s\S]*?)<\/script>/i);
  if (!m) return null;
  try {
    var text = lgDecode(m[1]);
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

// 从详情页 HTML 里拿全部 /video/{id}/ep-N/ 链接的最大值 = 总集数
function lgTotalEps(html, id, initData) {
  var max = 0;
  var re = new RegExp("/video/" + id + "/ep-(\\d+)/", "g");
  var m;
  while ((m = re.exec(html)) !== null) {
    var n = parseInt(m[1], 10);
    if (n > max) max = n;
  }
  if (initData && initData.epPlaySrcs) {
    for (var k in initData.epPlaySrcs) {
      var kn = parseInt(k, 10);
      if (kn > max) max = kn;
    }
  }
  if (!max) max = 1;
  return max;
}

function parseDetailPage(html, url) {
  var idMatch = String(url || "").match(/\/video\/(\d+)\//);
  var id = idMatch ? idMatch[1] : "";
  var init = parseInitialData(html) || {};
  var total = id ? lgTotalEps(html, id, init) : 1;
  var currentEp = parseInt(init.ep || "1", 10);
  if (!isFinite(currentEp) || currentEp < 1) currentEp = 1;

  var title = lgDecode(init.title || "");
  if (!title) {
    var og = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
    if (og) title = lgDecode(og[1]);
  }
  var desc = lgDecode(init.description || "");
  if (!desc) {
    var ogd = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
    if (ogd) desc = lgDecode(ogd[1]);
  }
  var cover = init.coverSrc || init.posterSrc || "";
  if (!cover) {
    var ogi = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i);
    if (ogi) cover = ogi[1];
  }

  var tags = [];
  if (init.tags && init.tags.length) {
    for (var i = 0; i < init.tags.length; i++) {
      var t = lgDecode(init.tags[i]);
      if (t && tags.indexOf(t) === -1) tags.push(t);
    }
  }
  var crumbs = [];
  if (init.breadcrumb) {
    for (var j = 0; j < init.breadcrumb.length; j++) {
      var c = lgDecode(init.breadcrumb[j].name || "");
      if (c) crumbs.push(c);
    }
  }

  // 当前集的新签名 m3u8（详情页窗口只有 1、2 集；currentEp 一定在窗口里）
  var srcs = init.epPlaySrcs || {};
  var srcsHevc = init.epPlaySrcsHevc || {};
  var curM3u8 = srcs[String(currentEp)] || init.videoSrc || "";
  var curHevc = srcsHevc[String(currentEp)] || init.videoSrcHevc || "";

  return {
    id: id,
    title: title,
    description: desc,
    cover: cover,
    tags: tags,
    category: crumbs.join(" / "),
    views: init.views || "",
    published: init.time || "",
    totalEps: total,
    currentEp: currentEp,
    curM3u8: curM3u8,
    curHevc: curHevc,
  };
}

// ───────────────────────── 列表入口 ─────────────────────────

function listUrl(kind, page) {
  var path = "";
  switch (String(kind || "home")) {
    case "home": path = ""; break;
    case "duanju": path = "duanju"; break;
    case "gv": path = "gv"; break;
    case "hot": path = "gv/hot"; break;
    case "rank": path = "ranking"; break;
    default:
      // tag:gv/tags/xiongnanbear / tag:duanju/tags/ai-drama
      if (kind && kind.indexOf("tag:") === 0) path = kind.slice(4);
      else path = "";
      break;
  }
  if (path === "" && page > 1) return ""; // 首页无分页
  if (path === "ranking" && page > 1) return ""; // 排行榜单页
  if (!path) return LG_BASE + "/";
  return page <= 1 ? LG_BASE + "/" + path + "/" : LG_BASE + "/" + path + "/" + page + "/";
}

async function loadList(params) {
  params = params || {};
  var kind = params.kind || "home";
  var rawPage = params.page;
  var page = parseInt(String(rawPage == null ? "1" : rawPage), 10);
  if (!isFinite(page) || page < 1) page = 1;

  var url = listUrl(kind, page);
  if (!url) return [];
  console.log("[languo] loadList kind=" + kind + " page=" + page + " url=" + url);
  var html = await fetchHtml(url);
  var items = parseCards(html);
  console.log("[languo] loadList items=" + items.length);
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
    ? LG_BASE + "/search/?q=" + encoded
    : LG_BASE + "/search/?q=" + encoded + "&page=" + page;

  console.log("[languo] search=" + keyword + " page=" + page);
  var html = await fetchHtml(url);
  var items = parseCards(html);
  console.log("[languo] search items=" + items.length);

  return {
    id: "lg-kw-" + keyword,
    type: "detail",
    mediaType: "movie",
    title: keyword,
    description: "搜索 · 共 " + items.length + " 条",
    link: "lg://k/" + encoded,
    relatedItems: items,
  };
}

// ───────────────────────── 详情 ─────────────────────────

function resolveLink(link) {
  var raw = String(link || "").trim();
  if (!raw) return "";
  if (raw.indexOf("lg://k/") === 0) return "";
  if (raw.indexOf("lg://ep/") === 0) return raw;
  if (/^https?:\/\//.test(raw)) return raw;
  if (raw.indexOf("/video/") === 0) return LG_BASE + raw;
  if (/^\d+$/.test(raw)) return LG_BASE + "/video/" + raw + "/";
  return "";
}

// 解析 lg://ep/{id}/{n} 或 /video/{id}/ep-{n}/，返回 {id, ep}
function parseEpLink(link) {
  var raw = String(link || "").trim();
  var m = raw.match(/lg:\/\/ep\/(\d+)\/(\d+)/);
  if (m) return { id: m[1], ep: parseInt(m[2], 10) };
  var m2 = raw.match(/\/video\/(\d+)\/ep-(\d+)\//);
  if (m2) return { id: m2[1], ep: parseInt(m2[2], 10) };
  var m3 = raw.match(/\/video\/(\d+)\//);
  if (m3) return { id: m3[1], ep: 1 };
  return null;
}

async function loadDetail(link) {
  var raw = String(link || "").trim();

  // 关键词结果页
  if (raw.indexOf("lg://k/") === 0) {
    var kw = decodeURIComponent(raw.replace("lg://k/", ""));
    return await searchVideos({ keyword: kw, page: 1 });
  }

  // 分集伪链接：直接当第 N 集详情处理（现取该集签名地址）
  var epInfo = parseEpLink(raw);
  var url = resolveLink(raw);
  if (!url) throw new Error("无法识别蓝果链接：" + raw);

  var html;
  if (epInfo && epInfo.ep > 1) {
    // 第 N 集必须抓 ep-N 页（滑动窗口 N-1/N/N+1），详情页只给 1、2 集
    html = await fetchHtml(LG_BASE + "/video/" + epInfo.id + "/ep-" + epInfo.ep + "/");
  } else {
    html = await fetchHtml(url);
  }
  var p = parseDetailPage(html, LG_BASE + "/video/" + (epInfo ? epInfo.id : "") + "/");
  var playEp = epInfo ? epInfo.ep : p.currentEp;
  // 分集页的 epPlaySrcs 窗口里一定有 playEp；详情页同理（playEp=1）
  var init = parseInitialData(html) || {};
  var srcs = init.epPlaySrcs || {};
  var srcsHevc = init.epPlaySrcsHevc || {};
  var playM3u8 = srcs[String(playEp)] || p.curM3u8 || "";
  var playHevc = srcsHevc[String(playEp)] || p.curHevc || "";

  var bits = [];
  if (p.category) bits.push(p.category);
  if (p.totalEps > 1) bits.push("共 " + p.totalEps + " 集");
  if (p.views) bits.push("播放 " + p.views);
  if (p.published) bits.push(p.published);
  if (p.tags.length) bits.push(p.tags.join(" / "));
  var head = bits.join(" · ");
  var desc = p.description ? (head ? head + "\n" + p.description : p.description) : head;

  var item = {
    id: p.id,
    type: "detail",
    mediaType: "movie",
    title: p.title || ("视频 " + p.id),
    link: LG_BASE + "/video/" + p.id + "/",
    description: desc,
    overview: p.description,
    videoUrl: playM3u8,
  };
  if (p.tags.length) item.genreTitle = p.tags.join(", ");

  // 分集做成 childItems：每集一条伪链接，点播时 loadResource 现取新签名 m3u8
  if (p.totalEps > 1) {
    var children = [];
    for (var n = 1; n <= p.totalEps; n++) {
      children.push({
        id: p.id + "-ep" + n,
        type: "url",
        mediaType: "movie",
        title: "第 " + n + " 集",
        description: n === playEp ? "当前集" : "共 " + p.totalEps + " 集",
        videoUrl: "lg://ep/" + p.id + "/" + n,
        link: "lg://ep/" + p.id + "/" + n,
      });
    }
    item.childItems = children;
  } else if (playHevc) {
    // 单集且有 HEVC：详情里多给一条 HEVC 线
    item.childItems = [
      { id: p.id + "-hls", type: "url", mediaType: "movie", title: "HLS", description: "默认", videoUrl: playM3u8, link: playM3u8 },
      { id: p.id + "-hevc", type: "url", mediaType: "movie", title: "HEVC", description: "HEVC 编码", videoUrl: playHevc, link: playHevc },
    ];
  }

  console.log("[languo] loadDetail id=" + p.id + " title=" + item.title + " eps=" + p.totalEps + " playEp=" + playEp + " m3u8=" + (playM3u8 ? "有" : "无"));
  return withImages(item, p.cover);
}

// ───────────────────────── 播放资源 ─────────────────────────

// 现取签名播放地址：m3u8 约 2 小时过期，每次点播都重新抓，绝不用缓存的旧地址。
async function loadResource(params) {
  params = params || {};
  console.log("[languo] loadResource params=" + JSON.stringify(params));
  var link = "";
  if (typeof params === "string") link = params;
  else link = params.link || params.url || params.id || "";
  console.log("[languo] loadResource link=" + link);

  // 直接传进来 m3u8：本身就是现取的签名地址，直接播
  if (/\.m3u8(\?|#|$)/i.test(link)) {
    return [{ name: "HLS", description: "默认", url: link }];
  }

  var epInfo = parseEpLink(link);
  if (!epInfo) {
    return [{ name: "⚠️未收到链接", description: "params=" + JSON.stringify(params).slice(0, 120), url: LG_BASE + "/" }];
  }

  // 第 N 集抓 ep-N 页（滑动窗口含 N）；第 1 集抓详情页即可
  var pageUrl = epInfo.ep > 1
    ? LG_BASE + "/video/" + epInfo.id + "/ep-" + epInfo.ep + "/"
    : LG_BASE + "/video/" + epInfo.id + "/";
  var html;
  try {
    html = await fetchHtml(pageUrl);
  } catch (e) {
    console.log("[languo] loadResource 取分集页失败：" + e.message);
    return [{ name: "❌抓分集页失败", description: String(e.message || e).slice(0, 120), url: pageUrl }];
  }
  var init = parseInitialData(html) || {};
  var srcs = init.epPlaySrcs || {};
  var srcsHevc = init.epPlaySrcsHevc || {};
  var m3u8 = srcs[String(epInfo.ep)] || init.videoSrc || "";
  var hevc = srcsHevc[String(epInfo.ep)] || init.videoSrcHevc || "";
  console.log("[languo] loadResource id=" + epInfo.id + " ep=" + epInfo.ep + " m3u8=" + (m3u8 ? "有" : "无") + " hevc=" + (hevc ? "有" : "无"));

  var out = [];
  if (m3u8) out.push({ name: "HLS", description: "第 " + epInfo.ep + " 集 · 现取签名地址", url: m3u8 });
  if (hevc) out.push({ name: "HEVC", description: "第 " + epInfo.ep + " 集 · HEVC 编码", url: hevc });
  if (!out.length) {
    return [{ name: "❌没解析到地址", description: "分集页已抓到但无第 " + epInfo.ep + " 集的 m3u8（可能已下架）", url: pageUrl }];
  }
  return out;
}

// 兼容别名
var getDetail = loadDetail;
var loadResources = loadResource;
var stream = loadResource;
var mediaHook = loadResource;
