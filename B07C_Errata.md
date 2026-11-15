# B07-C 勘误（Errata）

- 适用报告：`B07C_Connect_Audit.md`（2026-11-15 16:15 生成，2154 字节，sha256 `8c5637446aa1c35e7453bfacb8e09e8fe5d516cfa714da8f729efc76fdf5a2d6`）
- 适用脚本：`stage08-b07c-connect.js`（17362 字节，GitHub commit `653e955a`）
- 本文件为新增勘误，不修改原始报告。原始报告内容保持原样，以下两项以本文件为准。

## 勘误 1：响应等待计时器

原脚本将：

`CONNECT_TIMEOUT_MS + RESPONSE_TIMEOUT_MS`

作为响应计时器时长，即 15000 + 20000 = 35000ms。

因此它实际从连接启动后计时 35 秒，并非 connect 帧发送后独立等待 20 秒。

本次服务端在约 245ms 内返回响应（connect 帧发送于 2026-11-15T08:15:04.945Z，响应收到于 2026-11-15T08:15:05.190Z），因此不影响本次结果，但脚本计时实现与原授权说明不完全一致。

核对依据（本地脚本原文）：

- `stage08-b07c-connect.js` 第 45–46 行：`CONNECT_TIMEOUT_MS = 15000`，`RESPONSE_TIMEOUT_MS = 20000`
- 第 230–235 行：`responseTimer` 的 `setTimeout` 时长为 `CONNECT_TIMEOUT_MS + RESPONSE_TIMEOUT_MS`，但其超时日志文本写的是 `no connect response within ${RESPONSE_TIMEOUT_MS}ms after send`，两者不一致
- 第 173–177 行另有独立的 `OVERALL_TIMEOUT_MS = 60000` 总计时器，不受本勘误影响

## 勘误 2：WebSocket close code 1005

1005 表示未记录到 Close 帧中的状态码，不应表述为服务端明确返回正常关闭码。

根据本次日志，客户端在收到 connect 响应后主动调用关闭操作，随后收到 close 事件。

准确表述：

“收到 connect 响应后，客户端主动发起连接清理；关闭事件记录的状态码为 1005，未记录到对端提供的关闭状态码。”

核对依据（执行日志原文）：

- `B07C_Execution_Log.jsonl` 第 8 行：`{"t":"2026-11-15T08:15:05.439Z","stage":"B07-C-01","event":"CLOSE","detail":"code=1005 reason="}`
- 原始报告中的 `connection closed and cleaned up` 仅说明连接已关闭并清理，未声称 1005 是服务端返回的正常关闭码；本勘误用于防止将 1005 误读为对端正常关闭的确认。
