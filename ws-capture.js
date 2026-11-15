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
 * v2 改动：
 *   1. 进房后主动点播放：依次尝试点 video 元素、大播放按钮等候选选择器，
 *      每一步记日志；随后复查 video 状态（paused/currentTime/readyState/src）。
 *   2. 新增 requestfailed 日志：解释 master 请求有去无回的原因。
 *   3. 收尾汇总所有 /api/ 请求 URL（去重）：追踪 WS token 和 master pkey 的来源。
 *   4. 默认时长改为 120 秒。
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

  // ── HTTP 请求/响应/失败 ──
  page.on("request", (req) => {
    const url = req.url();
    if (url.includes("/api/")) apiUrls.add(url.slice(0, 300));
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

  await browser.close();
  out.end();
  console.log(`DONE ${outFile} (${seq} events, ${SECONDS}s)`);
})().catch((e) => {
  log("fatal", { error: String(e && e.stack || e).slice(0, 1000) });
  out.end();
  console.error("FATAL", e && e.message || e);
  process.exit(1);
});
