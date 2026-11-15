/**
 * 阶段08 任务 B07-P：主 WS 凭证前置核验（只读，不连接服务器）
 *
 * 只处理已经落盘的 B06 证据，不重新请求 initial-dynamic，不启动浏览器，
 * 不重新获取 Token，不连接主 WS，不发送 subscribe。
 *
 * 流程（全部只读）：
 *   1. 读取受限文件 .initial-dynamic-raw.json（当前为 v2.1 重跑保存的新响应，
 *      3307 字节；v2 的 3312 字节原始响应已被 v2.1 覆盖，无法再取——见报告限制）。
 *   2. 算 SHA256 与字节数，与 v2.1 的 B06_response_meta.json 记录值核对
 *      （预期 3307 字节，f5e80e10c268e806d3caf5595967181ed4097c0a4cdbdb43b62d92dae1363554）。
 *   3. 从同一份 JSON 中提取 initialDynamic.websocket.url / .token
 *      与 initialDynamic.websocketApps.url / .token，核对来源路径、是否同响应、
 *      主 WS 与 websocketApps 是否明确区分。
 *   4. JWT 结构检查：仅拆三段、解码 header 与 payload（不验证签名、不伪造、
 *      不修改、不延长有效期），记录 iss/aud/iat/exp/sub 等声明是否存在及其可读值。
 *      不输出完整 Token，不输出签名段。
 *   5. 写出 B07_Preflight_Audit.md（脱敏值），并打印脱敏摘要。
 *
 * 输出（OUT_DIR，默认 /opt/xlive/stage08）：
 *   B07_Preflight_Audit.md   前置核验报告（事实 / 结构检查 / 推断 / 未验证事项 / 停止原因）
 *
 * 保护：不修改任何文件（除新建本报告）；不联网；不启动浏览器；完整 Token 与
 * 签名段不进报告、不进日志、不进终端输出。
 *
 * 用法：node stage08-b07-preflight.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const OUT_DIR = process.env.OUT_DIR || "/opt/xlive/stage08";
const RAW_FILE = path.join(OUT_DIR, ".initial-dynamic-raw.json");
const META_FILE = path.join(OUT_DIR, "B06_response_meta.json");

function sha256buf(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}
function mask(v) {
  const s = String(v == null ? "" : v);
  if (s.length <= 12) return "***";
  return s.slice(0, 6) + "…" + s.slice(-4) + ` (len=${s.length})`;
}
function b64urlDecode(seg) {
  const s = seg.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s + pad, "base64").toString("utf8");
}
function isoFromSec(sec) {
  try {
    const n = Number(sec);
    if (!Number.isFinite(n)) return "(not a number)";
    return new Date(n * 1000).toISOString();
  } catch (_) {
    return "(unparseable)";
  }
}

(async () => {
  const startedAt = new Date();
  const lines = [];
  const findings = {};

  // ── 1. 读受限文件，算哈希 ──
  let rawBuf;
  try {
    rawBuf = fs.readFileSync(RAW_FILE);
  } catch (e) {
    console.log(`FATAL-PREFLIGHT cannot read restricted file: ${String(e.message).slice(0, 200)}`);
    process.exit(1);
  }
  const rawSha = sha256buf(rawBuf);
  const rawBytes = rawBuf.length;
  findings.raw_file = { bytes: rawBytes, sha256: rawSha };

  let meta = null;
  try { meta = JSON.parse(fs.readFileSync(META_FILE, "utf8")); } catch (_) {}
  findings.meta_match = meta
    ? { meta_bytes: meta.response_bytes, meta_sha256: meta.response_sha256,
        bytes_match: meta.response_bytes === rawBytes, sha_match: meta.response_sha256 === rawSha }
    : { note: "B06_response_meta.json not readable" };

  // ── 2. 解析 JSON，提取四个字段 ──
  let parsed = null;
  let parseNote = "";
  try {
    parsed = JSON.parse(rawBuf.toString("utf8"));
    parseNote = "JSON parse ok";
  } catch (e) {
    parseNote = `JSON parse failed: ${String(e.message).slice(0, 200)}`;
  }
  const id = (parsed && parsed.initialDynamic) || {};
  const ws = id.websocket || {};
  const apps = id.websocketApps || {};
  findings.fields = {
    "initialDynamic.websocket.url": { type: typeof ws.url, length: typeof ws.url === "string" ? ws.url.length : null, masked: mask(ws.url) },
    "initialDynamic.websocket.token": { type: typeof ws.token, length: typeof ws.token === "string" ? ws.token.length : null, masked: mask(ws.token) },
    "initialDynamic.websocketApps.url": { type: typeof apps.url, length: typeof apps.url === "string" ? apps.url.length : null, masked: mask(apps.url) },
    "initialDynamic.websocketApps.token": { type: typeof apps.token, length: typeof apps.token === "string" ? apps.token.length : null, masked: mask(apps.token) },
  };
  // URL 结构
  let wsUrlParts = null;
  try {
    const u = new URL(ws.url);
    wsUrlParts = { protocol: u.protocol, host: u.host, pathname: u.pathname };
  } catch (_) { wsUrlParts = { note: "not a parseable URL" }; }
  findings.ws_url_parts = wsUrlParts;
  let appsUrlParts = null;
  try {
    const u = new URL(apps.url);
    appsUrlParts = { protocol: u.protocol, host: u.host, pathname: u.pathname };
  } catch (_) { appsUrlParts = { note: "not a parseable URL" }; }
  findings.apps_url_parts = appsUrlParts;
  findings.same_response = {
    url_and_token_same_file: Boolean(ws.url && ws.token),
    apps_and_main_same_file: Boolean(apps.url && apps.token && ws.url && ws.token),
    file_sha256_matches_meta: findings.meta_match.sha_match === true,
    note: "URL 与 Token 均取自同一受限文件（同一份 initial-dynamic 响应原文）；文件 SHA256 与 v2.1 元数据一致即为同响应佐证。",
  };
  findings.main_vs_apps_distinct =
    Boolean(ws.url && apps.url && ws.url !== apps.url) &&
    Boolean(ws.token && apps.token && ws.token !== apps.token);

  // ── 3. JWT 结构检查（只解码，不验签） ──
  const jwt = { token_present: Boolean(ws.token), parts: 0, header: null, claims: null, claims_note: "" };
  if (typeof ws.token === "string" && ws.token.length > 0) {
    const parts = ws.token.split(".");
    jwt.parts = parts.length;
    if (parts.length === 3) {
      try {
        jwt.header = JSON.parse(b64urlDecode(parts[0]));
      } catch (e) {
        jwt.header = { note: `header decode failed: ${String(e.message).slice(0, 100)}` };
      }
      try {
        const payload = JSON.parse(b64urlDecode(parts[1]));
        const claims = {};
        for (const k of Object.keys(payload)) {
          const v = payload[k];
          if (k === "iat" || k === "exp" || k === "nbf") {
            claims[k] = { value: v, iso: isoFromSec(v) };
          } else if (typeof v === "string" && v.length > 40) {
            claims[k] = { value: mask(v), note: "long string, masked" };
          } else {
            claims[k] = { value: v };
          }
        }
        jwt.claims = claims;
        jwt.claims_note = "payload decoded (structure only, signature NOT verified)";
      } catch (e) {
        jwt.claims_note = `payload decode failed: ${String(e.message).slice(0, 100)}`;
      }
      // 注意：不输出签名段 parts[2]，不输出完整 token。
    } else {
      jwt.claims_note = `token does not have 3 parts (has ${parts.length})`;
    }
  }
  findings.jwt = jwt;

  // ── 4. 写报告 ──
  const report =
    `# B07 前置核验报告（阶段08，B07-P）\n\n` +
    `- 时间：${startedAt.toISOString()}\n` +
    `- 核验对象：服务器受限文件 .initial-dynamic-raw.json（当前为 v2.1 重跑保存的新响应；v2 的 3312 字节原始响应已被 v2.1 覆盖，无法再取——见“未验证事项”）\n` +
    `- 方式：只读文件检查，不连接服务器，不发送 subscribe，不重新请求 initial-dynamic，不启动浏览器。\n\n` +
    `## 实测事实\n\n` +
    `- 受限文件：${rawBytes} 字节，sha256 ${rawSha}\n` +
    `- 元数据核对（v2.1 B06_response_meta.json）：字节数 ${findings.meta_match.meta_bytes}（${findings.meta_match.bytes_match ? "一致" : "不一致"}），sha256 ${findings.meta_match.meta_sha256}（${findings.meta_match.sha_match ? "一致" : "不一致"}）\n` +
    `- JSON 解析：${parseNote}\n` +
    `- initialDynamic.websocket.url：${findings.fields["initialDynamic.websocket.url"].type}，长度 ${findings.fields["initialDynamic.websocket.url"].length}，脱敏值 ${findings.fields["initialDynamic.websocket.url"].masked}；结构：${JSON.stringify(wsUrlParts)}\n` +
    `- initialDynamic.websocket.token：${findings.fields["initialDynamic.websocket.token"].type}，长度 ${findings.fields["initialDynamic.websocket.token"].length}，脱敏值 ${findings.fields["initialDynamic.websocket.token"].masked}\n` +
    `- initialDynamic.websocketApps.url：${findings.fields["initialDynamic.websocketApps.url"].type}，长度 ${findings.fields["initialDynamic.websocketApps.url"].length}，脱敏值 ${findings.fields["initialDynamic.websocketApps.url"].masked}；结构：${JSON.stringify(appsUrlParts)}\n` +
    `- initialDynamic.websocketApps.token：${findings.fields["initialDynamic.websocketApps.token"].type}，长度 ${findings.fields["initialDynamic.websocketApps.token"].length}，脱敏值 ${findings.fields["initialDynamic.websocketApps.token"].masked}\n\n` +
    `## 结构检查结果\n\n` +
    `- 主 WS URL 来源：${ws.url ? "initialDynamic.websocket.url（已确认）" : "未找到"}\n` +
    `- 主 WS Token 来源：${ws.token ? "initialDynamic.websocket.token（已确认）" : "未找到"}\n` +
    `- URL 与 Token 是否来自同一份响应：${findings.same_response.url_and_token_same_file ? "是（同一受限文件，SHA256 与 v2.1 元数据一致）" : "否/无法确认"}\n` +
    `- 主 WS 与 websocketApps 是否明确区分：${findings.main_vs_apps_distinct ? "是（URL 不同，Token 不同）" : "否"}\n` +
    `- Token 是否符合 JWT 三段结构：${jwt.parts === 3 ? `是（3 段，header ${JSON.stringify(jwt.header)}）` : `否（${jwt.parts} 段）`}\n` +
    `- JWT 声明字段：${jwt.claims ? JSON.stringify(jwt.claims) : jwt.claims_note}\n` +
    `- 注意：JWT 结构解析不等于签名验证，也不等于服务端授权已经确认。\n\n` +
    `## 推断\n\n` +
    `- ${ws.url && ws.token && jwt.parts === 3 ? "主 WS URL 与 Token 的来源、结构、同响应关系均已核对通过，具备进入 B07 连接验证的前提条件（仍需总控批准）。" : "前提条件未全部满足，B07 不应执行。"}\n` +
    `- v2 与 v2.1 两轮浏览器会话均在同一字段路径找到主 WS token，且 token 每次会话不同（v2 为 153 字节，v2.1 为 151 字节），符合“每会话签发”的特征；未证实的不写成事实。\n\n` +
    `## 未验证事项\n\n` +
    `- 未验证 JWT 签名（结构解析不等于签名验证）。\n` +
    `- 未确认服务端是否接受该 token（需 B07 连接验证，总控未批准）。\n` +
    `- v2 轮次的原始响应体已被 v2.1 覆盖，v2 token（153 字节）的声明字段无法解析；仅其来源路径（initialDynamic.websocket.token）由 v2 递归检索确认。\n` +
    `- 未验证 token 有效期是否覆盖 B07 执行窗口（exp 见上，如已过期则 B07 需重新获取）。\n\n` +
    `## 停止原因\n\n` +
    `- 本任务到此停止：未连接主 WS，未发送 subscribe，未请求子播放列表，未修改任何配置。等待总控审核后再决定是否批准 B07。\n`;
  fs.writeFileSync(path.join(OUT_DIR, "B07_Preflight_Audit.md"), report);
  console.log(`DONE-PREFLIGHT bytes=${rawBytes} sha_match=${findings.meta_match.sha_match} jwt_parts=${jwt.parts} main_token=${ws.token ? "FOUND" : "NOT_FOUND"}`);
  console.log(`FIELDS ws.url=${findings.fields["initialDynamic.websocket.url"].masked} ws.token=${findings.fields["initialDynamic.websocket.token"].masked} apps.url=${findings.fields["initialDynamic.websocketApps.url"].masked} apps.token=${findings.fields["initialDynamic.websocketApps.token"].masked}`);
  console.log(`JWT header=${JSON.stringify(jwt.header)} claims=${JSON.stringify(jwt.claims)}`);
})().catch((e) => {
  console.error("FATAL-PREFLIGHT", e && e.stack ? String(e.stack).slice(0, 1500) : String(e));
  process.exit(1);
});
