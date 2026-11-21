/*
 * 蓝果模块 v1.0.5 — Arue 个人定制
 * © 2026 Arue (TuTu10750)。仅供个人使用，禁止商用、禁止倒卖、禁止去水印改名再发。
 * 本文件为明文 JS，技术上无法阻止复制；此声明为权利归属与使用许可说明。
 */
/**
 * Rex 模块：蓝果 v1.0.5（languo.ai 男同短剧 + 男同GV）
 *
 * 站点结构（2026-11-21 实测）：
 *   - 首页 / ：混合推荐卡片（短剧 + GV）
 *   - 男同短剧 /duanju/{n}/，男同GV /gv/{n}/，每页约 29 条
 *   - 热门 /gv/hot/{n}/，排行榜 /ranking/（单页，约 18 条）
 *   - 标签页 /gv/tags/{slug}/{n}/、/duanju/tags/{slug}/{n}/
 *   - 搜索 /search/?q={关键词}（实测 200，可出结果；注意 /search/video/{词}/
 *     只搜短剧分区，搜“熊男”会返回 0 条，所以全站搜索必须走 /search/?q=）
 * v1.0.5（2026-11-21，冲资源库式分集网格）：
 *   - 网上有官方写法：Forward 官方模块文档（InchStudio/ForwardWidgets
 *     README + AGENTS.md）定义了分集的正经字段 episodeItems: [VideoItem]
 *     —— 之前用的 childItems 是错的字段，所以详情页从不渲染选集区。
 *     v1.0.5：loadDetail 给多集剧返回 episodeItems，每集一个 VideoItem
 *     （type "url"、mediaType "tv"、season 1、episode N、title 第 N 集、
 *     link 分集页地址、videoUrl 新鲜 m3u8、backdropPath 剧封面、duration
 *     秒数 + durationText 分钟数）。单集剧照站内没有，用剧封面顶。
 *   - 时长从播单里算：拉该集 m3u8，把 #EXTINF 秒数加起来（5 并发），
 *     拿不到就留空，不拖垮详情。
 *   - loadDetail 不再给分集做 type "url" 的 childItems（避免网格和资源
 *     行各出现一份分集）；loadResource 的分集卡保留（已验证渲染，双保险）。
 * v1.0.4（2026-11-21，修 v1.0.3 实测问题）：
 *   - v1.0.3 的分集子项在真机上还是没出现在播放资源行里（12:21 截图：
 *     详情页仍显示列表卡片的描述，资源行只有 HLS 一张蓝果卡 + XH ❌ 卡）。
 *     但同一张截图证明了另一条路一定通：loadResource 返回的线路卡是正常
 *     渲染的（HLS 卡可点开，内容就是第 1 集的新鲜 m3u8）。所以 v1.0.4 把
 *     分集直接做进 loadResource：多集剧返回「第 1 集 / 第 2 集 ……」每集一
 *     张卡（点哪集播哪集，地址是该集最高画质），不再只依赖 loadDetail 的
 *     子项。loadDetail 的子项保留（双保险）。
 *   - loadResource 的分集拉取复用同一套并行预拉 + 缓存（100 分钟），请求
 *     的那集排第一张，其余按集数排；当前集有 HEVC 时末尾再补一张 HLS 备用。
 *   - loadDetail 的预拉包一层 try/catch：预拉任何异常都不能拖垮详情返回。
 * v1.0.3（2026-11-21，修 v1.0.2 实测问题）：
 *   - 分集还是没出来。v1.0.2 的 type: "detail" 分集子项在真机详情页里根本不
 *     渲染（实测：11:41 截图详情页只有播放资源行，无选集区；且 v1.0.2 链接
 *     发出仅 1 分钟，Arue 很可能还没来得及导，detailCacheDuration 30 还会
 *     让 Rex 继续用旧版详情）。v1.0.3 换成已经验证过的渲染路径：分集改成
 *     type: "url" 子项（和 XH Gay 的画质线同一机制，一定会出现在播放资源
 *     行里），videoUrl 直接是该集新鲜签名的 m3u8，点哪集播哪集。
 *   - 为拿每集 m3u8，loadDetail 利用滑动窗口并行拉分集页（ep-1 拿 1/2 集、
 *     ep-4 拿 3/4/5 集……每页 3 集，4 个并发），短剧一般 2~4 个请求；拿到
 *     的地址写进 Widget.storage（2 小时签名有效期，缓存按 100 分钟算），
 *     loadResource 先读缓存，省掉每次点播前 1.5~2 秒的详情页重拉。
 *   - detailCacheDuration 改 0：不再让 Rex 缓存旧版详情，改版后立即生效。
 *   - 提速实测（2026-11-21）：详情页 1.95 秒、m3u8 1.0~1.5 秒、首个分片
 *     1.3~3.2 秒，整站 CDN 约 10Mbps；换 tp1/tp2/tp5/tp7 分片域名都 200，
 *     速度同档，无明显更快的镜像。真正有效的提速就是 HEVC 默认（分片比
 *     HLS 小约 40%）+ 缓存去重拉。CDN 本身慢，模块改不动源站速度。
 * v1.0.2（2026-11-21，修 v1.0.1 实测问题）：
 *   - 分集还是没出现 + XH Gay 的 ❌ 卡还在（见下两条根因）。
 *   - 根因 1（XH 卡）：Rex 打开详情时，会把同一条链接发给全部已装模块的
 *     loadResource 各要一份线路。XH Gay 的 loadResource 对外站链接不拒绝，
 *     拿蓝果链接去 XH 站解析，解析不到就回一张“❌没解析到地址 · XH Gay”卡。
 *     直播模块同理（parseLink 会从蓝果链接里抠出 6 位数字当房间号）。
 *     修法在各模块自己身上：外站链接直接回 []（见 XH Gay v30、
 *     直播 v1.9.12）；本模块也一样，外站链接回 []，不回报错卡。
 *   - 根因 2（分集不出现）：多集剧的父项 mediaType 还是 "movie"，Rex 只给
 *     剧集（tv）项显示选集区。v1.0.2 多集剧父项和分集子项 mediaType 都改
 *     "tv"，并补 seasonNumber/episodeNumber；单集仍是 "movie"。
 *   - 其余不变：HEVC 默认首播，HLS 兜底；分集仍是 type: "detail" 的真实
 *     /video/{id}/ep-N/ 链接。
 * v1.0.1（2026-11-21，修 v1 实测问题）：
 *   - 和 XH Gay / 直播模块彻底分开：模块 ID 改为 user.languo2，子模块 ID
 *     改为 lg6-*，全部辅助函数/变量加 lg 前缀，不再用 lg:// 伪链接；
 *     v1 的分集用了 lg://ep/{id}/{n} 伪链接，Rex 只认 http(s) 地址，
 *     分集 childItems 被直接丢掉，详情页只剩“蓝果 + HLS/HEVC”三条线，
 *     看着就像别的模块在解析。v1.0.1 分集改成 type: "detail" 的真实条目，
 *     link 就是 /video/{id}/ep-N/，点开即是该集详情，可直接播、也可再切集。
 *   - 分集按参考图做：详情里每集一条卡片（第 N 集 · 共 M 集），点哪集播哪集，
 *     每集的播放地址都在打开该集时现取，不用旧签名。
 *   - 画质优先最高：同一集 HLS（h264）与 HEVC（hevc）实测都是 720x1280，
 *     HEVC 码率更低、画质更好，是本站最高画质；默认首播 HEVC（有的话），
 *     HLS 放第二条当兼容兜底。m3u8 本身是单档 media 清单，没有 1080p/4K 可切。
 *
 * 站点结构（2026-11-21 实测）：
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
 *   - 顶层 detailCacheDuration 设 0（v1.0.3 起），不缓存旧版详情。
 *   - loadResource 返回 [{ name, description, url }]
 *   - childItems 承载分集，每项 type: "detail"，link 为 /video/{id}/ep-N/，
 *     点分集即打开该集详情（loadDetail 现取该集的新签名 m3u8）。
 *   - 画质：HEVC（有的话）默认首播，HLS 第二；单集详情也一样。
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
  id: "user.languo6",
  title: "蓝果",
  description: "languo.ai 蓝果短剧 · 男同短剧 / 男同GV，分集现取签名播放地址",
  author: "Arue",
  version: "1.0.5",
  requiredVersion: "0.0.1",
  detailCacheDuration: 0,
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
      id: "lg6-home",
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
      id: "lg6-duanju",
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
      id: "lg6-gv",
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
      id: "lg6-hot",
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
      id: "lg6-rank",
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
      id: "lg6-tag-bear",
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
      id: "lg6-tag-suit",
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
      id: "lg6-tag-sm",
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
      id: "lg6-tag-fresh",
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
      id: "lg6-tag-ai",
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
      id: "lg6-resource",
      title: "蓝果播放资源",
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

// 分集预拉：只试一次，失败就跳过该页（不 5 次重试拖住详情页打开）
async function lgFetchOnce(url) {
  var data = await lgHttp(url);
  if (!data) throw new Error("空内容：" + url);
  return data;
}



// 单集时长：拉该集 m3u8，把 #EXTINF 秒数加起来；失败返回 0（不拖垮详情）
async function lgEpDuration(m3u8Url) {
  if (!m3u8Url) return 0;
  try {
    var txt = await lgHttp(m3u8Url);
    if (!txt) return 0;
    var total = 0;
    var re = /#EXTINF:([0-9]+(?:\.[0-9]+)?)/g;
    var m;
    while ((m = re.exec(txt)) !== null) { total += parseFloat(m[1]); }
    return Math.round(total);
  } catch (e) { return 0; }
}
function lgDurationText(sec) {
  if (!sec || sec <= 0) return "";
  return Math.round(sec / 60) + "分钟";
}

// 多集剧全部分集地址：当前页窗口 + 并行预拉其余分集页（4 并发、单次尝试），
// 结果写缓存。loadDetail 和 loadResource 共用。返回 { m3u8: {}, hevc: {} }。
async function lgFetchAllEps(id, playEp, srcs, srcsHevc, totalEps) {
  var allM3u8 = {};
  var allHevc = {};
  for (var sk in srcs) { if (srcs[sk]) allM3u8[sk] = srcs[sk]; }
  for (var hk in srcsHevc) { if (srcsHevc[hk]) allHevc[hk] = srcsHevc[hk]; }
  if (totalEps > 1) {
    var cached = {};
    for (var epn = 1; epn <= totalEps; epn++) {
      var c = lgCacheGet(id, epn);
      if (c && c.m) { cached[epn] = c; allM3u8[epn] = c.m; allHevc[epn] = c.h || ""; }
    }
    var pages = [];
    for (var pg = 1; pg <= totalEps; pg += 3) {
      if (pg === playEp || pg === playEp - 1 || pg === playEp + 1) continue; // 已有窗口
      var covered = true;
      for (var k = pg - 1; k <= pg + 1; k++) { if (k >= 1 && k <= totalEps && !cached[k]) { covered = false; break; } }
      if (!covered) pages.push(pg);
    }
    for (var bi = 0; bi < pages.length; bi += 4) {
      var batch = pages.slice(bi, bi + 4).map(function (n) {
        return lgFetchOnce(LG_BASE + "/video/" + id + "/ep-" + n + "/")
          .then(function (html2) {
            try {
              var d2 = parseInitialData(html2);
              if (!d2) return;
              for (var en in d2.epPlaySrcs) {
                var epNum = parseInt(en, 10);
                if (!allM3u8[epNum]) allM3u8[epNum] = d2.epPlaySrcs[en];
                if (!allHevc[epNum]) allHevc[epNum] = (d2.epPlaySrcsHevc && d2.epPlaySrcsHevc[en]) || "";
              }
            } catch (e) { console.log("[languo] 分集页解析失败 ep-" + n + ": " + String(e.message || e)); }
          })
          .catch(function (e) { console.log("[languo] 分集页拉取失败 ep-" + n + ": " + String(e.message || e)); });
      });
      await Promise.all(batch);
    }
    for (var epn2 = 1; epn2 <= totalEps; epn2++) {
      if (allM3u8[epn2]) lgCachePut(id, epn2, allM3u8[epn2], allHevc[epn2] || "");
    }
    lgTotalPut(id, totalEps);
  }
  return { m3u8: allM3u8, hevc: allHevc };
}

// 分集线路卡：每集一张，请求的那集排第一张；当前集有 HEVC 时末尾补 HLS 备用
function lgEpisodeLines(reqEp, totalEps, m3u8map, hevcmap) {
  var order = [reqEp];
  for (var n = 1; n <= totalEps; n++) { if (n !== reqEp) order.push(n); }
  var lines = [];
  order.forEach(function (en) {
    var u = lgBestUrl(m3u8map[en], hevcmap[en]);
    if (!u) return;
    lines.push({ name: "第 " + en + " 集", description: (hevcmap[en] ? "HEVC · 最高画质" : "HLS") + (en === reqEp ? " · 当前集" : ""), url: u });
  });
  if (hevcmap[reqEp] && m3u8map[reqEp]) {
    lines.push({ name: "HLS · 第 " + reqEp + " 集备用", description: "HEVC 播不动时切这张", url: m3u8map[reqEp] });
  }
  return lines;
}

// 总集数缓存（100 分钟），供 loadResource 先读缓存、免重拉
function lgTotalGet(id) {
  try {
    var raw = Widget.storage.get("lg5_total_" + id);
    if (!raw) return 0;
    var o = JSON.parse(raw);
    if (!o || !o.t || !o.ts || (Date.now() - o.ts) > LG_CACHE_TTL) return 0;
    return o.t;
  } catch (e) { return 0; }
}
function lgTotalPut(id, total) {
  try { Widget.storage.set("lg5_total_" + id, JSON.stringify({ t: total, ts: Date.now() })); } catch (e) {}
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
    id: "lg6-kw-" + keyword,
    type: "detail",
    mediaType: "movie",
    title: keyword,
    description: "搜索 · 共 " + items.length + " 条",
    link: "lg6://k/" + encoded,
    relatedItems: items,
  };
}


// ───────────── 分集地址缓存（Widget.storage，签名 2 小时有效，缓存按 100 分钟算） ─────────────
var LG_CACHE_TTL = 100 * 60 * 1000;
function lgCacheKey(id, ep) { return "lg4_ep_" + id + "_" + ep; }
function lgCacheGet(id, ep) {
  try {
    var raw = Widget.storage.get(lgCacheKey(id, ep));
    if (!raw) return null;
    var o = JSON.parse(raw);
    if (!o || !o.m || !o.t || (Date.now() - o.t) > LG_CACHE_TTL) return null;
    return o;
  } catch (e) { return null; }
}
function lgCachePut(id, ep, m3u8, hevc) {
  try { Widget.storage.set(lgCacheKey(id, ep), JSON.stringify({ m: m3u8 || "", h: hevc || "", t: Date.now() })); } catch (e) {}
}

// ───────────────────────── 详情 ─────────────────────────

function resolveLink(link) {
  var raw = String(link || "").trim();
  if (!raw) return "";
  if (raw.indexOf("lg6://k/") === 0) return "";
  if (/^https?:\/\//.test(raw)) return raw;
  if (raw.indexOf("/video/") === 0) return LG_BASE + raw;
  if (/^\d+$/.test(raw)) return LG_BASE + "/video/" + raw + "/";
  return "";
}

// 解析 /video/{id}/ep-{n}/ 或 /video/{id}/，返回 {id, ep}
function parseEpLink(link) {
  var raw = String(link || "").trim();
  var m2 = raw.match(/\/video\/(\d+)\/ep-(\d+)\//);
  if (m2) return { id: m2[1], ep: parseInt(m2[2], 10) };
  var m3 = raw.match(/\/video\/(\d+)\//);
  if (m3) return { id: m3[1], ep: 1 };
  return null;
}

// 画质优先最高：HEVC（有的话）默认首播，HLS 第二兜底。
// 实测同一集 HLS 与 HEVC 都是 720x1280，HEVC 码率更低、画质更好。
function lgBestUrl(m3u8, hevc) {
  return hevc || m3u8 || "";
}

async function loadDetail(link) {
  var raw = String(link || "").trim();

  // 关键词结果页
  if (raw.indexOf("lg6://k/") === 0) {
    var kw = decodeURIComponent(raw.replace("lg6://k/", ""));
    return await searchVideos({ keyword: kw, page: 1 });
  }

  // 分集伪链接：直接当第 N 集详情处理（现取该集签名地址）
  // 外站链接不是蓝果的：直接拒绝，不替别的模块解析
  if (/^https?:\/\//.test(raw) && raw.indexOf(LG_BASE) !== 0) {
    throw new Error("不是蓝果链接：" + raw.slice(0, 80));
  }
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

  var isSeries = p.totalEps > 1;
  var item = {
    id: p.id,
    type: "detail",
    mediaType: isSeries ? "tv" : "movie",
    title: p.title || ("视频 " + p.id),
    link: LG_BASE + "/video/" + p.id + "/",
    description: desc,
    overview: p.description,
    videoUrl: lgBestUrl(playM3u8, playHevc),
  };
  if (p.tags.length) item.genreTitle = p.tags.join(", ");

  // 多集剧：拉分集（并行预拉 + 缓存），预拉失败不影响详情返回
  var allM3u8 = {};
  var allHevc = {};
  allM3u8[playEp] = playM3u8;
  allHevc[playEp] = playHevc;
  if (p.totalEps > 1) {
    try {
      var fetched = await lgFetchAllEps(p.id, playEp, srcs, srcsHevc, p.totalEps);
      allM3u8 = fetched.m3u8;
      allHevc = fetched.hevc;
    } catch (e) { console.log("[languo] 分集预拉失败（仅当前集可用）：" + String(e.message || e)); }
  }

  // 分集做成 episodeItems（官方字段，见 v1.0.5 说明）：详情页的选集网格
  // 从这儿渲染。每集一个 VideoItem：季 1、第 N 集、分集页 link、新鲜
  // m3u8、剧封面当剧照、时长从播单算出来。站内没有单集标题/简介/剧照，
  // 标题只写第 N 集，简介留空。
  if (isSeries) {
    var epUrls = {};
    for (var n = 1; n <= p.totalEps; n++) { epUrls[n] = lgBestUrl(allM3u8[n], allHevc[n]); }
    var epDurs = {};
    var durJobs = [];
    for (var dn = 1; dn <= p.totalEps; dn++) {
      (function (epNum, u) {
        durJobs.push(lgEpDuration(u).then(function (sec) { epDurs[epNum] = sec; }));
      })(dn, epUrls[dn]);
    }
    await Promise.all(durJobs);
    var eps = [];
    for (var n = 1; n <= p.totalEps; n++) {
      var epItem = {
        id: p.id + "-ep" + n,
        type: "url",
        mediaType: "tv",
        title: "第 " + n + " 集",
        description: "",
        link: LG_BASE + "/video/" + p.id + "/ep-" + n + "/",
        season: 1,
        episode: n,
        seasonNumber: 1,
        episodeNumber: n,
        backdropPath: p.cover,
        coverUrl: p.cover,
        releaseDate: p.published || "",
      };
      if (epUrls[n]) epItem.videoUrl = epUrls[n];
      if (epDurs[n]) { epItem.duration = epDurs[n]; epItem.durationText = lgDurationText(epDurs[n]); }
      eps.push(withImages(epItem, p.cover));
    }
    item.episodeItems = eps;
  } else {
    // 单集：详情里给两条画质线，HEVC（最高）放前面，HLS 兜底
    var qLines = [];
    if (playHevc) qLines.push({ id: p.id + "-hevc", type: "url", mediaType: "movie", title: "HEVC", description: "最高画质 · HEVC", videoUrl: playHevc, link: playHevc });
    if (playM3u8) qLines.push({ id: p.id + "-hls", type: "url", mediaType: "movie", title: "HLS", description: "兼容", videoUrl: playM3u8, link: playM3u8 });
    if (qLines.length) item.childItems = qLines;
  }

  console.log("[languo] loadDetail id=" + p.id + " title=" + item.title + " eps=" + p.totalEps + " playEp=" + playEp + " m3u8=" + (playM3u8 ? "有" : "无"));
  return withImages(item, p.cover);
}

// ───────────────────────── 播放资源 ─────────────────────────

// 播放地址：m3u8 约 2 小时过期；loadDetail 刚拉过的用缓存（100 分钟内），否则现抓。
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

  // Rex 会把同一条链接发给全部模块的 loadResource：外站链接直接回 []，
  // 不回报错卡，否则别的模块详情页里会多一张蓝果的报错卡。
  if (/^https?:\/\//.test(link) && link.indexOf(LG_BASE) !== 0) return [];
  var epInfo = parseEpLink(link);
  if (!epInfo) return [];

  // 缓存优先：全集地址都在缓存里就直接出分集卡，不重拉页面
  var totCached = lgTotalGet(epInfo.id);
  if (totCached > 1) {
    var cm = {}, ch = {}, allOk = true;
    for (var ce = 1; ce <= totCached; ce++) {
      var cc = lgCacheGet(epInfo.id, ce);
      if (!cc || !cc.m) { allOk = false; break; }
      cm[ce] = cc.m; ch[ce] = cc.h || "";
    }
    if (allOk) return lgEpisodeLines(epInfo.ep, totCached, cm, ch);
  } else if (totCached === 1) {
    var single = lgCacheGet(epInfo.id, 1);
    if (single && single.m) {
      var sl = [];
      if (single.h) sl.push({ name: "HEVC", description: "最高画质", url: single.h });
      sl.push({ name: "HLS", description: single.h ? "备用" : "最高画质", url: single.m });
      return sl;
    }
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
  if (m3u8) lgCachePut(epInfo.id, epInfo.ep, m3u8, hevc || "");
  console.log("[languo] loadResource id=" + epInfo.id + " ep=" + epInfo.ep + " m3u8=" + (m3u8 ? "有" : "无") + " hevc=" + (hevc ? "有" : "无"));

  // 多集剧：分集直接做成线路卡（loadResource 的卡一定渲染，见 v1.0.4 说明），
  // 每集一张，点哪集播哪集；请求的那集排第一张
  var pp = null;
  try { pp = parseDetailPage(html, LG_BASE + "/video/" + epInfo.id + "/"); } catch (e) { pp = null; }
  var totalEps = (pp && pp.totalEps) || 1;
  if (totalEps > 1) {
    var fetched2 = await lgFetchAllEps(epInfo.id, epInfo.ep, srcs, srcsHevc, totalEps);
    var epLines = lgEpisodeLines(epInfo.ep, totalEps, fetched2.m3u8, fetched2.hevc);
    if (epLines.length) return epLines;
    // 兜底：分集都没拿到地址，退回单集两条线
  }

  var out = [];
  if (hevc) out.push({ name: "HEVC", description: "第 " + epInfo.ep + " 集 · 最高画质 · 现取签名地址", url: hevc });
  if (m3u8) out.push({ name: "HLS", description: "第 " + epInfo.ep + " 集 · 兼容", url: m3u8 });
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
