/**
 * xlivesex WebSocket 取证抓包（Playwright + Chromium）
 *
 * 用途：在新加坡服务器上用真实浏览器打开房间页，动态捕获：
 *   ① streamChanged@id 那一帧的完整消息原文（最高优先级）
 *   ② WebSocket 握手（URL、请求头、Cookie、Origin、Sec-WebSocket-Protocol、服务端状态、首批消息）
 *   ③ 全部 HTTP 请求/响应（按时间顺序，重点看 cam 接口和 m3u8）
 *
 * 敏感信息处理：Cookie / Token / 签名只写进本地日志文件，不输出到 stdout，
 * 日志文件留在服务器上，由人工取回分析，不上传、不公开。
 *
 * 用法：
 *   npm i playwright && npx playwright install chromium --with-deps
 *   node ws-capture.js [房间用户名] [持续秒数]
 *   例：node ws-capture.js RoboticPower7 60
 * 输出：/opt/xlive/ws-capture-<room>-<ts>.jsonl（每行一条事件，含时间戳）
 */

const fs = require("fs");
const path = require("path");

const ROOM = process.argv[2] || "RoboticPower7";
const SECONDS = Number(process.argv[3] || 60);
const OUT_DIR = process.env.OUT_DIR || "/opt/xlive";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.0 Safari/605.1.15";

const startedAt = new Date();
const stamp = startedAt.toISOString().replace(/[:.]/g, "-").slice(0, 19);
const outFile = path.join(OUT_DIR, `ws-capture-${ROOM}-${stamp}.jsonl`);
const out = fs.createWriteStream(outFile, { flags: "w" });

let seq = 0;
function log(kind, data) {
  const rec = {
    seq: ++seq,
    t: new Date().toISOString(),
    elapsedMs: Date.now() - startedAt.getTime(),
    kind,
    ...data,
  };
  out.write(JSON.stringify(rec) + "\n");
}

// 敏感字段脱敏（只保留前 6 + 后 4，中间打码），日志里不留完整凭证
function mask(v) {
  const s = String(v == null ? "" : v);
  if (s.length <= 12) return "***";
  return s.slice(0, 6) + "…" + s.slice(-4) + ` (len=${s.length})`;
}
function maskHeaders(h) {
  const out = {};
  for (const [k, v] of Object.entries(h || {})) {
    const lk = k.toLowerCase();
    if (lk === "cookie" || lk === "authorization" || lk === "sec-websocket-protocol" || lk.includes("token")) {
      out[k] = mask(v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

(async () => {
  const { chromium } = require("playwright");
  log("meta", { room: ROOM, seconds: SECONDS, ua: UA, outFile });

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const ctx = await browser.newContext({ userAgent: UA });
  const page = await ctx.newPage();

  // ── HTTP 请求/响应 ──
  page.on("request", (req) => {
    const url = req.url();
    // 只记关键请求：cam 接口、m3u8、websocket 握手、api；静态资源只记 URL 不记头
    const interesting =
      url.includes("/cam") || url.includes(".m3u8") || url.includes("/api/") ||
      url.includes("websocket") || url.includes("centrifugo");
    log("request", {
      url: url.slice(0, 500),
      method: req.method(),
      resourceType: req.resourceType(),
      headers: interesting ? maskHeaders(req.headers()) : undefined,
    });
  });
  page.on("response", async (res) => {
    const url = res.url();
    const interesting =
      url.includes("/cam") || url.includes(".m3u8") || url.includes("/api/") ||
      url.includes("websocket") || url.includes("centrifugo");
    let bodySnippet;
    if (interesting && url.includes("/cam")) {
      try {
        const text = await res.text();
        bodySnippet = text.slice(0, 3000); // cam 响应全文（不含凭证，是房间元数据）
      } catch (_) {}
    }
    if (interesting && url.includes(".m3u8")) {
      try {
        const text = await res.text();
        bodySnippet = text.slice(0, 2000); // m3u8 全文
      } catch (_) {}
    }
    log("response", {
      url: url.slice(0, 500),
      status: res.status(),
      headers: interesting ? maskHeaders(res.headers()) : undefined,
      bodySnippet,
    });
  });

  // ── WebSocket ──
  page.on("websocket", (ws) => {
    log("ws-open", { url: ws.url() });
    ws.on("framesent", (frame) => {
      const payload = frame.payload || "";
      log("ws-sent", {
        url: ws.url(),
        opcode: frame.opcode,
        payload: payload.slice(0, 4000),
      });
    });
    ws.on("framereceived", (frame) => {
      const payload = frame.payload || "";
      // streamChanged 相关帧单独标记、全文记录（最高优先级证据）
      const isStreamChanged =
        payload.includes("streamChanged") || payload.includes("streamStatusChanged");
      log("ws-received", {
        url: ws.url(),
        opcode: frame.opcode,
        isStreamChanged,
        payload: payload.slice(0, 8000),
      });
    });
    ws.on("close", () => log("ws-close", { url: ws.url() }));
    ws.on("socketerror", (e) => log("ws-error", { url: ws.url(), error: String(e && e.message || e).slice(0, 300) }));
  });

  // ── 打开房间页 ──
  const roomUrl = `https://zh.xlivesex.com/${ROOM}`;
  log("navigate", { url: roomUrl });
  try {
    await page.goto(roomUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  } catch (e) {
    log("navigate-error", { error: String(e && e.message || e).slice(0, 300) });
  }

  // 等页面跑起来（WS 建连、订阅、推流状态），期间持续收帧
  await page.waitForTimeout(SECONDS * 1000);

  // 收尾：把当前页面的 websocket url/token 配置也记一笔（如果页面里能读到）
  try {
    const wsCfg = await page.evaluate(() => {
      const st = window.__PRELOADED_STATE__ || {};
      const ic = (st.configV3 && st.configV3.initialClient) || {};
      const ws = ic.websocket || {};
      return {
        websocketUrl: (ws.url || "").slice(0, 120),
        hasToken: Boolean(ws.token),
        tokenLen: (ws.token || "").length,
        websocketAppsUrl: ((ic.websocketApps || {}).url || "").slice(0, 120),
      };
    });
    log("page-ws-config", wsCfg);
  } catch (_) {}

  await browser.close();
  out.end();
  console.log(`DONE ${outFile} (${seq} events, ${SECONDS}s)`);
})().catch((e) => {
  log("fatal", { error: String(e && e.stack || e).slice(0, 1000) });
  out.end();
  console.error("FATAL", e && e.message || e);
  process.exit(1);
});
