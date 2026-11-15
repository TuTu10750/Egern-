/**
 * 阶段08 任务 B07-C：主 WS 连接握手验证（总控已批准，一次 connect，不含 subscribe）
 *
 * 授权范围：仅使用现有 v2.1 浏览器会话取得的主房间 WS URL 与 Token，
 * 执行一次正常的主 WS 连接及认证握手验证。不含 subscribe、媒体播放、子播放列表请求。
 *
 * 协议依据（此前已取得的 Centrifugo 6.2.0 OSS 协议证据，v1/v2 实测）：
 *   客户端发送：{"connect":{"token":"<JWT>","name":"js"},"id":1}
 *   服务端成功回复：{"id":1,"connect":{"client":"<id>","version":"6.2.0 OSS","ping":25,"pong":true}}
 *   服务端拒绝回复：{"id":1,"error":{"code":<n>,"message":"..."}} 或 disconnect 帧
 * 除此之外不猜测任何认证字段。握手请求头复现正常浏览器客户端
 * （Origin: https://zh.xlivesex.com，桌面 Safari UA），不伪造凭证。
 *
 * 流程：
 *   0. 预检（只读）：读受限文件 .initial-dynamic-raw.json，核对 SHA256、
 *      主 WS URL 来源、Token 来源、URL 与 Token 同一份 JSON、JWT 3 段结构、
 *      凭证文件获取时间间隔；任一不符立即停止，不重新获取凭证。
 *   1. 连接：仅连接 wss://websocket-v6.xlivesex.com/connection/websocket，
 *      一次 connect 握手；连接超时 15s，响应等待 20s，整体硬超时 60s。
 *      只执行一次，不得循环重试，不得切换 Token，不得尝试其他端点。
 *   2. 收到 connect 响应后立即停止并清理连接；不发送 subscribe/publish/业务消息；
 *      不请求子播放列表与媒体分片；不连接 websocketApps 或 extensions WS。
 *
 * 输出（OUT_DIR，默认 /opt/xlive/stage08；脚本本身置于 /opt/xlive/b07c/，其 ws 依赖亦在此目录）：
 *   B07C_Connect_Audit.md      连接验证审计报告（区分：WS 握手 / Centrifugo connect / 服务端认证）
 *   B07C_Connect_Response.json 脱敏后的 connect 响应与握手元数据
 *   B07C_Execution_Log.jsonl   执行日志（时间戳 + 各阶段 START/END）
 * 完整 Token 与签名段不写入任何输出；敏感字段一律脱敏。
 * 除新建上述三份交付物外，不修改任何文件；不修改 8787、Xray、VPN 或其他配置。
 *
 * 用法：cd /opt/xlive/b07c && npm install ws && node stage08-b07c-connect.js
 * 退出码：0 = 流程完成（即使服务端拒绝 connect，该结果本身即为证据）；
 *         2 = 预检不通过，已停止，未尝试连接；1 = 脚本错误。
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const OUT_DIR = process.env.OUT_DIR || "/opt/xlive/stage08";
const RAW_FILE = path.join(OUT_DIR, ".initial-dynamic-raw.json");
const META_FILE = path.join(OUT_DIR, "B06_response_meta.json");
const EXPECTED_SHA = "f5e80e10c268e806d3caf5595967181ed4097c0a4cdbdb43b62d92dae1363554";
const EXPECTED_URL = "wss://websocket-v6.xlivesex.com/connection/websocket";
const CONNECT_TIMEOUT_MS = 15000;
const RESPONSE_TIMEOUT_MS = 20000;
const OVERALL_TIMEOUT_MS = 60000;
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

const startedAt = new Date();
const logLines = [];
function log(stage, event, detail) {
  const rec = { t: new Date().toISOString(), stage, event, detail: detail || "" };
  logLines.push(rec);
  console.log(`[${rec.t}] ${stage} ${event} ${rec.detail}`);
}
function sha256buf(buf) { return crypto.createHash("sha256").update(buf).digest("hex"); }
function mask(v) {
  const s = String(v == null ? "" : v);
  if (s.length <= 12) return "***";
  return s.slice(0, 6) + "…" + s.slice(-4) + ` (len=${s.length})`;
}
// 递归脱敏：任何名为 token / signature / pkey / cookie 的字段只保留脱敏值
function maskDeep(obj) {
  if (obj == null) return obj;
  if (typeof obj === "string") return obj.length > 40 ? mask(obj) : obj;
  if (Array.isArray(obj)) return obj.map(maskDeep);
  if (typeof obj === "object") {
    const out = {};
    for (const k of Object.keys(obj)) {
      const lk = k.toLowerCase();
      if (lk.includes("token") || lk.includes("signature") || lk.includes("pkey") || lk.includes("cookie") || lk === "jwt") {
        out[k] = mask(obj[k]);
      } else {
        out[k] = maskDeep(obj[k]);
      }
    }
    return out;
  }
  return obj;
}
function writeLog() {
  fs.writeFileSync(path.join(OUT_DIR, "B07C_Execution_Log.jsonl"), logLines.map((l) => JSON.stringify(l)).join("\n") + "\n");
}

(async () => {
  log("B07-C", "START", `task approved; expected sha=${EXPECTED_SHA.slice(0, 12)}…`);
  const facts = {};
  const checks = {};

  // ── 0. 预检（只读） ──
  log("B07-C-00", "START", "preflight: read restricted file");
  let rawBuf;
  try {
    rawBuf = fs.readFileSync(RAW_FILE);
  } catch (e) {
    log("B07-C-00", "STOPPED", `cannot read restricted file: ${String(e.message).slice(0, 200)}`);
    writeLog();
    fs.writeFileSync(path.join(OUT_DIR, "B07C_Connect_Audit.md"),
      `# B07-C 连接验证审计报告（阶段08）\n\n- 时间：${startedAt.toISOString()}\n- 结果：STOPPED——无法读取受限凭证文件，未尝试连接。\n`);
    process.exit(2);
  }
  const rawSha = sha256buf(rawBuf);
  const rawBytes = rawBuf.length;
  facts.credential_file = { bytes: rawBytes, sha256: rawSha };
  checks.sha_match = rawSha === EXPECTED_SHA;

  let parsed = null;
  try { parsed = JSON.parse(rawBuf.toString("utf8")); } catch (e) {
    log("B07-C-00", "STOPPED", `restricted file JSON parse failed: ${String(e.message).slice(0, 200)}`);
    writeLog();
    process.exit(2);
  }
  const id = (parsed && parsed.initialDynamic) || {};
  const ws = id.websocket || {};
  const apps = id.websocketApps || {};
  checks.url_source = typeof ws.url === "string" && ws.url.length > 0 ? "initialDynamic.websocket.url" : "MISSING";
  checks.url_match = ws.url === EXPECTED_URL;
  checks.token_source = typeof ws.token === "string" && ws.token.length > 0 ? "initialDynamic.websocket.token" : "MISSING";
  checks.token_parts = typeof ws.token === "string" ? ws.token.split(".").length : 0;
  checks.token_is_jwt_3part = checks.token_parts === 3;
  checks.same_json = Boolean(ws.url && ws.token);
  checks.token_not_apps = typeof ws.token === "string" && typeof apps.token === "string" ? ws.token !== apps.token : null;
  checks.token_not_extensions = null; // extensions token 不在本文件中，不作比较
  facts.ws_url = { source: checks.url_source, length: typeof ws.url === "string" ? ws.url.length : null, masked: mask(ws.url) };
  facts.ws_token = { source: checks.token_source, length: typeof ws.token === "string" ? ws.token.length : null, masked: mask(ws.token) };
  facts.apps_token_masked = mask(apps.token);

  let meta = null;
  try { meta = JSON.parse(fs.readFileSync(META_FILE, "utf8")); } catch (_) {}
  facts.credential_fetched_at = meta && meta.fetched_at ? meta.fetched_at : "(unknown; B06_response_meta.json unreadable)";
  facts.credential_age_seconds = meta && meta.fetched_at
    ? Math.round((Date.now() - new Date(meta.fetched_at).getTime()) / 1000)
    : null;
  log("B07-C-00", "END", `sha_match=${checks.sha_match} url_match=${checks.url_match} token_3part=${checks.token_is_jwt_3part} same_json=${checks.same_json} age_s=${facts.credential_age_seconds}`);

  const preflightOk = checks.sha_match && checks.url_match && checks.token_source === "initialDynamic.websocket.token"
    && checks.token_is_jwt_3part && checks.same_json && checks.token_not_apps !== false;
  if (!preflightOk) {
    log("B07-C-00", "STOPPED", `preflight failed: ${JSON.stringify(checks)}; no connection attempted, no credential re-fetch`);
    writeLog();
    fs.writeFileSync(path.join(OUT_DIR, "B07C_Connect_Audit.md"),
      `# B07-C 连接验证审计报告（阶段08）\n\n- 时间：${startedAt.toISOString()}\n- 结果：STOPPED——预检不通过，未尝试连接，未重新获取凭证。\n- 预检结果：${JSON.stringify(checks)}\n- 凭证文件：${rawBytes} 字节，sha256 ${rawSha}\n`);
    process.exit(2);
  }

  // ── 1. 连接（一次） ──
  let WebSocketCtor;
  try {
    WebSocketCtor = require("ws");
  } catch (e) {
    log("B07-C-01", "STOPPED", `ws client library not available: ${String(e.message).slice(0, 200)} (run: cd /opt/xlive/b07c && npm install ws)`);
    writeLog();
    process.exit(1);
  }

  const result = {
    task: "B07-C main-WS connect handshake verification",
    started_at: startedAt.toISOString(),
    target: { url: EXPECTED_URL, host: "websocket-v6.xlivesex.com", path: "/connection/websocket" },
    credential: { file_sha256: rawSha, file_bytes: rawBytes, fetched_at: facts.credential_fetched_at, age_seconds: facts.credential_age_seconds,
      token_source: checks.token_source, token_length: facts.ws_token.length, token_masked: facts.ws_token.masked },
    ws_handshake: null,      // WebSocket 握手（TCP+TLS+HTTP Upgrade）层
    centrifugo_connect: null, // Centrifugo connect 协议层
    server_auth: null,        // 服务端认证层（token 是否被接受）
    connect_response: null,   // 脱敏后的原始响应
    error: null,
    close: null,
    finished_at: null,
  };

  log("B07-C-01", "START", "single connect attempt (no retry)");
  const overallTimer = setTimeout(() => {
    log("B07-C-01", "TIMEOUT", `overall ${OVERALL_TIMEOUT_MS}ms exceeded; closing`);
    try { socket.close(); } catch (_) {}
    finish(new Error("overall timeout"));
  }, OVERALL_TIMEOUT_MS);

  let socket = null;
  let settled = false;
  function finish(err) {
    if (settled) return;
    settled = true;
    clearTimeout(overallTimer);
    result.finished_at = new Date().toISOString();
    result.error = err ? String(err && err.message ? err.message : err).slice(0, 500) : null;
    fs.writeFileSync(path.join(OUT_DIR, "B07C_Connect_Response.json"), JSON.stringify(result, null, 2));
    const audit =
      `# B07-C 连接验证审计报告（阶段08）\n\n` +
      `- 任务：主 WS 连接握手验证（总控已批准，一次 connect，不含 subscribe）\n` +
      `- 开始：${result.started_at}\n- 结束：${result.finished_at}\n` +
      `- 目标：${result.target.url}\n` +
      `- 凭证：受限文件 ${rawBytes} 字节，sha256 ${rawSha}（与预期一致）；获取时间 ${facts.credential_fetched_at}，距执行约 ${facts.credential_age_seconds} 秒；Token 来源 ${checks.token_source}，长度 ${facts.ws_token.length}，脱敏值 ${facts.ws_token.masked}\n\n` +
      `## 实测事实\n\n` +
      `- WebSocket 握手：${result.ws_handshake ? JSON.stringify(result.ws_handshake) : "未完成/未记录"}\n` +
      `- Centrifugo connect：${result.centrifugo_connect ? JSON.stringify(result.centrifugo_connect) : "未完成/未记录"}\n` +
      `- 服务端认证：${result.server_auth ? JSON.stringify(result.server_auth) : "未完成/未记录"}\n` +
      `- connect 响应（脱敏）：${result.connect_response ? JSON.stringify(result.connect_response) : "无"}\n` +
      `- 错误：${result.error || "无"}\n` +
      `- 连接关闭：${result.close ? JSON.stringify(result.close) : "未记录"}\n\n` +
      `## 三层区分\n\n` +
      `- WebSocket 握手成功 ≠ Centrifugo connect 成功 ≠ 服务端认证成功；三者以本报告所列为准，不得混为一谈。\n` +
      `- 握手成功仅证明传输层与 Upgrade 完成；connect 成功证明 Centrifugo 协议层接受该帧；认证成功以服务端返回的 connect 对象（而非 error/disconnect）为准。\n\n` +
      `## 推断\n\n` +
      `- ${result.server_auth && result.server_auth.accepted ? "服务端接受了该主 WS Token 的 connect 握手，B07 的连接前提成立；订阅验证（B07-S）仍需总控另行批准。" : "服务端未接受 connect（见错误/响应），B07-S 不应以此凭证继续；需总控决定是否重新获取凭证或调整方案。"}\n\n` +
      `## 未验证事项\n\n` +
      `- 未发送 subscribe，未验证任何频道（含 streamChanged）是否存在或可订阅。\n` +
      `- 未验证 JWT 签名；未验证播放授权与子播放列表。\n` +
      `- 未验证该 Token 在其他时间窗口或另一会话中是否仍有效。\n\n` +
      `## 停止原因\n\n` +
      `- 收到 connect 响应（或连接失败）后立即停止并清理连接，未发送 subscribe。本次授权不自动延伸至 B07-S 订阅验证。等待总控审核。\n`;
    fs.writeFileSync(path.join(OUT_DIR, "B07C_Connect_Audit.md"), audit);
    writeLog();
    console.log(`DONE-B07C handshake=${result.ws_handshake && result.ws_handshake.ok} connect=${result.centrifugo_connect && result.centrifugo_connect.ok} auth=${result.server_auth && result.server_auth.accepted}`);
    process.exit(0);
  }

  const connectStart = Date.now();
  try {
    socket = new WebSocketCtor(EXPECTED_URL, {
      headers: { Origin: "https://zh.xlivesex.com", "User-Agent": UA },
      handshakeTimeout: CONNECT_TIMEOUT_MS,
    });
  } catch (e) {
    log("B07-C-01", "ERROR", `WebSocket constructor failed: ${String(e.message).slice(0, 300)}`);
    finish(e);
    return;
  }

  const responseTimer = setTimeout(() => {
    log("B07-C-01", "TIMEOUT", `no connect response within ${RESPONSE_TIMEOUT_MS}ms after send`);
    try { socket.close(); } catch (_) {}
    result.centrifugo_connect = { ok: false, note: "no response within timeout" };
    finish(new Error("connect response timeout"));
  }, CONNECT_TIMEOUT_MS + RESPONSE_TIMEOUT_MS);

  socket.on("open", () => {
    const hsMs = Date.now() - connectStart;
    result.ws_handshake = { ok: true, elapsed_ms: hsMs, note: "TCP+TLS+HTTP Upgrade completed (ws 'open')" };
    log("B07-C-01", "OPEN", `ws handshake ok in ${hsMs}ms; sending Centrifugo connect frame (token masked)`);
    const frame = JSON.stringify({ connect: { token: ws.token, name: "js" }, id: 1 });
    try {
      socket.send(frame);
      log("B07-C-01", "SENT", "connect frame id=1 (token not logged)");
    } catch (e) {
      clearTimeout(responseTimer);
      result.centrifugo_connect = { ok: false, note: `send failed: ${String(e.message).slice(0, 200)}` };
      finish(e);
    }
  });

  socket.on("message", (data) => {
    clearTimeout(responseTimer);
    const rawText = data.toString();
    let msg = null;
    try { msg = JSON.parse(rawText); } catch (_) { msg = { note: "non-JSON frame", length: rawText.length }; }
    const masked = maskDeep(msg);
    result.connect_response = masked;
    log("B07-C-01", "RECEIVED", `connect response (masked): ${JSON.stringify(masked).slice(0, 500)}`);
    if (msg && msg.id === 1 && msg.connect && typeof msg.connect === "object") {
      result.centrifugo_connect = { ok: true, note: "server returned connect object", client: masked.connect.client || null, version: masked.connect.version || null, ping: masked.connect.ping != null ? masked.connect.ping : null };
      result.server_auth = { accepted: true, note: "server accepted the connect (connect object returned, no error)" };
    } else if (msg && msg.id === 1 && msg.error) {
      result.centrifugo_connect = { ok: false, note: "server returned error", error: masked.error };
      result.server_auth = { accepted: false, note: "server rejected the connect", code: msg.error && msg.error.code, message: msg.error && msg.error.message ? String(msg.error.message).slice(0, 300) : null };
    } else if (msg && msg.disconnect) {
      result.centrifugo_connect = { ok: false, note: "server sent disconnect", disconnect: masked.disconnect };
      result.server_auth = { accepted: false, note: "server disconnected during connect" };
    } else {
      result.centrifugo_connect = { ok: false, note: "unexpected first frame (not id=1 connect/error/disconnect)" };
      result.server_auth = { accepted: false, note: "cannot confirm auth from first frame" };
    }
    try { socket.close(); } catch (_) {}
    // 等 close 事件后再 finish；若 close 不来，2s 后强制 finish
    setTimeout(() => { if (!settled) { result.close = result.close || { note: "close event not received within 2s after response; finishing anyway" }; finish(null); } }, 2000);
  });

  socket.on("error", (e) => {
    clearTimeout(responseTimer);
    const msg = String(e && e.message ? e.message : e).slice(0, 500);
    log("B07-C-01", "ERROR", `ws error: ${msg}`);
    if (!result.ws_handshake) {
      result.ws_handshake = { ok: false, note: `handshake failed: ${msg}` };
    }
    if (!result.centrifugo_connect) {
      result.centrifugo_connect = { ok: false, note: "no Centrifugo connect attempted/completed (transport failed)" };
    }
    if (!result.server_auth) {
      result.server_auth = { accepted: false, note: "auth not reached (transport failed)" };
    }
    try { socket.close(); } catch (_) {}
    setTimeout(() => { if (!settled) finish(new Error(msg)); }, 500);
  });

  socket.on("close", (code, reason) => {
    result.close = { code, reason: reason ? String(reason).slice(0, 200) : "", note: "connection closed and cleaned up" };
    log("B07-C-01", "CLOSE", `code=${code} reason=${String(reason || "").slice(0, 100)}`);
    if (!settled) finish(null);
  });
})().catch((e) => {
  console.error("FATAL-B07C", e && e.stack ? String(e.stack).slice(0, 1500) : String(e));
  try { writeLog(); } catch (_) {}
  process.exit(1);
});
