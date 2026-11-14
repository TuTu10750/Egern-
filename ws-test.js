/**
 * Rex 测试模块：WebSocket 可用性测试
 * 用途：检查 Rex 的 Widget 运行环境里有没有 WebSocket，以及能不能连上
 * 用法：导进 Rex，打开「WS 测试」这个分类，看列表里的结果
 */

// ★★★ 模块 ID。Rex 按 ID 缓存，每次改代码必须换新 ID ★★★
WidgetMetadata = {
  id: "user.wstest2",
  title: "WS 测试",
  description: "测试 Rex 里 WebSocket 是否可用",
  author: "YG",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 0,
  site: "https://zh.xlivesex.com",
  iconurl: "https://zh.xlivesex.com/favicon.ico",

  search: {
    title: "搜索测试",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "" },
    ],
  },

  modules: [
    {
      id: "ws-test-list",
      title: "测试结果",
      type: "list",
      requiresWebView: false,
      cacheDuration: 0,
      loadList: loadList,
      params: { kind: "test", page: 1 }
    }
  ]
};

// 测试一个 WebSocket 地址能不能连上（5 秒超时）
function testWsConnect(url) {
  return new Promise((resolve) => {
    try {
      const ws = new WebSocket(url);
      const timer = setTimeout(() => {
        try { ws.close(); } catch (e) {}
        resolve("超时（5s 内没连上）");
      }, 5000);
      ws.onopen = () => {
        clearTimeout(timer);
        try { ws.close(); } catch (e) {}
        resolve("能连上 ✅");
      };
      ws.onerror = () => {
        clearTimeout(timer);
        resolve("连不上 ❌（onerror）");
      };
      ws.onclose = () => {
        clearTimeout(timer);
        resolve("连上后立即断开（可能需要协议握手）");
      };
    } catch (e) {
      resolve("创建失败 ❌：" + (e && e.message ? e.message : String(e)));
    }
  });
}

async function loadList(params) {
  const items = [];
  const add = (title, desc) => {
    items.push({
      id: "ws-test-" + items.length,
      title: title,
      type: "detail",
      mediaType: "movie",
      link: "ws-test://" + items.length,
      description: desc,
      duration: 0,
      durationText: ""
    });
  };

  // 1. 检查 WebSocket 是否存在
  let wsType = "未知";
  try { wsType = typeof WebSocket; } catch (e) { wsType = "检查时报错：" + e.message; }
  add("1. WebSocket 类型：" + wsType, wsType === "function" ? "环境里有 WebSocket，可以继续往下测" : "环境里没有 WebSocket，直连这条路走不通");

  // 2. 检查 fetch 是否存在
  let fetchType = "未知";
  try { fetchType = typeof fetch; } catch (e) { fetchType = "检查时报错：" + e.message; }
  add("2. fetch 类型：" + fetchType, "对照用：Rex 用的是 Widget.http");

  // 3. 检查 Widget.http
  let httpType = "未知";
  try { httpType = typeof (Widget && Widget.http); } catch (e) { httpType = "检查时报错：" + e.message; }
  add("3. Widget.http 类型：" + httpType, "这个是 Rex 提供的 HTTP 接口，正常应该有");

  // 4. 如果有 WebSocket，实际连一个公开回声服务试试
  if (wsType === "function") {
    const r1 = await testWsConnect("wss://echo.websocket.events");
    add("4. 连公开回声 WS：" + r1, "wss://echo.websocket.events");
    const r2 = await testWsConnect("wss://websocket-sp-v6.stripchat.com/connection/websocket");
    add("5. 连 Stripchat WS：" + r2, "wss://websocket-sp-v6.stripchat.com/connection/websocket（网站用的那个）");
  } else {
    add("4. 连公开回声 WS：跳过", "没有 WebSocket，无法测试连接");
    add("5. 连 Stripchat WS：跳过", "没有 WebSocket，无法测试连接");
  }

  return items;
}

async function loadDetail(link) {
  return { title: "WS 测试", description: "看列表里的结果" };
}

async function searchVideos(params) {
  return [];
}

function loadResource(params) { return []; }

var getDetail = loadDetail;
var loadResources = loadResource;
var stream = loadResource;
var mediaHook = loadResource;
