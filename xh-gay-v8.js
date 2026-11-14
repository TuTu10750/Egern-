/**
 * Rex 模块：XH Gay（zh.xhzone.life 镜像站，主站 zh.xhofficial.com 在用户网络下无法访问）
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
  id: "user.xhgay8",
  title: "XH Gay",
  description: "zh.xhzone.life 男同视频 · 最新/热门/分类/搜索，HLS 直连",
  author: "YG",
  version: "1.0.8",
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
      id: "xh-resource",
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
      id: "xh-home",
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
      id: "xh-newest",
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
      id: "xh-best",
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
      id: "xh-cat-chinese",
      title: "国产",
      description: "中国人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-chinese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-asian",
      title: "亚洲",
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
      id: "xh-cat-bear",
      title: "熊",
      description: "熊系分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bear" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-japanese",
      title: "日本",
      description: "日本人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-japanese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-twink",
      title: "Twink",
      description: "Twink 分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-twink" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
  ],
};

// ───────────────────────── 常量 ─────────────────────────

var XH_BASE = "https://zh.xhzone.life";
var XH_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

var STREAM_CACHE = {};
var STREAM_TTL = 10 * 60 * 1000;

function xhHeaders() {
  return {
    "User-Agent": XH_UA,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    Referer: XH_BASE + "/",
  };
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

async function fetchHtml(url) {
  var lastError = null;
  for (var attempt = 1; attempt <= 3; attempt++) {
    try {
      var data = await xhHttp(url);
      if (data) return data;
      throw new Error("空内容：" + url);
    } catch (error) {
      lastError = error;
      console.log("[xh.gay] fetch 失败 第" + attempt + "次：" + error.message);
      if (attempt < 3) await xhSleep(2000);
    }
  }
  throw lastError;
}

// ───────────────────────── 列表解析 ─────────────────────────

function parseList(html) {
  var items = [];
  if (!html) return items;
  var seen = {};

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
  if (!manifest || manifest.indexOf("#EXT-X-STREAM-INF") === -1) return "";
  var lines = manifest.split(/\r?\n/);
  var best = null;
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
    var uri = lines[j].trim();

    if (!best || bandwidth > best.bandwidth || (bandwidth === best.bandwidth && height > best.height)) {
      best = { bandwidth: bandwidth, height: height, uri: resolveRelative(masterUrl, uri) };
    }
  }
  return best ? best.uri : "";
}

// ───────────────────────── 列表入口 ─────────────────────────

function listPath(kind) {
  switch (String(kind || "home")) {
    case "home":
      return "gay";
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
    case "cat-chinese":
      return "gay/categories/chinese";
    case "cat-asian":
      return "gay/categories/asian";
    case "cat-bear":
      return "gay/categories/bear";
    case "cat-japanese":
      return "gay/categories/japanese";
    case "cat-twink":
      return "gay/categories/twink";
    default:
      return "gay";
  }
}

async function loadList(params) {
  params = params || {};
  var kind = params.kind || "home";
  var rawPage = params.page;
  var page = parseInt(String(rawPage == null ? "1" : rawPage), 10);
  if (!isFinite(page) || page < 1) page = 1;

  var path = listPath(kind);
  var url = page <= 1 ? XH_BASE + "/" + path : XH_BASE + "/" + path + "/" + page;

  console.log("[xh.gay] loadList kind=" + kind + " page=" + page + " url=" + url);
  var html = await fetchHtml(url);
  var items = parseList(html);
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
    videoUrl: p.m3u8 || p.previewMp4 || "",
  };

  if (p.durationSeconds > 0) {
    item.duration = p.durationSeconds;
    item.durationText = p.durationText;
  }
  if (p.genreTitle) item.genreTitle = p.genreTitle;

  // 多线路塞进 childItems，和 ONE 的做法一致
  var lines = [];
  if (p.m3u8) {
    lines.push({ name: "HLS 自动", description: "自动选最高码率", url: p.m3u8 });
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

  // 如果直接传进来的是 m3u8 地址，直接当 master 清单展开
  if (/\.m3u8(\?|#|$)/i.test(url)) {
    var playUrl = url;
    try {
      var manifest0 = await fetchHtml(url);
      var best0 = pickBestVariant(manifest0, url);
      if (best0) playUrl = best0;
    } catch (e) {
      console.log("[xh.gay] 展开 master 失败：" + e.message);
    }
    console.log("[xh.gay] loadResource 直连 m3u8 资源数=1");
    return [{ name: "HLS", description: "最高码率", url: playUrl }];
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
    var playUrl = p.m3u8;
    try {
      var manifest = await fetchHtml(p.m3u8);
      var best = pickBestVariant(manifest, p.m3u8);
      if (best) {
        playUrl = best;
        console.log("[xh.gay] 选中高码率子清单");
      }
    } catch (error) {
      console.log("[xh.gay] 展开 master 失败：" + error.message);
    }
    out.push({ name: "HLS", description: "最高码率", url: playUrl });
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
