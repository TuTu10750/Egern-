# B07-C 协议版本差异记录

- 生成时间：2026-11-15（阶段08，B07-C 封存轮）
- 依据：两次独立实测的服务端 connect 响应（脱敏值，原始证据见各轮报告）

## 实测版本对照

| 端点 | 已实测版本 | 实测来源 |
|---|---|---|
| 主房间 WS（`wss://websocket-v6.xlivesex.com/connection/websocket`） | 6.7.2 OSS | B07-C，2026-11-15 16:15，`B07C_Connect_Response.json`：connect 响应 `{"id":1,"connect":{"client":"00813c25-222f-4388-8aba-5e9e5d2024a8","version":"6.7.2 OSS","ping":25,"pong":true}}` |
| extensions WS（`wss://websocket-extensions-v6.xlivesex.com/connection/websocket`） | 6.2.0 OSS | v1（2026-11-15 13:02–13:03）与 v2（2026-11-15 13:29–13:31）两次 Playwright 捕获，connect 响应均为 `version":"6.2.0 OSS","ping":25,"pong":true`，见 `~/workspace/xlive-ws/v2/v2-WS双向消息记录.md` |

## 明确说明

- 两者是不同端点（主房间 WS 与 extensions WS 的 URL、Token 来源均不同，见 `B07_Preflight_Audit.md`）。
- 两次实测返回不同版本（主 WS 6.7.2 OSS，extensions WS 6.2.0 OSS）。
- 不得将 extensions 的 6.2.0 协议观察直接视为主 WS 的完整协议证据。
- 后续主 WS 协议分析应以主 WS 实测的 6.7.2 OSS 为基准。
- 不能仅凭版本差异推断服务端内部架构（例如不得推断两者是否同源部署、是否共享认证逻辑、版本高低是否对应功能差异）。
- websocketApps WS（`wss://websocket-apps.xlivesex.com/connection/websocket`）尚未实测连接，无版本记录，不得用上述任一版本代替。
