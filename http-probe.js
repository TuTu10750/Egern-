/**
 * Rex 探针模块：Widget.http 能力检测
 *
 * 用途：测 Widget.http 到底支不支持 A 方案要用的三件事：
 *   1. 自定义请求头（Referer / Origin / User-Agent）
 *   2. Cookie（有没有 cookie jar、能不能手动带 Cookie）
 *   3. 响应体上限（m3u8 只有几 KB，但 JSON 接口别被截断）
 *
 * 回显用 https://httpbin.org（公开回显服务）：
 *   /headers          返回收到的请求头
 *   /cookies/set/x/y  Set-Cookie 后 302 跳到 /cookies
 *   /cookies          返回收到的 Cookie
 *   /bytes/N          返回 N 字节
 *
 * 结构照抄 net-probe.js（已验证能导入）：
 *   WidgetMetadata 普通赋值、modules 在里面、顶层 search、
 *   functionName 是字符串、params 是数组、一个 stream 模块 + 一个列表模块。
 * 打开「探针结果」列表就跑检测，结果一行一条。
 */

WidgetMetadata = {
  id: "user.httpprobe1",
  title: "HTTP 探针",
  description: "检测 Widget.http 的自定义头、Cookie、响应上限",
  author: "YG",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 0,
  site: "https://httpbin.org",
  iconurl: "https://httpbin.org/favicon.ico",

  search: {
    title: "搜索",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "" },
    ],
  },

  modules: [
    {
      id: "probe-resource",
      title: "播放资源",
      description: "探针模块不需要播放",
      requiresWebView: false,
      cacheDuration: 0,
      functionName: "loadResource",
      type: "stream",
      params: [
        { name: "link", title: "链接", type: "input", value: "" },
        { name: "title", title: "标题", type: "input", value: "" },
      ],
    },
    {
      id: "probe-list",
      title: "探针结果",
      description: "Widget.http 能力检测结果（打开即跑）",
      requiresWebView: false,
      cacheDuration: 0,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "probe" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
  ],
};

// ───────────────────────── 工具 ─────────────────────────

function getData(resp) {
  var d = resp && resp.data !== undefined ? resp.data : resp;
  if (typeof d === "string") {
    try { d = JSON.parse(d); } catch (e) { /* 不是 JSON 就原样留着 */ }
  }
  return d;
}

function shortStr(v, n) {
  var s = String(v === undefined || v === null ? "" : v);
  return s.length > (n || 80) ? s.slice(0, n || 80) + "…" : s;
}

// ───────────────────────── 检测 ─────────────────────────

async function runProbe() {
  var rows = [];
  var HB = "https://httpbin.org";

  // 1. 默认请求头：不传任何自定义头，看 Widget.http 默认发什么
  try {
    var r1 = await Widget.http.get(HB + "/headers", { allow_redirects: true });
    var d1 = getData(r1);
    var h1 = (d1 && d1.headers) || {};
    rows.push({
      name: "默认请求头",
      result: "UA=" + shortStr(h1["User-Agent"] || h1["user-agent"] || "(无)", 40)
        + " | Referer=" + shortStr(h1["Referer"] || h1["referer"] || "(无)", 40)
        + " | Accept=" + shortStr(h1["Accept"] || h1["accept"] || "(无)", 30),
    });
  } catch (e) {
    rows.push({ name: "默认请求头", result: "❌ 请求失败：" + shortStr(e && e.message || e) });
  }

  // 2. 自定义请求头：看 X-Probe-Test / Referer / User-Agent 能不能发出去
  try {
    var r2 = await Widget.http.get(HB + "/headers", {
      allow_redirects: true,
      headers: {
        "X-Probe-Test": "hello123",
        "Referer": "https://zh.xlivesex.com/",
        "User-Agent": "ProbeUA/1.0",
      },
    });
    var d2 = getData(r2);
    var h2 = (d2 && d2.headers) || {};
    var gotProbe = h2["X-Probe-Test"] || h2["x-probe-test"] || "";
    var gotRef = h2["Referer"] || h2["referer"] || "";
    var gotUA = h2["User-Agent"] || h2["user-agent"] || "";
    rows.push({
      name: "自定义请求头",
      result: "X-Probe-Test=" + (gotProbe === "hello123" ? "✅ 发出去了" : "❌ 没发出（收到：" + shortStr(gotProbe || "(无)") + "）")
        + " | Referer=" + (gotRef === "https://zh.xlivesex.com/" ? "✅ 发出去了" : "❌ 没发出（收到：" + shortStr(gotRef || "(无)") + "）")
        + " | UA=" + (gotUA === "ProbeUA/1.0" ? "✅ 发出去了" : "❌ 没发出（收到：" + shortStr(gotUA) + "）"),
    });
  } catch (e) {
    rows.push({ name: "自定义请求头", result: "❌ 请求失败：" + shortStr(e && e.message || e) });
  }

  // 3. Cookie jar：先调 /cookies/set 让服务器 Set-Cookie，再调 /cookies 看会不会自动带上
  try {
    await Widget.http.get(HB + "/cookies/set/probe_cookie/test123", { allow_redirects: true });
    var r3 = await Widget.http.get(HB + "/cookies", { allow_redirects: true });
    var d3 = getData(r3);
    var c3 = (d3 && d3.cookies) || {};
    rows.push({
      name: "Cookie 自动带（jar）",
      result: c3["probe_cookie"] === "test123"
        ? "✅ 自动带上了（有 cookie jar）"
        : "❌ 没带上（收到 cookies：" + shortStr(JSON.stringify(c3)) + "）",
    });
  } catch (e) {
    rows.push({ name: "Cookie 自动带（jar）", result: "❌ 请求失败：" + shortStr(e && e.message || e) });
  }

  // 4. 手动 Cookie：直接在 headers 里塞 Cookie，看发不发得出去
  try {
    var r4 = await Widget.http.get(HB + "/cookies", {
      allow_redirects: true,
      headers: { "Cookie": "manual_cookie=abc456" },
    });
    var d4 = getData(r4);
    var c4 = (d4 && d4.cookies) || {};
    rows.push({
      name: "手动带 Cookie",
      result: c4["manual_cookie"] === "abc456"
        ? "✅ 发出去了"
        : "❌ 没发出（收到 cookies：" + shortStr(JSON.stringify(c4)) + "）",
    });
  } catch (e) {
    rows.push({ name: "手动带 Cookie", result: "❌ 请求失败：" + shortStr(e && e.message || e) });
  }

  // 5. 响应体上限：10KB / 100KB / 500KB / 1MB，看多大开始失败或截断
  var sizes = [10000, 100000, 500000, 1000000];
  for (var i = 0; i < sizes.length; i++) {
    var n = sizes[i];
    try {
      var rb = await Widget.http.get(HB + "/bytes/" + n, { allow_redirects: true });
      var db = getData(rb);
      var gotLen = 0;
      if (typeof db === "string") gotLen = db.length;
      else if (db && db.data !== undefined) gotLen = String(db.data).length;
      else if (rb && typeof rb === "string") gotLen = rb.length;
      // /bytes 返回的是原始字节，data 可能是字符串或被包了一层；按实际拿到手的长度算
      if (gotLen === 0 && rb) {
        try { gotLen = JSON.stringify(rb).length; } catch (e) {}
      }
      rows.push({
        name: "响应 " + (n / 1000) + "KB",
        result: gotLen >= n * 0.9
          ? "✅ 拿到 " + gotLen + " 字节"
          : "⚠️ 只拿到 " + gotLen + " 字节（要 " + n + "）",
      });
    } catch (e) {
      rows.push({ name: "响应 " + (n / 1000) + "KB", result: "❌ 失败：" + shortStr(e && e.message || e) });
    }
  }

  return rows;
}

// ───────────────────────── 列表 ─────────────────────────

async function loadList(params) {
  console.log("[httpprobe] loadList start");
  var rows = await runProbe();
  var items = [];
  for (var i = 0; i < rows.length; i++) {
    items.push({
      id: "probe-" + i,
      type: "detail",
      mediaType: "movie",
      title: rows[i].name,
      link: "probe://result/" + i,
      description: rows[i].result,
    });
  }
  console.log("[httpprobe] loadList -> " + items.length + " 条");
  return items;
}

// ───────────────────────── 搜索 ─────────────────────────

async function searchVideos(params) {
  return [];
}

// ───────────────────────── 详情 / 播放 ─────────────────────────

async function loadDetail(link) {
  return {
    id: "probe",
    type: "detail",
    mediaType: "movie",
    title: "HTTP 探针",
    link: String(link || ""),
    description: "探针模块不需要播放",
  };
}

async function loadResource(params) {
  return [{
    name: "探针模块不需要播放",
    description: "请打开「探针结果」列表看检测结果",
    url: "",
  }];
}

// 兼容别名
var getDetail = loadDetail;
var loadResources = loadResource;
var stream = loadResource;
var mediaHook = loadResource;
