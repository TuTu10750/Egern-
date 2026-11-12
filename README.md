# Egern-

Egern 远程规则集：Cue by Manus 分流。

## 文件

- `Cue.yaml` — Egern 原生 YAML 规则集
- `Cue.list` — Surge 格式规则集（Egern 也支持）

## 规则统计

3 条 `domain_suffix_set`，全部走代理：

- `cue.im` — Cue 官方入口
- `manus.im` — Manus 网页版
- `manus.ai` — Manus 主域名，包含 `api.manus.ai`、`open.manus.ai` 等子域名

Manus / Cue 未公布官方完整域名清单，以上为根据公开资料整理的最小核心集。

## 永久链接

```text
https://raw.githubusercontent.com/TuTu10750/Egern-/main/Cue.yaml
https://raw.githubusercontent.com/TuTu10750/Egern-/main/Cue.list
```

## 在 Egern 里使用

方法一（Safari 自动导入，策略为智能选优）：

```text
egern:/rules/new?type=rule_set&match=https%3A%2F%2Fraw.githubusercontent.com%2FTuTu10750%2FEgern-%2Fmain%2FCue.yaml&policy=%E6%99%BA%E8%83%BD%E9%80%89%E4%BC%98
```

把上面这行复制到 Safari 地址栏，点前往，按提示用 Egern 打开即可。

方法二（手动）：Egern → 工具 → 规则 → + → 类型选 rule-set，粘贴上面的 raw 链接，策略选智能选优。

## 更新

2026-11-12：首次提交。
