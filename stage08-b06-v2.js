/**
 * 阶段08 任务 B06 v2：浏览器真实会话取证（分阶段、可定位、可中断、可恢复）
 *
 * v1 教训：脚本 900 秒超时无输出，挂在哪一步完全看不到。v2 把任务拆成
 * 7 个独立阶段，每阶段 30 秒硬超时，开始与结束都打印日志并立即落盘，
 * 前面完成的阶段不因后面失败而丢失。
 *
 * 阶段：
 *   B06-01 启动浏览器、记录启动状态（30 秒）
 *   B06-02 打开目标免费房间页面（30 秒）
 *   B06-03 等待页面必要状态，不无限等待（30 秒）
 *   B06-04 通过浏览器真实会话请求 initial-dynamic（30 秒，AbortController）
 *   B06-05 保存原始响应并记录字节数、SHA256（30 秒）
 *   B06-06 对完整 JSON 递归检索（本地执行）
 *   B06-07 输出字段路径、类型、长度和脱敏结果（本地执行）
 *
 * 关键约束：使用浏览器自然建立的正常访客或登录会话，不手工拼接 Cookie，
 * 不借用其他会话的 JWT，也不使用 extensions WS Token 代替主 WS Token。
 *
 * 输出（全部在 OUT_DIR，默认 /opt/xlive/stage08）：
 *   B06_stage_progress.jsonl   每阶段开始/结束日志（实时追加，挂住也能定位）
 *   .initial-dynamic-raw.json  完整响应原文（0600 受限文件，不进报告）
 *   B06_response_meta.json     响应元数据：状态、字节数、SHA256、时间、URL
 *   B06_recursive_search.json  递归检索命中：路径、类型、长度、脱敏值
 *   B06_Report.md              验收报告：各阶段结果、是否找到主 WS token、
 *                              会话条件对比、事实与推断分开
 *
 * 保护：不伪造凭证；不修改 v1/v2 日志、8787 服务、Xray/VPN；不做 B07；
 * 超时后主动清理页面、浏览器进程及临时资源；完整 JWT 只留在受限文件里。
 *
 * 用法：node stage08-b06-v2.js [房间用户名]   例：node stage08-b06-v2.js RoboticPower7
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOM = process.argv[2] || "RoboticPower7";
const OUT_DIR = process.env.OUT_DIR || "/opt/xlive/stage08";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.0 Safari/605.1.15";
const STAGE_TIMEOUT_MS = 30000;

fs.mkdirSync(OUT_DIR, { recursive: true });
const startedAt = new Date();
const iso = (d) => d.toISOString();
const progressFile = path.join(OUT_DIR, "B06_stage_progress.jsonl");
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
function mask(v) {
  const s = String(v == null ? "" : v);
  if (s.length <= 12) return "***";
  return s.slice(0, 6) + "…" + s.slice(-4) + ` (len=${s.length})`;
}
// 每阶段开始/结束都打印并立即落盘
function stageLog(id, name, event, detail) {
  const rec = { t: iso(new Date()), stage: id, name, event, detail: detail || "" };
  console.log(`[${rec.t}] ${id} ${name} ${event} ${rec.detail}`);
  try { fs.appendFileSync(progressFile, JSON.stringify(rec) + "\n"); } catch (_) {}
}
// 单阶段硬超时
function withTimeout(promise, ms, label) {
  let timer = null;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timeout ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
async function runStage(id, name, fn) {
  const t0 = Date.now();
  stageLog(id, name, "START", "");
  try {
    const result = await withTimeout(fn(), STAGE_TIMEOUT_MS, `${id} ${name}`);
    stageLog(id, name, "END", `ok ${Date.now() - t0}ms`);
    return { ok: true, result, ms: Date.now() - t0 };
  } catch (e) {
    const stack = (e && e.stack || String(e)).slice(0, 1500);
    stageLog(id, name, "END", `FAIL ${Date.now() - t0}ms: ${String(e && e.message || e).slice(0, 300)}`);
    return { ok: false, error: String(e && e.message || e).slice(0, 500), stack, ms: Date.now() - t0 };
  }
}

(async () => {
  const results = {};
  let browser = null;
  let page = null;
  let failedStage = null;

  try {
    // ── B06-01 启动浏览器 ──
    const s01 = await runStage("B06-01", "launch-browser", async () => {
      const { chromium } = require("playwright");
      browser = await chromium.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-dev-shm-usage"],
      });
      const ctx = await browser.newContext({ userAgent: UA });
      page = await ctx.newPage();
      return { launched: true };
    });
    results["B06-01"] = s01;
    if (!s01.ok) failedStage = "B06-01";

    // ── B06-02 打开房间页 ──
    if (!failedStage) {
      const s02 = await runStage("B06-02", "open-room-page", async () => {
        await page.goto(`https://zh.xlivesex.com/${ROOM}`, { waitUntil: "domcontentloaded", timeout: 25000 });
        return { url: page.url() };
      });
      results["B06-02"] = s02;
      if (!s02.ok) failedStage = "B06-02";
    }

    // ── B06-03 等待页面必要状态 ──
    if (!failedStage) {
      const s03 = await runStage("B06-03", "wait-page-state", async () => {
        await page.waitForTimeout(5000);
        const state = await page.evaluate(() => ({
          videoCount: document.querySelectorAll("video").length,
          bodyTextLen: (document.body && document.body.innerText || "").length,
          title: document.title || "",
        }));
        return state;
      });
      results["B06-03"] = s03;
      if (!s03.ok) failedStage = "B06-03";
    }

    // ── B06-04 浏览器真实会话请求 initial-dynamic ──
    let fetched = null;
    if (!failedStage) {
      const apiUrl = `/api/front/v3/config/initial-dynamic?requestPath=%2F${ROOM}`;
      const s04 = await runStage("B06-04", "fetch-initial-dynamic", async () => {
        fetched = await page.evaluate(async (apiUrl) => {
          const t0 = new Date().toISOString();
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 25000);
          try {
            const res = await fetch(apiUrl, { headers: { Accept: "application/json" }, signal: ctrl.signal });
            const text = await res.text();
            clearTimeout(timer);
            return { status: res.status, text, fetchedAt: t0, url: res.url };
          } catch (e) {
            clearTimeout(timer);
            return { status: 0, text: "", fetchedAt: t0, url: apiUrl, error: String(e && e.name ? `${e.name}: ${e.message}` : e).slice(0, 200) };
          }
        }, apiUrl);
        return { status: fetched.status, bytes: Buffer.byteLength(fetched.text || "", "utf8") };
      });
      results["B06-04"] = s04;
      if (!s04.ok) failedStage = "B06-04";
    }

    // ── B06-05 保存原始响应并记录字节数、SHA256 ──
    let respMeta = null;
    if (!failedStage) {
      const s05 = await runStage("B06-05", "save-raw-response", async () => {
        const rawText = fetched.text || "";
        const rawBuf = Buffer.from(rawText, "utf8");
        writeRestricted(".initial-dynamic-raw.json", rawText);
        respMeta = {
          status: fetched.status,
          url: fetched.url || `/api/front/v3/config/initial-dynamic?requestPath=%2F${ROOM}`,
          fetched_at: fetched.fetchedAt || iso(new Date()),
          response_bytes: rawBuf.length,
          response_sha256: sha256buf(rawBuf),
          fetch_error: fetched.error || null,
        };
        write("B06_response_meta.json", JSON.stringify(respMeta, null, 2));
        return respMeta;
      });
      results["B06-05"] = s05;
      if (!s05.ok) failedStage = "B06-05";
    }

    // ── B06-06 递归检索 ──
    let hits = [];
    let parseNote = "";
    if (!failedStage) {
      const s06 = await runStage("B06-06", "recursive-search", async () => {
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
                    hits.push({ path: p, type: Array.isArray(v) ? "array" : "object", keys: Object.keys(v).slice(0, 20), note: "object: keys listed; leaf values appear as separate hits" });
                  } else {
                    hits.push({ path: p, type: typeof v, length: typeof v === "string" ? v.length : null, masked: mask(v) });
                  }
                }
                walk(v, p);
              }
            }
          }
        }
        let parsed = null;
        try {
          parsed = JSON.parse(fetched.text || "");
          walk(parsed, "");
          parseNote = "JSON parse ok";
        } catch (e) {
          parseNote = `JSON parse failed: ${String(e.message).slice(0, 200)}`;
        }
        return { hits: hits.length, parseNote };
      });
      results["B06-06"] = s06;
      if (!s06.ok) failedStage = "B06-06";
    }

    // ── B06-07 输出字段路径、类型、长度和脱敏结果 ──
    if (!failedStage) {
      const s07 = await runStage("B06-07", "write-results", async () => {
        write("B06_recursive_search.json", JSON.stringify({
          task: "B06 browser-session initial-dynamic v2",
          room: ROOM,
          fetched_at: respMeta.fetched_at,
          url: respMeta.url,
          status: respMeta.status,
          response_bytes: respMeta.response_bytes,
          response_sha256: respMeta.response_sha256,
          parse_note: parseNote,
          hits,
        }, null, 2));
        return { hits: hits.length };
      });
      results["B06-07"] = s07;
      if (!s07.ok) failedStage = "B06-07";
    }
  } finally {
    // 超时或失败后主动清理
    try { if (page) await page.close(); } catch (_) {}
    try { if (browser) await browser.close(); } catch (_) {}
    stageLog("B06-CLEANUP", "cleanup", "END", failedStage ? `stopped at ${failedStage}` : "all stages done");
  }

  // ── 验收报告（无论成败都写出，前面完成的阶段不丢失）──
  const mainWsTokenHit = hits.find((h) => h.path === "websocket.token" || h.path.endsWith(".websocket.token"));
  const mainWsUrlHit = hits.find((h) => h.path === "websocket.url" || h.path.endsWith(".websocket.url"));
  const appsTokenHit = hits.find((h) => h.path === "websocketApps.token" || h.path.endsWith(".websocketApps.token"));
  const stageLines = Object.keys(results).map((k) => {
    const r = results[k];
    return `- ${k}：${r.ok ? "完成" : "失败"}（${r.ms}ms）${r.ok ? "" : "——" + (r.error || "")}`;
  }).join("\n");
  write("B06_Report.md",
    `# 任务 B06 验收报告（阶段08补充，v2 分阶段版）\n\n` +
    `- 时间：${iso(startedAt)}\n- 房间：${ROOM}\n` +
    `- 浏览器会话：Playwright 打开房间页，自然建立 Cookie 后页面内同源 fetch（未手工拼 Cookie，未复制其他会话 JWT）\n` +
    `- 各阶段结果：\n${stageLines || "- （无阶段记录）"}\n` +
    (failedStage ? `- 中断于：${failedStage}\n` : `- 全部 7 个阶段完成。\n`) +
    (results["B06-05"] && results["B06-05"].ok
      ? `- 响应：状态 ${results["B06-05"].result.status}，${results["B06-05"].result.response_bytes} 字节，sha256 ${results["B06-05"].result.response_sha256}，获取时间 ${results["B06-05"].result.fetched_at}\n- 解析：${parseNote}\n- 递归命中数：${hits.length}\n`
      : `- 响应：未保存（中断于 ${failedStage || "未知阶段"}）。\n`) +
    `\n## 主 WS token 是否找到\n\n` +
    `- websocket.url：${mainWsUrlHit ? `找到（${mainWsUrlHit.path}，${mainWsUrlHit.masked}）` : "未找到"}\n` +
    `- websocket.token：${mainWsTokenHit ? `找到（${mainWsTokenHit.path}，${mainWsTokenHit.masked}）` : "未找到"}\n` +
    `- websocketApps.token：${appsTokenHit ? `找到（${appsTokenHit.path}，${appsTokenHit.masked}）` : "未找到"}（仅记录，不用于主 WS）\n` +
    `- 全部命中见 B06_recursive_search.json（路径、类型、长度、脱敏值；完整 JWT 仅存于受限文件 .initial-dynamic-raw.json）\n\n` +
    `## 会话条件对比\n\n` +
    `- v2 Playwright 会话：拿到过主 WS token。\n- 阶段08-B Node 直接请求（无 Cookie）：未拿到。\n` +
    `- 本轮 B06 浏览器会话（带自然 Cookie）：${mainWsTokenHit ? "拿到" : (failedStage ? "未完成取证" : "未拿到")}。\n` +
    `- 事实：以上三者均为实测。Cookie 是否影响 token 发放，需结合本轮结果判断，未证实的不写成事实。\n\n` +
    `## 下一步\n\n` +
    `- ${mainWsTokenHit && mainWsUrlHit ? "已发现有效主 WS URL 与 token，B07（连接验证）待总控批准后执行。" : "未发现有效主 WS URL/token，B07 不执行；不改用 extensions token。"}\n`);
  console.log(`DONE-B06 failed_stage=${failedStage || "none"} hits=${hits.length} main_token=${mainWsTokenHit ? "FOUND" : "NOT_FOUND"}`);
  process.exit(failedStage ? 2 : 0);
})().catch((e) => {
  console.error("FATAL-B06", e && e.stack ? String(e.stack).slice(0, 1500) : String(e));
  process.exit(1);
});
