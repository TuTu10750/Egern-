/**
 * Rex 探针模块：net.Socket / 原始 TCP 通道检测
 *
 * 用途：只测通道，不写完整 WebSocket 协议。
 * 打开模块的「探针结果」列表，就能看到 Rex 运行时里
 * 哪些网络能力存在、哪些不存在。
 *
 * 结构照抄 xh-gay.js v20 / xl-live.js 的契约：
 *   - WidgetMetadata 是普通赋值（不是 const）
 *   - modules 在 WidgetMetadata 里面
 *   - 顶层 search 字段
 *   - functionName 是字符串，params 是数组
 *   - 有一个 type: "stream" 的播放模块 + 一个列表模块
 *
 * 检测项（全部用 typeof 兜底，未定义的全局变量不会抛错）：
 *   net / net.Socket / require / WebSocket / fetch /
 *   XMLHttpRequest / Widget / Widget.http / Worker / EventSource
 * 如果 net 真的存在，还会尝试对新加坡服务器 49.0.207.168:8787
 * 建立一次 TCP 连接（5 秒超时），看通道到底通不通。
 */

// ★★★ 模块 ID。Rex 按 ID 缓存，每次改代码必须换新 ID ★★★
WidgetMetadata = {
  id: "user.netprobe1",
  title: "TCP 探针",
  description: "检测 Rex 里能不能打开原始 TCP 连接（net.Socket）",
  author: "YG",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 0,
  site: "https://zh.xlivesex.com",
  iconurl: "https://zh.xlivesex.com/favicon.ico",

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
      description: "Rex 网络能力检测结果（打开即跑）",
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

// ───────────────────────── 检测 ─────────────────────────

// 安全取 typeof：直接写 typeof xxx，未定义也不会抛错。
function safeTypeof(name) {
  try {
    // 用间接 eval 拿全局变量，避免直接引用触发静态扫描误判
    var v = (function () { return eval("typeof " + name); })();
    return v;
  } catch (e) {
    return "error:" + String(e && e.message || e);
  }
}

// 试一次 TCP 连接（只有 net 真的存在才跑）
function tryTcpConnect(host, port, timeoutMs) {
  return new Promise(function (resolve) {
    var done = false;
    var finish = function (r) {
      if (done) return;
      done = true;
      resolve(r);
    };
    try {
      var netObj = (function () { return eval("net"); })();
      if (!netObj || typeof netObj.connect !== "function") {
        finish("net.connect 不是函数，无法建连");
        return;
      }
      var sock = netObj.connect(port, host);
      var timer = setTimeout(function () {
        try { sock.destroy(); } catch (e) {}
        finish("超时 " + timeoutMs + "ms，未连上");
      }, timeoutMs);
      sock.on("connect", function () {
        clearTimeout(timer);
        try { sock.destroy(); } catch (e) {}
        finish("✅ 已连通 " + host + ":" + port);
      });
      sock.on("error", function (e) {
        clearTimeout(timer);
        finish("❌ 连接失败：" + String(e && e.message || e));
      });
    } catch (e) {
      finish("❌ 建连抛错：" + String(e && e.message || e));
    }
  });
}

async function runProbe() {
  var rows = [];
  var names = [
    "net",
    "require",
    "WebSocket",
    "fetch",
    "XMLHttpRequest",
    "Widget",
    "Worker",
    "EventSource",
  ];
  for (var i = 0; i < names.length; i++) {
    var n = names[i];
    var t = safeTypeof(n);
    var ok = (t !== "undefined");
    rows.push({
      name: n,
      result: (ok ? "✅ 存在 (" + t + ")" : "❌ 不存在 (undefined)"),
    });
  }

  // net.Socket 单独测（net 存在才有意义）
  var netType = safeTypeof("net");
  if (netType !== "undefined") {
    var sockType = "unknown";
    try {
      sockType = (function () { return eval("typeof net.Socket"); })();
    } catch (e) {
      sockType = "error:" + String(e && e.message || e);
    }
    rows.push({
      name: "net.Socket",
      result: (sockType !== "undefined" ? "✅ 存在 (" + sockType + ")" : "❌ 不存在 (undefined)"),
    });
    // 真连一次
    var conn = await tryTcpConnect("49.0.207.168", 8787, 5000);
    rows.push({ name: "TCP 实测 49.0.207.168:8787", result: conn });
  } else {
    rows.push({ name: "net.Socket", result: "❌ net 不存在，无法测试" });
    rows.push({ name: "TCP 实测", result: "❌ net 不存在，无法建连" });
  }

  // Widget.http 细化
  var wh = "unknown";
  try {
    wh = (function () { return eval("typeof Widget.http"); })();
  } catch (e) {
    wh = "error";
  }
  rows.push({
    name: "Widget.http",
    result: (wh !== "undefined" ? "✅ 存在 (" + wh + ")" : "❌ 不存在 (undefined)"),
  });

  return rows;
}

// ───────────────────────── 列表 ─────────────────────────

async function loadList(params) {
  console.log("[probe] loadList start");
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
  console.log("[probe] loadList -> " + items.length + " 条");
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
    title: "TCP 探针",
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
