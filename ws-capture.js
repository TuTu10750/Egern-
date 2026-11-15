/**
 * xlivesex WebSocket 取证抓包 v2（Playwright + Chromium）
 *
 * v1 教训（2026-11-15 13:02 抓包，60 秒，760 事件，streamChanged=0）：
 *   - WS 只连上了握手 + 两次空帧心跳（ping 25s），客户端 60 秒内从未订阅任何频道
 *     → streamChanged 不是“没有”，是根本没订阅，所以收不到。
 *   - 页面从未调 /api/front/v2/models/{id}/cam（日志里只有 camera-3.json 图标）
 *   - master 播放列表被请求 97 次却 0 条响应（疑似播放器在失败重试循环）
 *   - page-ws-config 显示 __PRELOADED_STATE__ 里 websocketUrl/token 全空，
 *     但 WS 实际连上了（token 是 JWT，运行时从别处拿到的）
 *   所以 v1 只是“打开页面等着”，播放器根本没启动。
 *
 * v2.1（2026-11-15 13:26，按 Arue 的第二轮动态取证要求补强）：
 *   证据链 E01 订阅：WS 双向帧全文记录（JWT 已脱敏），点播放后是否出现 subscribe；
 *   证据链 E02 JWT 来源：收尾汇总 api-summary（逐条 /api/ 的方法 + 状态码），
 *     响应体含 eyJ 时记 jwt-in-response；
 *   证据链 E03 pkey 来源：响应体含 pkey 时记 pkey-in-response（带上下文片段）；
 *   证据链 E04 播放器状态：player-state 增加 video.error，新增 pageerror、
 *     requestfailed 日志；严格区分 请求发出 / HTTP 响应 / 状态码 / 响应正文。
 *   保护要求：不伪造任何凭证；v1 日志不动；v2 用独立输出目录（OUT_DIR）；
 *     JWT/Cookie 在日志里脱敏，pkey 原文只留在服务端日志里、对外报告脱敏。
 *
 * 敏感信息处理：Cookie / Token / 签名只写进本地日志文件，不输出到 stdout，
 * 日志文件留在服务器上，由人工取回分析，不上传、不公开。
 *
 * 用法：
 *   node ws-capture.js [房间用户名] [持续秒数]
 *   例：node ws-capture.js RoboticPower7 120
 * 输出：/opt/xlive/ws-capture-<room>-<ts>.jsonl（每行一条事件，含时间戳）
 */

const fs = require("fs");
const path = require("path");

const ROOM = process.argv[2] || "RoboticPower7";
const SECONDS = Number(process.argv[3] || 120);
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
    if (lk === "cookie" || lk === "authorization" || lk.includes("token")) {
      out[k] = mask(v);
    } else {
      out[k] = v;
    }
  }
  return out;
}
// WS 帧里的 JWT 做脱敏（日志里不留完整凭证；pkey 保留原文在服务端日志里以便追溯来源，对外报告再脱敏）
function maskJwt(s) {
  return String(s || "").replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, (m) => mask(m));
}

(async () => {
  const { chromium } = require("playwright");
  log("meta", { room: ROOM, seconds: SECONDS, ua: UA, outFile, scriptVersion: "v2" });

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const ctx = await browser.newContext({ userAgent: UA });
  const page = await ctx.newPage();

  const apiUrls = new Set();
  const apiSummary = new Map(); // url -> {method, status}，用于 E02：逐条 /api/ 的方法 + 状态码

  // ── HTTP 请求/响应/失败 ──
  page.on("request", (req) => {
    const url = req.url();
    if (url.includes("/api/")) {
      apiUrls.add(url.slice(0, 300));
      if (!apiSummary.has(url)) apiSummary.set(url, { method: req.method(), status: null });
    }
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
    if (url.includes("/api/") && apiSummary.has(url)) {
      apiSummary.get(url).status = res.status();
    }
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
    // E02/E03：/api/ 响应里是否出现 pkey 或 JWT（追踪凭证来源）
    if (url.includes("/api/")) {
      try {
        const text = await res.text();
        const pIdx = text.toLowerCase().indexOf("pkey");
        if (pIdx >= 0) {
          log("pkey-in-response", {
            url: url.slice(0, 300),
            status: res.status(),
            snippet: text.slice(Math.max(0, pIdx - 100), pIdx + 300),
          });
        }
        const jIdx = text.indexOf("eyJ");
        if (jIdx >= 0) {
          log("jwt-in-response", {
            url: url.slice(0, 300),
            status: res.status(),
            snippet: maskJwt(text.slice(Math.max(0, jIdx - 100), jIdx + 300)),
          });
        }
      } catch (_) {}
    }
    log("response", {
      url: url.slice(0, 500),
      status: res.status(),
      headers: interesting ? maskHeaders(res.headers()) : undefined,
      bodySnippet,
    });
  });
  page.on("requestfailed", (req) => {
    log("requestfailed", {
      url: req.url().slice(0, 500),
      method: req.method(),
      resourceType: req.resourceType(),
      failure: String((req.failure() && req.failure().errorText) || "").slice(0, 200),
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
        payload: maskJwt(payload).slice(0, 4000),
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
        payload: maskJwt(payload).slice(0, 8000),
      });
    });
    ws.on("close", () => log("ws-close", { url: ws.url() }));
    ws.on("socketerror", (e) => log("ws-error", { url: ws.url(), error: String(e && e.message || e).slice(0, 300) }));
  });

  // ── 页面错误 ──
  page.on("pageerror", (e) => {
    log("pageerror", { error: String(e && e.message || e).slice(0, 300) });
  });

  // ── 播放器状态探针 ──
  async function probePlayer(tag) {
    try {
      const st = await page.evaluate(() => {
        const vs = Array.from(document.querySelectorAll("video"));
        return {
          videoCount: vs.length,
          videos: vs.slice(0, 3).map((v) => ({
            paused: v.paused,
            currentTime: Number(v.currentTime.toFixed(2)),
            readyState: v.readyState,
            error: v.error ? { code: v.error.code, message: (v.error.message || "").slice(0, 200) } : null,
            src: (v.currentSrc || v.src || "").slice(0, 160),
            videoWidth: v.videoWidth,
            videoHeight: v.videoHeight,
          })),
          bodyTextHasLive: /LIVE/.test(document.body.innerText || ""),
        };
      });
      log("player-state", { tag, ...st });
      return st;
    } catch (e) {
      log("player-state", { tag, error: String(e && e.message || e).slice(0, 200) });
      return null;
    }
  }

  // ── 打开房间页 ──
  const roomUrl = `https://zh.xlivesex.com/${ROOM}`;
  log("navigate", { url: roomUrl });
  try {
    await page.goto(roomUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  } catch (e) {
    log("navigate-error", { error: String(e && e.message || e).slice(0, 300) });
  }

  // 等页面跑起来
  await page.waitForTimeout(8000);
  await probePlayer("before-click");

  // ── v2 关键：主动点播放 ──
  const clickCandidates = [
    "video",
    '[class*="play" i][class*="button" i]',
    'button[aria-label*="play" i]',
    '[class*="BigPlay" i]',
    '[class*="big-play" i]',
    '[class*="player" i] [class*="play" i]',
  ];
  for (const sel of clickCandidates) {
    try {
      const el = await page.$(sel);
      if (!el) {
        log("click-attempt", { selector: sel, result: "not-found" });
        continue;
      }
      await el.click({ timeout: 5000 });
      log("click-attempt", { selector: sel, result: "clicked" });
      await page.waitForTimeout(3000);
      const st = await probePlayer("after-click:" + sel);
      // 只要有 video 在播（!paused 且 currentTime 在走），就停，不再乱点
      if (st && st.videos && st.videos.some((v) => !v.paused && v.currentTime > 0)) {
        log("click-attempt", { selector: sel, result: "playing-stop" });
        break;
      }
    } catch (e) {
      log("click-attempt", { selector: sel, result: "error", error: String(e && e.message || e).slice(0, 200) });
    }
  }

  // 持续收帧
  const remaining = Math.max(10, SECONDS - 20);
  await page.waitForTimeout(remaining * 1000);
  await probePlayer("end");

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

  // 收尾：汇总去重后的 /api/ 请求 URL（找 token / pkey 来源）
  log("api-urls", { count: apiUrls.size, urls: Array.from(apiUrls).slice(0, 200) });
  // 收尾：逐条 /api/ 的方法 + 状态码（E02 完整证据）
  log("api-summary", {
    count: apiSummary.size,
    entries: Array.from(apiSummary.entries()).map(([u, v]) => ({ method: v.method, status: v.status, url: u.slice(0, 300) })),
  });

  await browser.close();
  out.end();
  console.log(`DONE ${outFile} (${seq} events, ${SECONDS}s)`);
})().catch((e) => {
  log("fatal", { error: String(e && e.stack || e).slice(0, 1000) });
  out.end();
  console.error("FATAL", e && e.message || e);
  process.exit(1);
});
