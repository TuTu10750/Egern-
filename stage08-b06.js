/**
 * 阶段08 任务 B06：浏览器真实会话取证（initial-dynamic 递归检索）
 *
 * 背景：阶段08-B 用无 Cookie 的 Node 请求取 initial-dynamic，返回 200 但未找到
 * 主 WS token；v2 的 Playwright 浏览器会话曾拿到过 token。B06 用真实浏览器会话
 * 重取，判断 token 发放是否依赖会话/Cookie，并对完整 JSON 做递归检索。
 *
 * 流程：
 *   0. B3 对账：直接读服务器上 B01/B04/B05 三个文件的原文，提取其中记录的
 *      响应长度并算哈希，确认 3209/3309 差异的真相（脚本本身对三处写的是同一
 *      个计算值，差异只能来自转录或文件本身，以文件原文为准）。
 *   1. Playwright 打开房间页，等 10 秒让网站自然建立 Cookie（不手工拼 Cookie，
 *      不从其他会话复制 JWT）。
 *   2. 在页面内同源 fetch initial-dynamic（浏览器上下文，Cookie 自然附带），
 *      取回完整响应原文，存入受限文件 .initial-dynamic-raw.json（0600），
 *      记录状态码、字节长度、SHA256、获取时间、完整 URL。
 *   3. 对完整 JSON 做递归检索：查找 websocket、websocketApps、token、url、
 *      initialClient、config，以及任何含 websocket/token 的键（不区分大小写）。
 *      只记录字段路径、类型、长度和脱敏值，不输出完整 JWT。
 *   4. 写出 B06_recursive_search.json 与 B06_Report.md。
 *
 * 输出（全部在 OUT_DIR，默认 /opt/xlive/stage08）：
 *   .initial-dynamic-raw.json   完整响应原文（0600 受限文件，不进报告）
 *   B06_recursive_search.json   递归检索命中：路径、类型、长度、脱敏值
 *   B06_Report.md               验收报告：B3 对账结果、是否找到主 WS token、
 *                               会话条件对比、事实与推断分开
 *
 * 保护：不伪造凭证；不修改 v1/v2 日志、8787 服务、Xray/VPN；不做 B07（连接/订阅
 * 需总控另行批准）；完整 JWT 只留在受限文件里。
 *
 * 用法：node stage08-b06.js [房间用户名]   例：node stage08-b06.js RoboticPower7
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOM = process.argv[2] || "RoboticPower7";
const OUT_DIR = process.env.OUT_DIR || "/opt/xlive/stage08";
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
function sha256buf(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}
function sha256(file) {
  try {
    return sha256buf(fs.readFileSync(file));
  } catch (_) {
    return "n/a";
  }
}
function mask(v) {
  const s = String(v == null ? "" : v);
  if (s.length <= 12) return "***";
  return s.slice(0, 6) + "…" + s.slice(-4) + ` (len=${s.length})`;
}

(async () => {
  // ── 第 0 步：B3 对账——读 B01/B04/B05 原文 ──
  const b3 = {};
  for (const f of ["B01_connection_metadata.json", "B04_subscription_result.json", "B05_B_Acceptance_Report.md"]) {
    const p = path.join(OUT_DIR, f);
    let text = "";
    try { text = fs.readFileSync(p, "utf8"); } catch (_) { text = "(missing)"; }
    const lens = [...text.matchAll(/len=(\d+)/g)].map((m) => m[1]);
    b3[f] = { sha256: sha256(p), len_mentions: lens, bytes: text.length };
  }

  // ── 第 1 步：真实浏览器会话 ──
  const { chromium } = require("playwright");
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const ctx = await browser.newContext({ userAgent: UA });
  const page = await ctx.newPage();
  const roomUrl = `https://zh.xlivesex.com/${ROOM}`;
  let navNote = "";
  try {
    await page.goto(roomUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    navNote = "navigated ok";
  } catch (e) {
    navNote = `navigate error: ${String(e && e.message || e).slice(0, 200)}`;
  }
  await page.waitForTimeout(10000); // 让网站自然建立 Cookie

  // ── 第 2 步：页面内同源 fetch initial-dynamic ──
  const apiUrl = `/api/front/v3/config/initial-dynamic?requestPath=%2F${ROOM}`;
  const fetched = await page.evaluate(async (apiUrl) => {
    const t0 = new Date().toISOString();
    try {
      const res = await fetch(apiUrl, { headers: { Accept: "application/json" } });
      const text = await res.text();
      return { status: res.status, text, fetchedAt: t0, url: res.url };
    } catch (e) {
      return { status: 0, text: "", fetchedAt: t0, url: apiUrl, error: String(e && e.message || e).slice(0, 200) };
    }
  }, apiUrl);
  await browser.close();

  const rawText = fetched.text || "";
  const rawBuf = Buffer.from(rawText, "utf8");
  writeRestricted(".initial-dynamic-raw.json", rawText);
  const fetchedAt = fetched.fetchedAt || iso(new Date());
  const respLen = rawBuf.length;
  const respSha = sha256buf(rawBuf);

  // ── 第 3 步：递归检索 ──
  const hits = [];
  const KEY_EXACT = new Set(["websocket", "websocketApps", "token", "url", "initialClient", "config"]);
  function walk(node, dotPath) {
    if (node && typeof node === "object") {
      if (Array.isArray(node)) {
        node.forEach((v, i) => walk(v, `${dotPath}[${i}]`));
      } else {
        for (const k of Object.keys(node)) {
          const p = dotPath ? `${dotPath}.${k}` : k;
          const v = node[k];
          const kl = k.toLowerCase();
          if (KEY_EXACT.has(k) || kl.includes("websocket") || kl.includes("token")) {
            if (v && typeof v === "object") {
              hits.push({ path: p, type: Array.isArray(v) ? "array" : "object", keys: Object.keys(v).slice(0, 20), note: "object: keys listed, values masked below as leaf hits" });
            } else {
              hits.push({ path: p, type: typeof v, length: typeof v === "string" ? v.length : null, masked: mask(v) });
            }
          }
          walk(v, p);
        }
      }
    }
  }
  let parseNote = "";
  let parsed = null;
  try {
    parsed = JSON.parse(rawText);
    walk(parsed, "");
    parseNote = "JSON parse ok";
  } catch (e) {
    parseNote = `JSON parse failed: ${String(e.message).slice(0, 200)}`;
  }
  write("B06_recursive_search.json", JSON.stringify({
    task: "B06 browser-session initial-dynamic",
    room: ROOM,
    fetched_at: fetchedAt,
    url: fetched.url || apiUrl,
    status: fetched.status,
    response_bytes: respLen,
    response_sha256: respSha,
    parse_note: parseNote,
    hits,
  }, null, 2));

  // 主 WS token 是否找到：websocket.token 叶节点
  const mainWsTokenHit = hits.find((h) => h.path === "websocket.token" || h.path.endsWith(".websocket.token"));
  const mainWsUrlHit = hits.find((h) => h.path === "websocket.url" || h.path.endsWith(".websocket.url"));
  const appsTokenHit = hits.find((h) => h.path === "websocketApps.token" || h.path.endsWith(".websocketApps.token"));

  // ── 第 4 步：B06 验收报告 ──
  write("B06_Report.md",
    `# 任务 B06 验收报告（阶段08补充）\n\n` +
    `- 时间：${iso(startedAt)}\n- 房间：${ROOM}\n` +
    `- 浏览器会话：Playwright 打开房间页，等 10 秒自然建立 Cookie 后页面内同源 fetch（未手工拼 Cookie，未复制其他会话 JWT）\n` +
    `- 请求：${fetched.url || apiUrl}\n- 获取时间：${fetchedAt}\n` +
    `- HTTP 状态：${fetched.status}\n- 响应体：${respLen} 字节，sha256 ${respSha}\n` +
    `- 解析：${parseNote}\n- 递归命中数：${hits.length}\n\n` +
    `## B3 对账（3209 vs 3309）\n\n` +
    `- B01_connection_metadata.json：sha256 ${b3["B01_connection_metadata.json"].sha256}，其中 len 提及 ${JSON.stringify(b3["B01_connection_metadata.json"].len_mentions)}\n` +
    `- B04_subscription_result.json：sha256 ${b3["B04_subscription_result.json"].sha256}，其中 len 提及 ${JSON.stringify(b3["B04_subscription_result.json"].len_mentions)}\n` +
    `- B05_B_Acceptance_Report.md：sha256 ${b3["B05_B_Acceptance_Report.md"].sha256}，其中 len 提及 ${JSON.stringify(b3["B05_B_Acceptance_Report.md"].len_mentions)}\n` +
    `- 结论：以服务器文件原文为准。本地脚本核查：B01/B04/B05 三处写入的是同一个计算值（fetchNote），脚本里没有 3309 这个字面量；若文件原文确实不一致，以上哈希与提及值为准，另行记录，不改动原始文件。\n\n` +
    `## 主 WS token 是否找到\n\n` +
    `- websocket.url：${mainWsUrlHit ? `找到（${mainWsUrlHit.path}，${mainWsUrlHit.masked}）` : "未找到"}\n` +
    `- websocket.token：${mainWsTokenHit ? `找到（${mainWsTokenHit.path}，${mainWsTokenHit.masked}）` : "未找到"}\n` +
    `- websocketApps.token：${appsTokenHit ? `找到（${appsTokenHit.path}，${appsTokenHit.masked}）` : "未找到"}（仅记录，不用于主 WS）\n` +
    `- 全部命中见 B06_recursive_search.json（路径、类型、长度、脱敏值；完整 JWT 仅存于受限文件 .initial-dynamic-raw.json）\n\n` +
    `## 会话条件对比\n\n` +
    `- v2 Playwright 会话：拿到过主 WS token。\n- 阶段08-B Node 直接请求（无 Cookie）：未拿到。\n` +
    `- 本轮 B06 浏览器会话（带自然 Cookie）：${mainWsTokenHit ? "拿到" : "未拿到"}。\n` +
    `- 事实：以上三者均为实测。Cookie 是否影响 token 发放，需结合本轮结果判断，未证实的不写成事实。\n\n` +
    `## 下一步\n\n` +
    `- ${mainWsTokenHit && mainWsUrlHit ? "已发现有效主 WS URL 与 token，B07（连接验证）待总控批准后执行。" : "未发现有效主 WS URL/token，B07 不执行；不改用 extensions token。"}\n`);
  console.log(`DONE-B06 status=${fetched.status} bytes=${respLen} hits=${hits.length} main_token=${mainWsTokenHit ? "FOUND" : "NOT_FOUND"}`);
})().catch((e) => {
  console.error("FATAL-B06", e && e.message || e);
  process.exit(1);
});
