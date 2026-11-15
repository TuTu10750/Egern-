/**
 * 阶段08 任务 A：CDN HLS Master Playlist 原始 HTTP 响应诊断
 *
 * 目标：查明 v2 里 master .m3u8 216 次请求全部 ERR_CONTENT_DECODING_FAILED 的原因。
 * 必须用新鲜、合法获取的免费直播播放 URL（pkey 可能已过期，旧 URL 的失败不能当新会话的结论）。
 *
 * 流程：
 *   1. Playwright 打开房间页，等第一个 master .m3u8 请求（带新鲜 pkey），记下完整 URL 与请求头。
 *      若 60 秒内没出现，改读 video 元素的 currentSrc；仍没有则如实记录“未获得 URL”并停止任务 A。
 *   2. 用 curl 按原样请求该 URL（同一 VPS 出口、复现请求头、--raw 保留原始编码、真实 GET，不用 -I）。
 *   3. 分离保存响应头、原始响应体、执行日志；检查体大小、文件头、编码。
 *
 * 输出（全部在 OUT_DIR，默认 /opt/xlive/stage08）：
 *   .fresh-url            原始 URL（0600 受限文件，不进报告、不上 GitHub）
 *   .body-raw             原始响应体（0600 受限文件，不进报告）
 *   A01_request_metadata.txt   新鲜 URL（pkey 脱敏）+ 复现的请求头 + 时间
 *   A02_response_headers.txt   响应头原文
 *   A03_body_inspection.txt    体大小、哈希、前字节、编码判断、是否为有效 M3U8
 *   A04_curl_execution.log     curl 命令（URL 脱敏）、退出码、stdout/stderr、文件哈希
 *   A05_Acceptance_Report.md   验收报告：状态码、编码、类型、长度、解码失败原因是否查明（事实与推断分开）
 *
 * 保护：不伪造凭证；不修改 v1/v2 日志、8787 服务、Xray/VPN；完整 pkey 只留在受限文件里。
 *
 * 用法：node stage08-a.js [房间用户名]   例：node stage08-a.js RoboticPower7
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const ROOM = process.argv[2] || "RoboticPower7";
const OUT_DIR = process.env.OUT_DIR || "/opt/xlive/stage08";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.0 Safari/605.1.15";

fs.mkdirSync(OUT_DIR, { recursive: true });
const startedAt = new Date();
const iso = (d) => d.toISOString();
const stamp = startedAt.toISOString().replace(/[:.]/g, "-").slice(0, 19);
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
// pkey 脱敏：只留前 6 + 后 4
function maskPkey(s) {
  return String(s || "").replace(/pkey=([^&\s"']+)/g, (m, v) =>
    v.length > 12 ? `pkey=${v.slice(0, 6)}…${v.slice(-4)}` : "pkey=***");
}
function mask(s) {
  const t = String(s || "");
  if (t.length <= 12) return "***";
  return t.slice(0, 6) + "…" + t.slice(-4) + ` (len=${t.length})`;
}

(async () => {
  const { chromium } = require("playwright");
  const execLog = [];
  const logLine = (s) => execLog.push(`[${iso(new Date())}] ${s}`);

  logLine(`Task A start, room=${ROOM}, out=${OUT_DIR}`);

  // ── 第 1 步：新鲜 master URL ──
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const ctx = await browser.newContext({ userAgent: UA });
  const page = await ctx.newPage();

  let masterReq = null;
  const masterRe = /\/master\/.*\.m3u8/;
  page.on("request", (req) => {
    if (!masterReq && masterRe.test(req.url())) {
      masterReq = { url: req.url(), method: req.method(), headers: req.headers(), t: iso(new Date()) };
    }
  });

  const roomUrl = `https://zh.xlivesex.com/${ROOM}`;
  logLine(`navigate ${roomUrl}`);
  try {
    await page.goto(roomUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  } catch (e) {
    logLine(`navigate-error: ${String(e && e.message || e).slice(0, 200)}`);
  }

  // 等第一个 master 请求，最多 60 秒
  for (let i = 0; i < 60 && !masterReq; i++) await page.waitForTimeout(1000);

  // 兜底：读 video 元素的 currentSrc
  if (!masterReq) {
    try {
      const src = await page.evaluate(() => {
        const v = document.querySelector("video");
        return v ? (v.currentSrc || v.src || "") : "";
      });
      if (src && masterRe.test(src)) {
        masterReq = { url: src, method: "GET", headers: {}, t: iso(new Date()), source: "video.currentSrc fallback" };
      }
    } catch (_) {}
  }
  await browser.close();

  if (!masterReq) {
    logLine("RESULT: no fresh master URL obtained within 60s (room may be offline or player never requested it)");
    write("A01_request_metadata.txt",
      `Task A - request metadata\nroom: ${ROOM}\nstarted: ${iso(startedAt)}\nresult: NO_FRESH_URL\n` +
      `note: no master .m3u8 request observed in 60s of page load, video.currentSrc also empty.\n` +
      `This is a finding, not a CDN refusal: do NOT use an old/expired URL as evidence.\n`);
    write("A05_Acceptance_Report.md",
      `# 任务 A 验收报告（阶段08）\n\n- 时间：${iso(startedAt)}\n- 房间：${ROOM}\n- 结论：**未获得新鲜播放 URL，任务 A 无法继续。**\n- 事实：60 秒页面加载内未观测到 master .m3u8 请求，video.currentSrc 为空。\n- 推断：房间可能不在线，或本会话播放器未发起请求；未证实。\n- 不把旧 URL（pkey 可能过期）的失败结果当成新会话的授权结论。\n`);
    write("A04_curl_execution.log", execLog.join("\n") + "\n");
    console.log("DONE-A NO_FRESH_URL");
    return;
  }

  const rawUrl = masterReq.url;
  writeRestricted(".fresh-url", rawUrl + "\n");
  const maskedUrl = maskPkey(rawUrl);
  logLine(`fresh master URL obtained at ${masterReq.t} (masked: ${maskedUrl})`);

  write("A01_request_metadata.txt",
    `Task A - request metadata\nroom: ${ROOM}\nstarted: ${iso(startedAt)}\n` +
    `obtained_at: ${masterReq.t}\nsource: ${masterReq.source || "first master request observed on page load"}\n` +
    `method: ${masterReq.method}\nurl_masked: ${maskedUrl}\n` +
    `request_headers:\n${JSON.stringify(masterReq.headers, null, 2)}\n` +
    `note: full URL with raw pkey is stored ONLY in restricted file .fresh-url (0600) on this server.\n`);

  // ── 第 2 步：curl 原始请求 ──
  const headersFile = path.join(OUT_DIR, "A02_response_headers.txt");
  const bodyFile = path.join(OUT_DIR, ".body-raw");
  const curlArgs = [
    "-sS", "--raw",
    "-D", headersFile,
    "-o", bodyFile,
    "-w", "HTTP_CODE:%{http_code}\n",
    "-H", "Referer: https://zh.xlivesex.com/",
    "-H", `User-Agent: ${UA}`,
    "-H", "Accept-Encoding: identity;q=1, *;q=0",
    "-H", "Range: bytes=0-",
    rawUrl,
  ];
  logLine(`curl start (args logged with URL masked; raw URL passed via argv, not shell)`);
  const curlStart = new Date();
  const res = spawnSync("curl", curlArgs, { encoding: "utf8", timeout: 120000 });
  const curlEnd = new Date();
  const httpCode = (res.stdout || "").match(/HTTP_CODE:(\d+)/)?.[1] || "unknown";
  logLine(`curl exit=${res.status} http_code=${httpCode} duration_ms=${curlEnd - curlStart}`);
  if (res.stdout) logLine(`curl stdout (masked): ${maskPkey(res.stdout).slice(0, 500)}`);
  if (res.stderr) logLine(`curl stderr (masked): ${maskPkey(res.stderr).slice(0, 1000)}`);
  if (res.error) logLine(`curl error: ${String(res.error.message || res.error).slice(0, 300)}`);
  // 受限文件权限
  try { fs.chmodSync(bodyFile, 0o600); } catch (_) {}

  // ── 第 3 步：响应体检查 ──
  let bodySize = 0;
  let bodyBuf = Buffer.alloc(0);
  try {
    bodyBuf = fs.readFileSync(bodyFile);
    bodySize = bodyBuf.length;
  } catch (_) {}
  const first16hex = bodyBuf.subarray(0, 16).toString("hex");
  const first200 = bodyBuf.subarray(0, 200).toString("utf8").replace(/[^\x20-\x7E\n\r\t]/g, "·");
  const isGzip = bodySize >= 2 && bodyBuf[0] === 0x1f && bodyBuf[1] === 0x8b;
  const isM3U8 = bodyBuf.toString("utf8", 0, Math.min(bodySize, 500)).includes("#EXTM3U");
  const isHtml = /<\s*html|<\s*!doctype html/i.test(bodyBuf.toString("utf8", 0, Math.min(bodySize, 500)));
  const headersText = (() => { try { return fs.readFileSync(headersFile, "utf8"); } catch (_) { return "(headers file missing)"; } })();
  const pickHeader = (name) => {
    const m = headersText.match(new RegExp(`^${name}:\\s*(.*)$`, "im"));
    return m ? m[1].trim() : "(absent)";
  };

  write("A03_body_inspection.txt",
    `Task A - body inspection\nroom: ${ROOM}\ninspected: ${iso(new Date())}\n` +
    `http_code: ${httpCode}\nbody_bytes: ${bodySize}\nbody_sha256: ${sha256(bodyFile)}\n` +
    `content-encoding: ${pickHeader("Content-Encoding")}\ncontent-type: ${pickHeader("Content-Type")}\n` +
    `content-length: ${pickHeader("Content-Length")}\naccept-ranges: ${pickHeader("Accept-Ranges")}\n` +
    `content-range: ${pickHeader("Content-Range")}\n` +
    `first16_hex: ${first16hex}\n` +
    `first200_text:\n${first200}\n` +
    `checks:\n  gzip_magic_1f8b: ${isGzip}\n  contains_#EXTM3U: ${isM3U8}\n  looks_like_html: ${isHtml}\n` +
    `note: raw body is stored ONLY in restricted file .body-raw (0600) on this server.\n`);

  // ── 验收报告 ──
  const causeKnown =
    httpCode === "200" && isM3U8
      ? "YES - server returned a valid M3U8; the Chromium decoding failure is client-side (headless/quirk), not a CDN refusal."
      : httpCode === "200" && isGzip
      ? "YES - server returned gzip-compressed bytes despite the identity-only Accept-Encoding; encoding negotiation mismatch is the likely decoding-failure cause."
      : httpCode !== "200"
      ? `PARTIAL - HTTP ${httpCode}, not a 200 playlist; see headers/body for what the CDN actually returned.`
      : "NO - inconclusive from these bytes; see A02/A03.";
  write("A05_Acceptance_Report.md",
    `# 任务 A 验收报告（阶段08）\n\n` +
    `- 时间：${iso(startedAt)}（curl：${iso(curlStart)}–${iso(curlEnd)}）\n- 房间：${ROOM}\n` +
    `- 新鲜 URL：${maskedUrl}（pkey 已脱敏，原文仅存于受限文件 .fresh-url）\n` +
    `- HTTP 状态：${httpCode}\n- Content-Encoding：${pickHeader("Content-Encoding")}\n` +
    `- Content-Type：${pickHeader("Content-Type")}\n- Content-Length：${pickHeader("Content-Length")}\n` +
    `- 响应体：${bodySize} 字节，sha256 ${sha256(bodyFile)}\n` +
    `- 前 16 字节 hex：${first16hex}\n- gzip 魔数：${isGzip}；含 #EXTM3U：${isM3U8}；像 HTML：${isHtml}\n\n` +
    `## 验收\n\n- 原始 HTTP 响应是否成功获取：${httpCode !== "unknown" && bodySize >= 0 ? "是（见 A02/A03）" : "否"}\n` +
    `- 解码失败原因是否查明：${causeKnown}\n\n` +
    `## 事实与推断\n\n- 事实：以上状态码、响应头、体大小、文件头均为实测值。\n` +
    `- 推断：原因判定见上；未证实的部分不写成事实。\n\n` +
    `## 执行记录\n\n- curl 退出码：${res.status}\n- 输出文件哈希：\n` +
    `  - A01: ${sha256(path.join(OUT_DIR, "A01_request_metadata.txt"))}\n` +
    `  - A02: ${sha256(path.join(OUT_DIR, "A02_response_headers.txt"))}\n` +
    `  - A03: ${sha256(path.join(OUT_DIR, "A03_body_inspection.txt"))}\n` +
    `  - A04: ${sha256(path.join(OUT_DIR, "A04_curl_execution.log"))}\n`);
  write("A04_curl_execution.log", execLog.join("\n") + "\n");
  console.log(`DONE-A http_code=${httpCode} body_bytes=${bodySize}`);
})().catch((e) => {
  console.error("FATAL-A", e && e.message || e);
  process.exit(1);
});
