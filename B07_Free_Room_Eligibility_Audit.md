# 免费直播间资格核验审计（阶段08 · B07-C 封存轮）

- 生成时间：2026-11-15（阶段08，B07-C 封存轮）
- 授权边界：仅限免费、公开、未锁定直播间；本轮不进行直播频道订阅，不进行播放验证，不请求子播放列表，不请求媒体分片，不重新获取 Token，不重新连接主 WS，不启动浏览器。
- 最终结论：**NO_VERIFIED_FREE_PUBLIC_ROOM**（无符合条件的已验证免费公开房间）

## 一、核验方法与允许的数据来源

本轮仅使用已保存的证据，未产生任何新请求：

1. 已保存的免费直播列表响应：`~/workspace/user/files/list.json`（后端归一化输出，daddies 分类第 1 页，37 间，`fetchedAt` 2026-11-14T16:52:39.619Z）；`~/workspace/xlive-test/list-test.json`（同一分类另一轮取样，`fetchedAt` 2026-11-14T17:00:25.859Z，37 间）。
2. 已保存的房间公开元数据：`~/workspace/user/files/upload.txt`（RoboticPower7 房间页源码，421KB，2026-11-15 约 11:02 由总控手机上传）；`~/workspace/xlive-ws/room.html`（RoboticPower7 房间页，306947 字节，2026-11-15 11:15）。
3. 已有的历史静态分析结果：`~/workspace/xlive-ws/Centrifugo-WS-反推报告.md`（2026-11-15 11:24）。
4. 已有的只读报告：`~/workspace/xlive-ws/v2/` 四份 v2 交付物（原始脱敏日志、WS 双向消息记录、API 请求汇总、播放器及 M3U8 分析报告，2026-11-15 13:50）；`~/workspace/xlive-ws/stage08/` 阶段 08 报告（A05、A06、B03、B06 补充、B07 预检、B07-C）。
5. 已有的只读记录：`~/memory/2026-11-15.md`（当日工作记录，含 cam 接口定论与房间观察摘要）。

判定标准（按总控指令）：仅当有明确、可复核的公开免费证据时方可判为 FREE_PUBLIC；以下信息单独或组合均不足以判定 FREE_PUBLIC：列表中存在房间、房间可以打开页面、房间返回普通 HTTP 200、房间有播放按钮、房间没有显示价格、房间存在公开 ID。权限状态不明确者一律判 UNKNOWN，不得作为免费房间处理。

## 二、证据局限性（影响全部候选房间）

1. **列表文件无价格/锁定/免费字段。** `list.json` 与 `list-test.json` 的房间对象仅含 10 个字段：`id`、`title`、`username`、`cover`、`isOnline`、`isLive`、`status`、`viewers`、`duration`、`streamName`。其中没有任何字段表示免费、价格、付费墙、锁定或会员限制。`status` 仅为站方节目类型标签（`public` / `groupShow`），已保存证据中没有任何来源定义 `public` 等于“免费观看”，其含义按指令属于“字段含义不明”。
2. **直播状态证据已过期。** 列表取样时间为 2026-11-14 16:52 UTC（北京时间 11-15 00:52）与 17:00 UTC，距本轮核验约 16 小时。两轮取样仅相隔约 8 分钟，内容即已变化（`public` 35 → 34 间，`groupShow` 2 → 3 间，新增 `kimze7`；`taiwanboybigtop1069` 观众数 19 → 15，`linhfag` 观众数 29 → 23），证明房间状态高频变动，过期取样不能证明房间当前仍在直播。本轮授权禁止重新核验，因此全部房间的当前直播活动状态均无法确认。
3. **无任何房间保存有付费或锁定证据。** 已保存证据中没有任何房间出现价格、购买限制、密码、会员限制字段，因此 PAID 与 LOCKED 的计数均为 0——这不是“已证免费”，而是“无此维度证据”。
4. **cam 接口响应未保存为文件。** RoboticPower7 的 cam 接口响应（`user.status: "public"` 等）仅记录于对话与 `~/memory/2026-11-15.md`，完整 JSON 未落盘为文件，不可作为文件级复核证据引用。

## 三、候选房间分类汇总

| 分类 | 数量 | 说明 |
|---|---|---|
| FREE_PUBLIC | 0 | 无房间满足“明确、可复核的公开免费证据” |
| PAID | 0 | 已保存证据中无任何房间含付费/价格/购买限制证据 |
| LOCKED | 0 | 已保存证据中无任何房间含锁定/密码/会员限制证据 |
| UNKNOWN | 39 | 37 间列表房间 + RoboticPower7 + Makusi-08，见下 |
| INACTIVE | 0 | 无房间有已下线/无直播的直接证据（过期取样不等于下线证据） |

## 四、列表房间逐间记录（`list.json`，daddies 第 1 页，取样 2026-11-14T16:52:39.619Z）

共同证据来源文件：`~/workspace/user/files/list.json`
共同原始字段路径：`rooms[].id` / `rooms[].username` / `rooms[].status` / `rooms[].isLive` / `rooms[].isOnline` / `rooms[].viewers` / `rooms[].duration`
共同免费状态证据：无（文件无免费/价格字段；`status` 含义未定义）
共同锁定状态证据：无（文件无锁定/会员字段）
共同直播活动状态证据：取样时刻 `isLive=true`、`isOnline=true`（已过期约 16 小时，当前状态无法确认）
共同分类结果：UNKNOWN
共同置信度：无法评估（证据不足，无法判定）
共同未解决问题：`status` 标签是否等同免费无定义；当前是否仍在直播无法确认；是否存在未记录的付费/锁定条件无法排除

| 房间 ID | 公开名称 | status | 在播（取样时） | 在线（取样时） | 观众 | 已播秒数 |
|---|---|---|---|---|---|---|
| 185707842 | taiwanboybigtop1069 | groupShow | 是 | 是 | 19 | 537 |
| 231951792 | kimze7 | public | 是 | 是 | 92 | 753 |
| 277316005 | linhfag | groupShow | 是 | 是 | 29 | 353 |
| 245953511 | Buon_cua_anh86 | public | 是 | 是 | 37 | 2980 |
| 284720539 | youngboy33 | public | 是 | 是 | 19 | 1896 |
| 276676311 | JoeGiorgos | public | 是 | 是 | 19 | 668 |
| 248679367 | AmicisegretiITA | public | 是 | 是 | 17 | 443 |
| 246368044 | silverfawkesx | public | 是 | 是 | 61 | 3780 |
| 290165551 | luke_009 | public | 是 | 是 | 3 | 2263 |
| 55687179 | eros-steel | public | 是 | 是 | 97 | 2451 |
| 13342603 | MarisMuscle | public | 是 | 是 | 1 | 3374 |
| 283204243 | tukemon_ | public | 是 | 是 | 2 | 192 |
| 259174309 | akito_elm2 | public | 是 | 是 | 66 | 2926 |
| 238182563 | Moeblick | public | 是 | 是 | 16 | 2252 |
| 249013821 | youta200 | public | 是 | 是 | 19 | 3534 |
| 107779555 | BrutusK08 | public | 是 | 是 | 7 | 8963 |
| 174014265 | dantedesirexx | public | 是 | 是 | 16 | 582 |
| 101488353 | jax_luna | public | 是 | 是 | 6 | 2041 |
| 227446125 | DOMINICKVEGAS77 | public | 是 | 是 | 12 | 1909 |
| 205426919 | Dilfcam101 | public | 是 | 是 | 5 | 55 |
| 276875581 | hernan198o | public | 是 | 是 | 5 | 765 |
| 239235153 | Myhornypll | public | 是 | 是 | 2 | 360 |
| 133643528 | Antonywebb94 | public | 是 | 是 | 12 | 813 |
| 173143359 | tony_muscle | public | 是 | 是 | 1 | 2964 |
| 233907677 | Dante_Bellini | public | 是 | 是 | 6 | 1791 |
| 242092081 | Alessrose | public | 是 | 是 | 15 | 6835 |
| 231709680 | jonas_camboy | public | 是 | 是 | 4 | 410 |
| 169827241 | flexforyou | public | 是 | 是 | 4 | 588 |
| 189935426 | TheNightPorter | public | 是 | 是 | 10 | 2537 |
| 12329360 | Loncoc | public | 是 | 是 | 4 | 100 |
| 202696888 | Bols777 | public | 是 | 是 | 15 | 225 |
| 197556323 | icejuljulju | public | 是 | 是 | 24 | 5492 |
| 264291697 | mrbighairychest | public | 是 | 是 | 4 | 2265 |
| 253506983 | coupleinblack | public | 是 | 是 | 19 | 4805 |
| 131533189 | Vince_Reynolds | public | 是 | 是 | 1 | 2728 |
| 233492299 | hot_womain | public | 是 | 是 | 0 | 285 |
| 104319928 | JesuAdam | public | 是 | 是 | 1 | 14687 |

补充说明：

- 两间 `groupShow` 房间（185707842、277316005）同样判 UNKNOWN：`groupShow` 仅表示当时正在进行群组节目，已保存证据中无 `groupShowType`（如 `ticket`）字段，无法确认入场是否需要购票；不得仅凭节目类型推断为 PAID，也不得推断为免费。
- `list-test.json`（17:00:25Z 取样）与 `list.json` 为同一分类的两轮取样，房间集合高度重合但不完全一致；本表以 `list.json` 为准，差异已在第二节第 2 点记录。
- 全部 37 间均无 `streamName` 以外可用于订阅的额外信息；本轮未推导任何订阅参数。

## 五、重点房间逐间记录

### 5.1 RoboticPower7（房间 ID 109870623）

- 房间 ID：109870623
- 公开名称：RoboticPower7
- 证据来源文件：`~/workspace/user/files/upload.txt`（房间页源码）；`~/workspace/xlive-ws/room.html`（房间页）；`~/workspace/xlive-ws/v2/` 四份 v2 交付物；`~/memory/2026-11-15.md`（cam 接口记录）
- 原始字段路径：`upload.txt` 内 `"status":"public"`（出现 2 次）；v2 API 汇总 `models/109870623/*`；`~/memory/2026-11-15.md` cam 节记录 `user.status: "public"`、`isCamAvailable/isCamActive: true`
- 免费状态证据：无明确证据。页面在 Playwright v1/v2 会话中可无登录加载、播放器曾尝试加载 master 播放列表（216 次请求，0 次成功响应，全部解码失败），但按指令“房间可以打开页面”“房间有播放按钮”均不足以判定免费；`status: "public"` 的含义在已保存证据中无定义；cam 完整响应未保存为文件。
- 锁定状态证据：无（无锁定/会员字段；v2 会话中未遇到登录墙或付费提示，但“未遇到”不等于“已证无限制”）。
- 直播活动状态证据：v2 会话（2026-11-15 13:29–13:31）与 B06 浏览器会话（2026-11-15 15:36）均成功打开房间页，取样时在播；当前状态无法确认（本轮禁止重新核验）。
- 分类结果：UNKNOWN
- 置信度：无法评估（证据不足，无法判定）
- 未解决问题：`public` 是否等同免费无定义；播放从未实际开始（播放器错误码 4，未见直播画面），“可观看”本身未经证实；当前是否仍在直播无法确认。

### 5.2 Makusi-08（房间 ID 288390619）

- 房间 ID：288390619
- 公开名称：Makusi-08
- 证据来源文件：无独立保存的房间数据文件；观察记录仅见于对话记录与 `~/memory/2026-11-15.md`（2026-11-15 07:17 JS 分析节、10:44 Exp 3 节）
- 原始字段路径：无文件级字段路径
- 免费状态证据：无明确证据。云端浏览器会话曾观察到房间页无登录加载并播放（约 10:44–10:53，观众约 164–178），但该观察未保存为文件，且按指令“房间可以打开页面”不足以判定免费。
- 锁定状态证据：无。
- 直播活动状态证据：最后一次观察约 2026-11-15 10:53，距今约 6 小时；当前状态无法确认。
- 分类结果：UNKNOWN
- 置信度：无法评估（证据不足，无法判定）
- 未解决问题：无文件级证据；当前是否仍在直播无法确认。

## 六、结论

**NO_VERIFIED_FREE_PUBLIC_ROOM**——在已保存证据范围内，没有任何房间满足 FREE_PUBLIC 的判定标准。本轮未降低标准，未将 UNKNOWN 房间作为免费房间提交。

后续若需获得一个可测试的 FREE_PUBLIC 房间，至少需要以下新增证据（均超出本轮授权，需总控另行指令）：

1. 站方以明确字段或文档定义某一状态值等同免费公开观看；或
2. 在授权会话中实时确认目标房间当前在播、无登录墙、无付费提示且播放器实际出画面，并将完整响应保存为文件。

在获得上述证据并经总控批准之前，B07-S 订阅验证无可用目标房间。
