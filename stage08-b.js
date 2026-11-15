/**
 * 阶段08 任务 B：主房间 WebSocket 合法会话连接及频道订阅验证
 *
 * 仅在任务 A 完成后执行。本脚本只做连接与订阅验证，不做播放、不伪造凭证。
 *
 * 流程：
 *   1. 从 v2 日志里取 initial-dynamic 的完整 URL（不猜 host），用 Node 直接请求，
 *      取主 WS 地址与 token（websocket 字段；websocketApps 是另一路，不混用）。
 *      token 只存受限文件 .main-ws-token（0600），不进报告、不上 GitHub。
 *      若取不到 token，记录后停止，绝不改用 extensions WS 的 token。
 *   2. Playwright 打开房间页（与真实会话相同的 Origin/Cookie 环境），在页面里用
 *      原生 WebSocket 连主 WS：先 connect（centrifuge-js 格式），等 ack；
 *      成功后按静态代码确认的订阅定义订阅 streamChanged@109870623，
 *      再按同一 {类型}@{id} 结构订阅 streamStatusChanged@109870623
 *      （依据：bootstrap.js 事件类型映射 + models 可恢复频道列表含 streamStatusChanged；
 *      两个订阅分别记录服务端确认/拒绝，不猜测其他频道、不枚举）。
 *   3. 收集 60 秒内所有帧；记录订阅确认、拒绝原因、协议错误、是否收到 publication。
 *
 * 输出（全部在 OUT_DIR，默认 /opt/xlive/stage08）：
 *   .main-ws-token           主 WS token 原文（0600 受限文件，不进报告）
 *   B01_connection_metadata.json  连接目标、token 长度与脱敏值、来源接口、频道清单
 *   B02_ws_sent.jsonl            发送帧（token 已脱敏）
 *   B03_ws_received.jsonl        接收帧
 *   B04_subscription_result.json 每频道订阅结果 + 收到的 publication
 *   B05_B_Acceptance_Report.md   验收报告：握手、connect、订阅、publication（事实与推断分开）
 *
 * 保护：不伪造凭证；不修改 v1/v2 日志、8787 服务、Xray/VPN；失败时停止、不无限重试。
 *
 * 用法：node stage08-b.js [房间用户名] [房间 id]   例：node stage08-b.js RoboticPower7 109870623
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const https = require("https");

const ROOM = process.argv[2] || "RoboticPower7";
const MODEL_ID = process.argv[3] || "109870623";
const OUT_DIR = process.env.OUT_DIR || "/opt/xlive/stage08";
const V2_DIR = process.env.V2_DIR || "/opt/xlive/v2";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.0 Safari/605.1.15";

fs.mkdirSync(OUT_DIR, { recursive: true });
const startedAt = new Date();
const iso = (d) => d.toISOString();
function write(name, content) {
  fs.writeFileSync(path.join(OUT_DIR, name), content);
}
function writeRestricted(name, content) {
  const p = path.join(OUT_DIR, name);
  fs.writeFileSync(p, content, { mode: 0o600 });
}
function sha256(file) {
  try {
    return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  } catch (_) {
    return "n/a";
  }
}
function mask(v) {
  const s = String(v == null ? "" : v);
  if (s.length <= 12) return "***";
  return s.slice(0, 6) + "…" + s.slice(-4) + ` (len=${s.length})`;
}
function maskJwt(s) {
  return String(s || "").replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, (m) => mask(m));
}
function httpsGetJson(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, json: JSON.parse(data), rawLen: data.length });
        } catch (e) {
          reject(new Error(`JSON parse failed (status ${res.statusCode}, len ${data.length}): ${String(e.message).slice(0, 100)}`));
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(30000, () => req.destroy(new Error("timeout 30s")));
  });
}

(async () => {
  // ── 第 1 步：主 WS token（来自新鲜的 initial-dynamic） ──
  let initialDynamicUrl = `https://zh.xlivesex.com/api/front/v3/config/initial-dynamic?requestPath=%2F${ROOM}`;
  try {
    const v2files = fs.readdirSync(V2_DIR).filter((f) => f.endsWith(".jsonl")).sort();
    for (const f of v2files) {
      const text = fs.readFileSync(path.join(V2_DIR, f), "utf8");
      const m = text.match(/"url":"([^"]*initial-dynamic[^"]*)"/);
      if (m) { initialDynamicUrl = m[1]; break; }
    }
  } catch (_) {}
  console.log(`initial-dynamic URL source: ${initialDynamicUrl.includes("zh.xlivesex.com") ? "v2-log-or-default" : "v2-log"}`);

  let mainWsUrl = "";
  let mainWsToken = "";
  let fetchNote = "";
  try {
    const r = await httpsGetJson(initialDynamicUrl, {
      "User-Agent": UA,
      Referer: "https://zh.xlivesex.com/",
      Accept: "application/json",
    });
    fetchNote = `initial-dynamic status=${r.status} len=${r.rawLen}`;
    const ws = (r.json && r.json.websocket) || (r.json && r.json.configV3 && r.json.configV3.initialClient && r.json.configV3.initialClient.websocket) || {};
    mainWsUrl = ws.url || "";
    mainWsToken = ws.token || "";
    if (!mainWsUrl || !mainWsToken) {
      fetchNote += " | websocket.url/token missing in response (checked top-level and configV3.initialClient)";
    }
  } catch (e) {
    fetchNote = `initial-dynamic fetch failed: ${String(e.message).slice(0, 200)}`;
  }

  const channels = [`streamChanged@${MODEL_ID}`, `streamStatusChanged@${MODEL_ID}`];
  write("B01_connection_metadata.json", JSON.stringify({
    task: "B main-WS",
    started: iso(startedAt),
    room: ROOM,
    modelId: MODEL_ID,
    target: mainWsUrl || "(not obtained)",
    token_masked: mainWsToken ? mask(mainWsToken) : "(not obtained)",
    token_len: mainWsToken ? mainWsToken.length : 0,
    token_source: "v3/config/initial-dynamic (fresh fetch)",
    token_source_url: initialDynamicUrl.replace(/requestPath=[^&]*/, "requestPath=…"),
    fetch_note: fetchNote,
    channels_to_subscribe: channels,
    note: "websocketApps is a separate connection and is NOT used here. Extensions WS token is NEVER used for the main WS.",
  }, null, 2));

  if (!mainWsUrl || !mainWsToken) {
    write("B04_subscription_result.json", JSON.stringify({
      result: "STOPPED_NO_TOKEN",
      reason: fetchNote,
      note: "Main WS token was not obtained. Stopped here; extensions WS token was NOT substituted.",
    }, null, 2));
    write("B05_B_Acceptance_Report.md",
      `# 任务 B 验收报告（阶段08）\n\n- 时间：${iso(startedAt)}\n- 房间：${ROOM}（id ${MODEL_ID}）\n` +
      `- 结论：**未获得主 WS token，任务 B 在此停止。**\n- 事实：${fetchNote}\n` +
      `- 未使用 extensions WS token 替代；未做任何订阅尝试。\n`);
    console.log("DONE-B STOPPED_NO_TOKEN");
    return;
  }
  writeRestricted(".main-ws-token", mainWsToken + "\n");

  // ── 第 2 步：房间页里原生 WebSocket 连主 WS ──
  const { chromium } = require("playwright");
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const ctx = await browser.newContext({ userAgent: UA });
  const page = await ctx.newPage();
  try {
    await page.goto(`https://zh.xlivesex.com/${ROOM}`, { waitUntil: "domcontentloaded", timeout: 30000 });
  } catch (_) {}
  await page.waitForTimeout(5000);

  const COLLECT_SECONDS = 60;
  const result = await page.evaluate(async ({ url, token, channels, seconds }) => {
    const events = [];
    const t0 = Date.now();
    const stamp = () => Date.now() - t0;
    const maskTok = (s) => String(s || "").replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, (m) =>
      m.length > 12 ? m.slice(0, 6) + "…" + m.slice(-4) + ` (len=${m.length})` : "***");
    const logSent = (payload) => events.push({ dir: "sent", t: new Date().toISOString(), elapsedMs: stamp(), payload: maskTok(payload) });
    const logRecv = (payload) => events.push({ dir: "received", t: new Date().toISOString(), elapsedMs: stamp(), payload: maskTok(payload) });

    return await new Promise((resolve) => {
      let ws;
      let nextId = 1;
      let settled = false;
      const finish = (outcome) => {
        if (settled) return;
        settled = true;
        try { ws && ws.close(); } catch (_) {}
        resolve({ outcome, events });
      };
      const hardTimeout = setTimeout(() => finish("collect-window-ended"), seconds * 1000 + 5000);
      try {
        ws = new WebSocket(url);
      } catch (e) {
        events.push({ dir: "error", t: new Date().toISOString(), elapsedMs: stamp(), payload: "WebSocket constructor failed: " + String(e && e.message || e).slice(0, 200) });
        clearTimeout(hardTimeout);
        finish("constructor-failed");
        return;
      }
      ws.onopen = () => {
        events.push({ dir: "open", t: new Date().toISOString(), elapsedMs: stamp(), payload: url });
        const connect = JSON.stringify({ connect: { token, name: "js" }, id: nextId++ });
        ws.send(connect);
        logSent(connect);
        // 15 秒内无 connect ack 则停止
        setTimeout(() => {
          if (!settled && !events.some((e) => e.dir === "received" && e.payload.includes('"connect"'))) {
            finish("no-connect-ack-15s");
          }
        }, 15000);
      };
      ws.onmessage = (ev) => {
        const payload = String(ev.data || "");
        logRecv(payload);
        let obj = null;
        try { obj = JSON.parse(payload); } catch (_) {}
        if (obj && obj.id === 1 && obj.connect && !events.some((e) => e.dir === "sent" && e.payload.includes('"subscribe"'))) {
          // connect 成功：依次订阅两个频道
          const s1 = JSON.stringify({ subscribe: { channel: channels[0] }, id: nextId++ });
          ws.send(s1);
          logSent(s1);
          const s2 = JSON.stringify({ subscribe: { channel: channels[1] }, id: nextId++ });
          ws.send(s2);
          logSent(s2);
        }
      };
      ws.onerror = (ev) => {
        events.push({ dir: "error", t: new Date().toISOString(), elapsedMs: stamp(), payload: "WebSocket error event" });
      };
      ws.onclose = (ev) => {
        events.push({ dir: "close", t: new Date().toISOString(), elapsedMs: stamp(), payload: `code=${ev.code} reason=${String(ev.reason || "").slice(0, 200)} wasClean=${ev.wasClean}` });
        clearTimeout(hardTimeout);
        finish("closed-early");
      };
    });
  }, { url: mainWsUrl, token: mainWsToken, channels, seconds: COLLECT_SECONDS });
  await browser.close();

  // ── 写出 B02/B03/B04 ──
  const sent = result.events.filter((e) => e.dir === "sent");
  const received = result.events.filter((e) => e.dir === "received");
  write("B02_ws_sent.jsonl", sent.map((e) => JSON.stringify(e)).join("\n") + "\n");
  write("B03_ws_received.jsonl", received.map((e) => JSON.stringify(e)).join("\n") + "\n");

  const subResult = { outcome: result.outcome, channels: {} };
  for (const ch of channels) {
    const req = sent.find((e) => e.payload.includes(ch));
    const ack = received.find((e) => {
      try {
        const o = JSON.parse(e.payload);
        return o.subscribe && o.subscribe.channel === ch;
      } catch (_) { return false; }
    });
    const err = received.find((e) => {
      try {
        const o = JSON.parse(e.payload);
        return o.error && req && o.id === JSON.parse(req.payload).id;
      } catch (_) { return false; }
    });
    const pubs = received.filter((e) => {
      try {
        const o = JSON.parse(e.payload);
        return o.push && o.push.channel === ch;
      } catch (_) { return false; }
    });
    subResult.channels[ch] = {
      subscribe_sent: Boolean(req),
      subscribe_request: req ? req.payload : null,
      server_ack: ack ? ack.payload : null,
      server_error: err ? err.payload : null,
      publications_received: pubs.length,
      publications: pubs.slice(0, 5).map((p) => p.payload.slice(0, 8000)),
    };
  }
  const anyStreamChanged = received.some((e) => e.payload.includes("streamChanged"));
  const anyStreamStatusChanged = received.some((e) => e.payload.includes("streamStatusChanged"));
  subResult.any_streamChanged_frame = anyStreamChanged;
  subResult.any_streamStatusChanged_frame = anyStreamStatusChanged;
  write("B04_subscription_result.json", JSON.stringify(subResult, null, 2));

  const connectAck = received.find((e) => { try { const o = JSON.parse(e.payload); return o.id === 1 && o.connect; } catch (_) { return false; } });
  write("B05_B_Acceptance_Report.md",
    `# 任务 B 验收报告（阶段08）\n\n` +
    `- 时间：${iso(startedAt)}\n- 房间：${ROOM}（id ${MODEL_ID}）\n` +
    `- 目标：${mainWsUrl}\n- token：${mask(mainWsToken)}（原文仅存于受限文件 .main-ws-token）\n` +
    `- 收集窗口：${COLLECT_SECONDS} 秒；结束原因：${result.outcome}\n` +
    `- 发送帧：${sent.length} 条；接收帧：${received.length} 条\n\n` +
    `## 验收\n\n` +
    `- 主 WS 是否建立：${connectAck ? "是（connect ack 已收到）" : "否"}\n` +
    `- connect 是否成功：${connectAck ? "是" : "否"}\n` +
    `- streamChanged@${MODEL_ID} 是否获得服务端确认：${subResult.channels[`streamChanged@${MODEL_ID}`].server_ack ? "是" : "否"}${subResult.channels[`streamChanged@${MODEL_ID}`].server_error ? "（服务端返回错误，见 B04）" : ""}\n` +
    `- streamStatusChanged@${MODEL_ID} 是否获得服务端确认：${subResult.channels[`streamStatusChanged@${MODEL_ID}`].server_ack ? "是" : "否"}${subResult.channels[`streamStatusChanged@${MODEL_ID}`].server_error ? "（服务端返回错误，见 B04）" : ""}\n` +
    `- 是否收到真实 streamChanged 消息：${anyStreamChanged ? "是" : "否"}\n` +
    `- 是否收到真实 streamStatusChanged 消息：${anyStreamStatusChanged ? "是" : "否"}\n\n` +
    `## 事实与推断\n\n` +
    `- 事实：以上握手、connect、订阅确认、publication 计数均为实测值（见 B02/B03/B04）。\n` +
    `- 推断：未证实的部分不写成事实；对 Rex + 8787 架构的影响需结合任务 A 的结果与本轮订阅结果综合判断，见总控审核。\n\n` +
    `## 执行记录\n\n` +
    `- 输出文件哈希：\n` +
    `  - B01: ${sha256(path.join(OUT_DIR, "B01_connection_metadata.json"))}\n` +
    `  - B02: ${sha256(path.join(OUT_DIR, "B02_ws_sent.jsonl"))}\n` +
    `  - B03: ${sha256(path.join(OUT_DIR, "B03_ws_received.jsonl"))}\n` +
    `  - B04: ${sha256(path.join(OUT_DIR, "B04_subscription_result.json"))}\n`);
  console.log(`DONE-B outcome=${result.outcome} sent=${sent.length} received=${received.length}`);
})().catch((e) => {
  console.error("FATAL-B", e && e.message || e);
  process.exit(1);
});
