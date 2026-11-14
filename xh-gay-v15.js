/**
 * Rex 模块：XH Gay（zh.xhzone.life 镜像站，主站 zh.xhofficial.com 在用户网络下无法访问）
 *
 * 契约严格对照 C:\Users\Fox-OS\Downloads\user.one.js（ONE一个 v2.2.0，Rex 已装成功）：
 *   - 条目 type: "detail"（不是 widget）
 *   - 条目入口字段 link
 *   - 顶层 loadDetail(link) 接收字符串 link
 *   - 顶层 search: { title, functionName, params }
 *   - 每个 module 带 requiresWebView: false
 *   - 只有 loadResource 带 type: "stream"
 *   - 顶层 detailCacheDuration
 *   - loadResource 返回 [{ name, description, url }]
 *   - childItems 承载多线路，每项 type: "url"
 */

WidgetMetadata = {
  id: "user.xhgay15",
  title: "XH Gay",
  description: "zh.xhzone.life 男同视频 · 最新/热门/分类/搜索，HLS 直连",
  author: "YG",
  version: "1.1.5",
  requiredVersion: "0.0.1",
  detailCacheDuration: 30,
  site: "https://zh.xhzone.life",
  iconurl: "https://zh.xhzone.life/favicon.ico",

  search: {
    title: "搜索 XH Gay",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "" },
    ],
  },

  modules: [
    {
      id: "xh-resource",
      title: "播放资源",
      description: "按需解析 XH 播放地址（详情页调用）",
      requiresWebView: false,
      cacheDuration: 0,
      functionName: "loadResource",
      type: "stream",
      params: [
        { name: "link", title: "详情链接", type: "input", value: "" },
        { name: "title", title: "标题", type: "input", value: "" },
      ],
    },
    {
      id: "xh-home",
      title: "首页",
      description: "XH Gay 首页推荐",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "home" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-newest",
      title: "最新",
      description: "按上传时间倒序",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "newest" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-best",
      title: "热门",
      description: "按热度排序",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "best" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-group-production",
      title: "生产",
      description: "生产 · 16 个小分类",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "group-production" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-group-actions",
      title: "行动",
      description: "行动 · 27 个小分类",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "group-actions" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-group-fetish",
      title: "恋物癖",
      description: "恋物癖 · 15 个小分类",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "group-fetish" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-group-orientation",
      title: "方向",
      description: "方向 · 6 个小分类",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "group-orientation" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-group-age",
      title: "年龄",
      description: "年龄 · 8 个小分类",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "group-age" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-group-ethnicity",
      title: "种族",
      description: "种族 · 12 个小分类",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "group-ethnicity" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-group-body",
      title: "身体",
      description: "身体 · 20 个小分类",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "group-body" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-group-hair",
      title: "头发",
      description: "头发 · 1 个小分类",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "group-hair" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-group-numberOfPeople",
      title: "人数",
      description: "人数 · 7 个小分类",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "group-numberOfPeople" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-group-sexToys",
      title: "性玩具",
      description: "性玩具 · 15 个小分类",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "group-sexToys" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-group-apparel",
      title: "衣服",
      description: "衣服 · 9 个小分类",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "group-apparel" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-group-scenario",
      title: "设想",
      description: "设想 · 21 个小分类",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "group-scenario" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-group-location",
      title: "地点",
      description: "地点 · 12 个小分类",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "group-location" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-group-countries",
      title: "国家",
      description: "国家 · 156 个小分类",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "group-countries" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-group-languages",
      title: "语言",
      description: "语言 · 51 个小分类",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "group-languages" },
        { name: "page", title: "页码", type: "page" },
      ],
    },

  ],
};

// ───────────────────────── 常量 ─────────────────────────

var XH_BASE = "https://zh.xhzone.life";
var XH_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

var XH_GROUPS = [{"id": "production", "label": "生产", "cats": [{"slug": "3d", "title": "3D", "poster": "https://ic-tt-nss.xhcdn.com/a/NmM1YzZhMmRjNGQ3NDc0MmIyYjFlYjY3NDAzMzMxY2U/s(w:640,h:360)/tag/000/425/503/9a9b855b.webp"}, {"slug": "show", "title": "Show", "poster": "https://ic-tt-nss.xhcdn.com/a/ZjljZTE2YTQ0Y2U4MDY2MDY0NTYwN2YyNzllMGJjNzY/s(w:640,h:360)/tag/000/451/461/9656663b.jpg"}, {"slug": "voyeur", "title": "偷窥癖", "poster": "https://ic-tt-nss.xhcdn.com/a/OGUwZWE3YzBkODViNzFhMzZmOTljMmJlYmIzNjRlZWQ/s(w:640,h:360)/tag/000/000/186/d552bffb.jpg"}, {"slug": "anime", "title": "动画", "poster": "https://ic-tt-nss.xhcdn.com/a/NTkyYzMzNDM5NTE3N2E5YzJmZmE2OWI3NGQ3ZjM5N2Q/s(w:640,h:360)/tag/000/313/732/66027de5.jpg"}, {"slug": "cartoon", "title": "卡通", "poster": "https://ic-tt-nss.xhcdn.com/a/MWQ0MzZlYzkxNjYxNWNhOTM3N2Q0ZjU0YWU5MzhlYzc/s(w:640,h:360)/tag/000/313/703/951e0d79.jpg"}, {"slug": "compilation", "title": "合集", "poster": "https://ic-tt-nss.xhcdn.com/a/MWIyYTRkZDYwNDE2MTk0ZmQ2MzkyZDg5YjZkMzc5Njc/s(w:640,h:360)/tag/000/366/778/115128d1.jpg"}, {"slug": "vintage", "title": "复古", "poster": "https://ic-tt-nss.xhcdn.com/a/MjgyYTA3MjcxNjAyY2U2NDRjNzc3YzBjMWE2ODdiN2E/s(w:640,h:360)/tag/000/000/185/b118d2f8.jpg"}, {"slug": "homemade", "title": "家庭自制", "poster": "https://ic-tt-nss.xhcdn.com/a/MWMwMGU1ZWQxNjI1NTQxZTUyMzljMjU0YjdhNDNjNDM/s(w:640,h:360)/tag/000/423/722/f3557037.jpg"}, {"slug": "hentai", "title": "成人动漫", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDMyYTQ2YmMxODU3ZGE1YTQwYjY5OWM4NjliZGIwZGE/s(w:640,h:360)/tag/000/313/734/c491216e.jpg"}, {"slug": "close-up", "title": "特写", "poster": "https://ic-tt-nss.xhcdn.com/a/NWE4NjRkYWRhMTQwYWU1NjY1YzlmYWQ4NmE3MjIzMjE/s(w:640,h:360)/tag/000/423/695/636ffe09.jpg"}, {"slug": "reality", "title": "现实", "poster": "https://ic-tt-nss.xhcdn.com/a/Nzc3MmZjYTNkYTlmYjRmZWYxZDJhOGE1N2JiMzU0NWE/s(w:640,h:360)/tag/000/366/679/aee3dbc5.jpg"}, {"slug": "webcam", "title": "直播", "poster": "https://ic-tt-nss.xhcdn.com/a/MzUwZDMxOThhN2YwZDNjYTBjNjBmNjZiZTM2YTk0ZDc/s(w:640,h:360)/tag/000/000/187/5466c841.jpg"}, {"slug": "pov", "title": "第一人称视角", "poster": "https://ic-tt-nss.xhcdn.com/a/YTJlYzRhY2Y0MThjNDBkZGZjYWVlNzA0NmFiZmU5ODA/s(w:640,h:360)/tag/000/366/677/8f1c0c8e.jpg"}, {"slug": "amateur", "title": "素人", "poster": "https://ic-tt-nss.xhcdn.com/a/MmViZDRhYjQyNTAzOWZiMzNhNjc4ZWI1ZGM0NjdjNzY/s(w:640,h:360)/tag/000/000/150/f133c4b7.jpg"}, {"slug": "pornstar", "title": "色情明星", "poster": "https://ic-tt-nss.xhcdn.com/a/Y2Y2NDM2YTMwMzMxMDM5MmM2ZDQ3OWI4ZWNkM2UxNzY/s(w:640,h:360)/tag/000/423/744/45415c78.jpg"}, {"slug": "sfw", "title": "非色情", "poster": ""}]}, {"id": "actions", "label": "行动", "cats": [{"slug": "69", "title": "69式", "poster": "https://ic-tt-nss.xhcdn.com/a/NGYwM2QwNjRlMDMzN2NjMzgyY2NjNWQ2NzJmMTA1N2Q/s(w:640,h:360)/tag/000/313/729/f24a8f6c.jpg"}, {"slug": "kissing", "title": "亲吻", "poster": "https://ic-tt-nss.xhcdn.com/a/MWZhMGRkNzY5MDdmZGQyMTQxYzRlYTgwMjc5ZGMzOWI/s(w:640,h:360)/tag/000/423/727/f4dab2a9.jpg"}, {"slug": "creampie", "title": "内射", "poster": "https://ic-tt-nss.xhcdn.com/a/YmU5M2RlN2VkYWMzNzJjZTJiMjg0ZWVkODY4ODA2YTc/s(w:640,h:360)/tag/000/313/715/a32392e5.jpg"}, {"slug": "double-penetration", "title": "双洞齐插", "poster": "https://ic-tt-nss.xhcdn.com/a/MDM4MzE2Mzc1NmE4YWFmZjA0NjNkMGE1ZGQ4OWQyNGQ/s(w:640,h:360)/tag/000/423/708/189b133f.jpg"}, {"slug": "blowjob", "title": "口交", "poster": "https://ic-tt-nss.xhcdn.com/a/ZTNkNTczOTRmZThlMGNjZWYwZTA3MDQ2NDYzODYxMTA/s(w:640,h:360)/tag/000/000/157/11a38625.jpg"}, {"slug": "cum-in-mouth", "title": "口爆", "poster": "https://ic-tt-nss.xhcdn.com/a/M2Y5OTYxODQ4ODc2YmJkMjc3ZDk3ZWUwNzQ5M2E2ZjE/s(w:640,h:360)/tag/000/423/699/039ab535.jpg"}, {"slug": "cum-swallowing", "title": "吞精", "poster": "https://ic-tt-nss.xhcdn.com/a/NzRkYzY3NzA0MWU1OWRiYzMzZjAyYjY3ZWM5NzdkYjg/s(w:640,h:360)/tag/000/423/700/7501e399.jpg"}, {"slug": "cumshot", "title": "射精", "poster": "https://ic-tt-nss.xhcdn.com/a/N2IwNzEwZjcxMjU4Y2I4NmM1MjdlZjIzMGM3ZDgyZGI/s(w:640,h:360)/tag/000/313/711/653ab129.jpg"}, {"slug": "handjob", "title": "手交", "poster": "https://ic-tt-nss.xhcdn.com/a/NWEyMjcwNWFkNDUyM2FlNTcyZTNlZDU5MTllODE5ZDc/s(w:640,h:360)/tag/000/000/169/03e56133.jpg"}, {"slug": "fisting", "title": "拳交", "poster": "https://ic-tt-nss.xhcdn.com/a/ZmY5MjUxNGZiNjM1NzQ3YzYzNTM0YzU5ODUxYmRmMmU/s(w:640,h:360)/tag/000/000/164/4c0d911c.jpg"}, {"slug": "fingering", "title": "指交", "poster": "https://ic-tt-nss.xhcdn.com/a/ZmZlOTBkZTRlOGZmNTdiODQyNDlkODY2M2RiMzdjYTk/s(w:640,h:360)/tag/000/423/712/995d513a.jpg"}, {"slug": "massage", "title": "按摩", "poster": "https://ic-tt-nss.xhcdn.com/a/OWQ2NmU4NWQxMjIwY2FhOTM5N2JhYjY3YzgyZWVlZWQ/s(w:640,h:360)/tag/000/000/174/ba1e8337.jpg"}, {"slug": "bareback", "title": "无套", "poster": "https://ic-tt-nss.xhcdn.com/a/ZjBkNDI3NzdlMjJjYTNhZWRiOTMzNzdiMDc4MTEwZDc/s(w:640,h:360)/tag/000/000/152/35619f58.jpg"}, {"slug": "deep-throat", "title": "深喉", "poster": "https://ic-tt-nss.xhcdn.com/a/MzE3ODk1YThlNzE1MzdiOTNlNTgxMWIzNDAzMmI0OTk/s(w:640,h:360)/tag/000/423/701/6c5dadf9.jpg"}, {"slug": "rough-sex", "title": "粗暴性爱", "poster": "https://ic-tt-nss.xhcdn.com/a/Y2UyOGEzNjQ0ZjUyNDY2OGE5YzQ4M2U1ZWJhMTcxZDc/s(w:640,h:360)/tag/000/366/649/e2feedeb.jpg"}, {"slug": "cum-tribute", "title": "精液致敬", "poster": "https://ic-tt-nss.xhcdn.com/a/MGU1MmY4ZjI5NjM0ODllN2M5OWU0NzM2ZjA3MTdhZWY/s(w:640,h:360)/tag/000/000/160/ebb3d934.jpg"}, {"slug": "bukkake", "title": "群交颜射", "poster": "https://ic-tt-nss.xhcdn.com/a/ZTgzNDZiNTMzZGExNWZiZGQyZGU4MmQ5ZjJlMjQwOGQ/s(w:640,h:360)/tag/000/000/158/790dd5a9.jpg"}, {"slug": "anal", "title": "肛交", "poster": "https://ic-tt-nss.xhcdn.com/a/ZmQ3YWVkMGM4MWQ0ZTk2YTY4ZTFiODU4YTQ1ZmRjMzc/s(w:640,h:360)/tag/000/074/836/3df1934d.jpg"}, {"slug": "anal-masturbation", "title": "肛交自慰", "poster": "https://ic-tt-nss.xhcdn.com/a/MmFiZjc1MDZjNTdlMjExMjkyMzFhNzc2Y2EyNzJjMmM/s(w:640,h:360)/tag/000/425/504/339caf06.jpg"}, {"slug": "felching", "title": "肛门吸精", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDM0YmI4NTA0ZmQwYWI5NzBhNTk1ODliNGJjYzMwZGE/s(w:640,h:360)/tag/000/424/572/39219690.jpg"}, {"slug": "masturbation", "title": "自慰", "poster": "https://ic-tt-nss.xhcdn.com/a/YTZkYjhlMWM5YzE4ZjFhNDNkODE4MGE5Zjg2NWM0MDM/s(w:640,h:360)/tag/000/000/175/4561afa5.jpg"}, {"slug": "ass-licking", "title": "舔肛", "poster": "https://ic-tt-nss.xhcdn.com/a/NDZiODcyMDhhMjAwN2QwZDJjMTZiMzUzNmNiYTFmODY/s(w:640,h:360)/tag/000/313/744/f7d82a05.jpg"}, {"slug": "hardcore", "title": "重口味", "poster": "https://ic-tt-nss.xhcdn.com/a/MGJkZThlM2U4NTM1MzBiNWMyMWZjZWVmZTI5MTg2NDc/s(w:640,h:360)/tag/000/313/742/01c3dbd1.jpg"}, {"slug": "facial", "title": "颜射", "poster": "https://ic-tt-nss.xhcdn.com/a/ZmZmMzkwMGViODE1NzEyMTE3YWVlNGFiZTk4YTY4NGI/s(w:640,h:360)/tag/000/313/736/a1fd5983.jpg"}, {"slug": "riding", "title": "骑乘", "poster": "https://ic-tt-nss.xhcdn.com/a/MzkxNmUwMGVjMzhiMzFkMTdmYWMxNDRlMWExYjdkZTQ/s(w:640,h:360)/tag/000/424/573/070158c0.jpg"}, {"slug": "facesitting", "title": "骑脸", "poster": "https://ic-tt-nss.xhcdn.com/a/NmFjZWNkYzM3Njc1MzdjNjFlNDg1YmNhYzk5Y2MxMWU/s(w:640,h:360)/tag/000/423/710/d3125f9c.jpg"}, {"slug": "spm", "title": "每分钟抽插次数", "poster": ""}]}, {"id": "fetish", "label": "恋物癖", "cats": [{"slug": "sissy", "title": "女装", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDYxMGZkNTc3YzdlYWFiZjI2MDk0ZTBhYmMyMTFjODY/s(w:640,h:360)/tag/000/313/725/b7eba029.jpg"}, {"slug": "slave", "title": "奴隶", "poster": "https://ic-tt-nss.xhcdn.com/a/Y2IxZDQ0ZTljNjdmZmNiZmFiZTQ0YTYxZTQ0ZGFkNDM/s(w:640,h:360)/tag/000/423/754/8d124552.jpg"}, {"slug": "fetish", "title": "恋物癖", "poster": "https://ic-tt-nss.xhcdn.com/a/Nzg5YjgxZTJjYTFhMjI4ZGJiYzg4MThhZTI5OTE4NjU/s(w:640,h:360)/tag/000/366/648/55f82021.jpg"}, {"slug": "foot-fetish", "title": "恋足癖", "poster": "https://ic-tt-nss.xhcdn.com/a/MjBhNjA0ZDliOGE0ZjIzMDJiNWE4YmRlNjc3MzJkMTE/s(w:640,h:360)/tag/000/423/714/af4fe0a9.jpg"}, {"slug": "spanking", "title": "打屁股", "poster": "https://ic-tt-nss.xhcdn.com/a/ZTIyZWJjMmFiZWE3MGJkNmY4NTQzNDg0MTAzYzc3YTc/s(w:640,h:360)/tag/000/000/183/c60e7fb2.jpg"}, {"slug": "oiled", "title": "抹油", "poster": "https://ic-tt-nss.xhcdn.com/a/YzM5OTczYzdmMTVhMmVlNjFhMzNkYmUwYzA2M2JmZmY/s(w:640,h:360)/tag/000/425/650/abbaf95e.jpg"}, {"slug": "whipping", "title": "抽打", "poster": "https://ic-tt-nss.xhcdn.com/a/ZjMzZjQ0ZmM2MWQ2NTc1OTdkNDFjYWVhOWUzNWQwNTA/s(w:640,h:360)/tag/000/423/767/b98e0839.jpg"}, {"slug": "bondage", "title": "捆绑", "poster": "https://ic-tt-nss.xhcdn.com/a/N2M5M2E5YzhmNmNiNjZiYzQ5NGYyYjIwNGM0MTRkMWY/s(w:640,h:360)/tag/000/313/719/3eef0052.jpg"}, {"slug": "bdsm", "title": "捆绑SM", "poster": "https://ic-tt-nss.xhcdn.com/a/NWM2ZjJmY2Q5YTk5YmE5ZmYxMTI2Y2Y5MTgwMDBhMjc/s(w:640,h:360)/tag/000/000/153/be98e371.jpg"}, {"slug": "pissing", "title": "撒尿", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDIyZDE1NTFjNWI3ZGZiMGJkZTlmNzFkZjU1NDVmZWU/s(w:640,h:360)/tag/000/423/743/c05e8f98.jpg"}, {"slug": "domination", "title": "支配", "poster": "https://ic-tt-nss.xhcdn.com/a/MmNiNjFkNzA0NGNjNGJlMjIwMmY3YjdkNTg0ZjAzZGQ/s(w:640,h:360)/tag/000/423/707/650d7d09.jpg"}, {"slug": "shibari", "title": "日式捆绑", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDU5MTQzOGY4ODNmN2NkOTljMjBiNTcyNWY3ZTRlMTY/s(w:640,h:360)/tag/000/366/672/ff705211.jpg"}, {"slug": "feet", "title": "美脚", "poster": "https://ic-tt-nss.xhcdn.com/a/NjhlMDhiYWM5MGVkMmE0ZTQzYzJkNzM5ZDM5MzU1MDg/s(w:640,h:360)/tag/000/424/580/54fc99e3.jpg"}, {"slug": "humiliation", "title": "羞辱", "poster": "https://ic-tt-nss.xhcdn.com/a/MGYxYTYyOGVkNmFjZmRhMGJhMzZmZmJkMmJhYzEzOTg/s(w:640,h:360)/tag/000/423/723/0085618a.jpg"}, {"slug": "gaping", "title": "肛门扩张", "poster": "https://ic-tt-nss.xhcdn.com/a/MzA5NGY4Yzg3MDgxNGVlMDJmNzZjNjE1M2NkYjM1YTQ/s(w:640,h:360)/tag/000/000/166/9a222ea7.jpg"}]}, {"id": "orientation", "label": "方向", "cats": [{"slug": "jock", "title": "体育生", "poster": "https://ic-tt-nss.xhcdn.com/a/MWU5ZjlhYTllMDdmMGU4OGM2ZjM1YTg2YTM1MzFkNjc/s(w:640,h:360)/tag/000/313/750/1081fd9d.jpg"}, {"slug": "femboy", "title": "娘娘腔", "poster": "https://ic-tt-nss.xhcdn.com/a/ZjM2OWYyOGIzODIxMDc1ZDZjNmRiODQyN2FkZDk4MTE/s(w:640,h:360)/tag/000/428/272/86e357d8.jpg"}, {"slug": "crossdresser", "title": "异装癖", "poster": "https://ic-tt-nss.xhcdn.com/a/NTU0MzA0ZmM0Mjg2YzRiYTdkNDJiZTc1ZWUxMDRiY2M/s(w:640,h:360)/tag/000/000/159/ae7072b2.jpg"}, {"slug": "bear", "title": "强壮多毛男", "poster": "https://ic-tt-nss.xhcdn.com/a/ZmQwZjY0NDFhYWQ0ZjA3ZmI2MDQ5MzU3Mjg3YTk3Nzg/s(w:640,h:360)/tag/000/000/155/e28477eb.jpg"}, {"slug": "straight-guy", "title": "直男", "poster": "https://ic-tt-nss.xhcdn.com/a/NTA0ZmE4NTgyMjgyZGViYjEzNjE1YzI2ODM2YWFiZjQ/s(w:640,h:360)/tag/000/425/651/fb0d0fad.jpg"}, {"slug": "man", "title": "男人", "poster": ""}]}, {"id": "age", "label": "年龄", "cats": [{"slug": "middle-aged", "title": "中年", "poster": "https://ic-tt-nss.xhcdn.com/a/NWE0ODY3MTFlOTQ5NzA5ZWE4NWExYjA4YTdiN2EyMDY/s(w:640,h:360)/tag/000/366/651/7bca5e29.jpg"}, {"slug": "dilf", "title": "人夫", "poster": "https://ic-tt-nss.xhcdn.com/a/MzY1NGNhZjkwZDI3YTM2OTY2OWE2YzczMjU2NzU0OGU/s(w:640,h:360)/tag/000/423/702/9a62b744.jpg"}, {"slug": "young", "title": "成熟", "poster": "https://ic-tt-nss.xhcdn.com/a/OGE5NThiODYwMjExMmE2ZTFhNjhjZjA4ZjJmZGZkZGE/s(w:640,h:360)/tag/000/313/706/ef142b19.jpg"}, {"slug": "mature", "title": "成熟", "poster": "https://ic-tt-nss.xhcdn.com/a/MzE4YjlkMmIxYmE4YjM5MjQ1NDdiNzJkMDkzZDQ1ZGM/s(w:640,h:360)/tag/000/313/702/b79ee435.jpg"}, {"slug": "grandpa", "title": "爷爷", "poster": "https://ic-tt-nss.xhcdn.com/a/ODg3MjdlZjQ5MjgzMDExZGRmNTZhMTgwYTc0NDI0Nzc/s(w:640,h:360)/tag/000/313/712/185bbaab.jpg"}, {"slug": "old-young", "title": "老的", "poster": "https://ic-tt-nss.xhcdn.com/a/OWJiNWM4MjM5NzNkMzljYzU0NTFkYzEzNTk5YTA3ZmI/s(w:640,h:360)/tag/000/000/179/e56e0d83.jpg"}, {"slug": "old", "title": "老的", "poster": "https://ic-tt-nss.xhcdn.com/a/YjFjNDYxNmVlNzU2N2E4ZGQwZGRiNDJiZWU1YWUxY2Q/s(w:640,h:360)/tag/000/366/650/4e6c4c19.jpg"}, {"slug": "teen", "title": "", "poster": "https://ic-tt-nss.xhcdn.com/a/ZTlkYWFjODgxNzdhOGMwMDk2NWQ3ZTE5OGY0NmExN2Q/s(w:640,h:360)/tag/000/313/697/0c07c028.jpg"}]}, {"id": "ethnicity", "label": "种族", "cats": [{"slug": "asian", "title": "亚洲人", "poster": "https://ic-tt-nss.xhcdn.com/a/MDQ2NWFhNTVlZWQ0MGMxNjgyMDljNWY2NjFhZDM2MTc/s(w:640,h:360)/tag/000/000/151/202d3a77.jpg"}, {"slug": "desi", "title": "印度", "poster": "https://ic-tt-nss.xhcdn.com/a/MjA0M2M2Y2Q5Yjk4YzFjNWM4NjMwYzZlYTI4ZWVmMzY/s(w:640,h:360)/tag/000/438/933/59b48220.jpg"}, {"slug": "indian", "title": "印度人", "poster": "https://ic-tt-nss.xhcdn.com/a/YjFhMGU5MWIyMWVkOTVkYWIxYzA5Mjc5MzQxMTc3Mjg/s(w:640,h:360)/tag/000/313/728/769fec5e.jpg"}, {"slug": "mzansi", "title": "姆赞西", "poster": "https://ic-tt-nss.xhcdn.com/a/ODIyMWMwYzM4Mzc5MjJmYTc4NTc5YTEyYzhmZGNhM2Q/s(w:640,h:360)/tag/000/441/546/b5dfac6c.jpg"}, {"slug": "latino", "title": "拉丁帅哥", "poster": "https://ic-tt-nss.xhcdn.com/a/MzBjM2Y4NTM2MTMzOTQxNDgyOTJiOTEwYjMxODI5YjM/s(w:640,h:360)/tag/000/000/172/f6d23d19.jpg"}, {"slug": "european", "title": "欧洲人", "poster": "https://ic-tt-nss.xhcdn.com/a/OTM3MjY5ZTBhNjM5ZGJkZmQwMmVlOTJhYjY0M2MzOWM/s(w:640,h:360)/tag/000/366/654/7008680b.jpg"}, {"slug": "jewish", "title": "犹太人", "poster": "https://ic-tt-nss.xhcdn.com/a/ZjQyMDY4ZmFkZDVhYmQzZWJkOTNkYTY3YmZkYjE4YmU/s(w:640,h:360)/tag/000/366/655/0a96c18f.jpg"}, {"slug": "white", "title": "白人", "poster": "https://ic-tt-nss.xhcdn.com/a/MjUwNDAyZTc1YmUzYTM0ZWIxNmJlOTQ1OTA4ZDk1ZGY/s(w:640,h:360)/tag/000/366/657/4d3a14d9.jpg"}, {"slug": "interracial", "title": "跨人种", "poster": "https://ic-tt-nss.xhcdn.com/a/NmY3ZDMzYjAwMjZjYTZiMGRlY2VlYTg5YzgyYzA1Y2Y/s(w:640,h:360)/tag/000/000/171/65e37949.jpg"}, {"slug": "arab", "title": "阿拉伯人", "poster": "https://ic-tt-nss.xhcdn.com/a/NzAwODQxMDJmYjI0ODZiMzgwZDM0YTdiMDYwYjAxNTU/s(w:640,h:360)/tag/000/366/653/47bee330.jpg"}, {"slug": "african", "title": "非洲人", "poster": "https://ic-tt-nss.xhcdn.com/a/MjQ2NTY3YjkyNDE3YjAxYzQyNzMyZTE1Mzg0NGYzNjU/s(w:640,h:360)/tag/000/366/652/7126cbae.jpg"}, {"slug": "black", "title": "黑人", "poster": "https://ic-tt-nss.xhcdn.com/a/OGQ1OTgzNGJhYjQyZGNhOWRhMGU5NzA0NmU3MjA1MDM/s(w:640,h:360)/tag/000/000/106/26e8ef91.jpg"}]}, {"id": "body", "label": "身体", "cats": [{"slug": "midget", "title": "侏儒", "poster": "https://ic-tt-nss.xhcdn.com/a/ZWM1MDlhYmU5NmI2OThiYjM4ZmM5NDE2Yzk3ZDk2ZmU/s(w:640,h:360)/tag/000/423/731/601612e7.jpg"}, {"slug": "average-body", "title": "大众身材", "poster": "https://ic-tt-nss.xhcdn.com/a/ZmUxYmE5ZGFhY2I0NmU0Y2EzNzk1MzdjNmE5YjNmNjA/s(w:640,h:360)/tag/000/366/656/a0403568.jpg"}, {"slug": "big-ass", "title": "大屁股", "poster": "https://ic-tt-nss.xhcdn.com/a/YjJkZDhjYmY2YTc0YzAwNzgzOTA5MGZmMzJmNGQ5MGE/s(w:640,h:360)/tag/000/423/687/cec1a7f6.jpg"}, {"slug": "big-cock", "title": "大鸡巴", "poster": "https://ic-tt-nss.xhcdn.com/a/NzA2MjhhN2RiZTZkNGU1MmZmMjY1Y2QzZGFhNTk1ZTg/s(w:640,h:360)/tag/000/000/156/f4fca75e.jpg"}, {"slug": "bbc", "title": "大黑屌", "poster": "https://ic-tt-nss.xhcdn.com/a/NTkwODg4NTRhMjI4OWJmMWYxMjM2OTNkOGI2NDg0OTA/s(w:640,h:360)/tag/000/313/717/6e4eb9ff.jpg"}, {"slug": "small-cock", "title": "小鸡巴", "poster": "https://ic-tt-nss.xhcdn.com/a/OGY0OGVlZGU0YzhhNTM1MzZkOGUwNDU3NThmMmZkODY/s(w:640,h:360)/tag/000/000/182/a496d535.jpg"}, {"slug": "twink", "title": "年轻男同", "poster": "https://ic-tt-nss.xhcdn.com/a/OGUzZTg3MTllNDBlYTQ0OGI4YzJkODIyMjE5MzcxMDk/s(w:640,h:360)/tag/000/000/131/fa40e181.jpg"}, {"slug": "hunk", "title": "建美男", "poster": "https://ic-tt-nss.xhcdn.com/a/OWI0ZGYyMTBhNGMwMWEzMDFiOWE2ZjU4Njc5NWY2NDk/s(w:640,h:360)/tag/000/000/170/b5d879a7.jpg"}, {"slug": "chubby", "title": "微胖", "poster": "https://ic-tt-nss.xhcdn.com/a/NDg5ZmM5YjdiYTViMTEyNWQzMmM2MTdkMWExYzljNmY/s(w:640,h:360)/tag/000/313/709/59122620.jpg"}, {"slug": "uncut", "title": "未剪辑", "poster": "https://ic-tt-nss.xhcdn.com/a/OTdmMzQ0MmY2NDA1MmJhZWNmNGVjNjg2MDhlMDc0OTY/s(w:640,h:360)/tag/000/366/660/8b3be5e5.jpg"}, {"slug": "hairy", "title": "毛发浓密", "poster": "https://ic-tt-nss.xhcdn.com/a/NmJmNWU4NjgwN2VjYThlMTA1NjRiYmNjOWEyYmU2MWU/s(w:640,h:360)/tag/000/313/726/0b13c28f.jpg"}, {"slug": "tattoo", "title": "纹身", "poster": "https://ic-tt-nss.xhcdn.com/a/MTdkYTQ3MjMzY2Q5NjQ5NmFlYWZhNGRlZTBkOWY3MDA/s(w:640,h:360)/tag/000/366/658/105b00b1.jpg"}, {"slug": "muscular", "title": "肌肉发达", "poster": "https://ic-tt-nss.xhcdn.com/a/MDlhNDVjYzIyN2QxZjNmNjlkZmEyZDhhZTUzOTM0NGE/s(w:640,h:360)/tag/000/000/178/bf643218.jpg"}, {"slug": "fat", "title": "肥胖", "poster": "https://ic-tt-nss.xhcdn.com/a/NzNhNDc2ZTYyMjMzZTI3OTAwYzBjMzEzM2I0MDFmMjg/s(w:640,h:360)/tag/000/000/163/518fca97.jpg"}, {"slug": "bubble-butt", "title": "蜜桃臀", "poster": "https://ic-tt-nss.xhcdn.com/a/YzBlODUzODBhNjA0ZjE0MzIyN2ZiZWIwOWViZjhjNzI/s(w:640,h:360)/tag/000/441/520/9e933948.jpg"}, {"slug": "nude", "title": "裸体", "poster": "https://ic-tt-nss.xhcdn.com/a/Y2Y5Mzk0Zjc5YTdmOGNjMGRkYjQyZjIxOGI1NmRiMjU/s(w:640,h:360)/tag/000/313/698/d4288214.jpg"}, {"slug": "piercing", "title": "身体穿孔", "poster": "https://ic-tt-nss.xhcdn.com/a/NmE4ZjM1NjE4ODIzOTkzMWQzNzQwYWY1NDNhZmEzNmU/s(w:640,h:360)/tag/000/366/659/3aefe06d.jpg"}, {"slug": "skinny", "title": "骨感", "poster": "https://ic-tt-nss.xhcdn.com/a/ZWU0M2MyYWRlNDllZDBjZDIyYTk5NDdmNjlhZjM2MDc/s(w:640,h:360)/tag/000/074/838/e9b295f6.jpg"}, {"slug": "average-cock", "title": "鸡巴尺寸一般", "poster": "https://ic-tt-nss.xhcdn.com/a/NmZjOTU4M2RkODMwZmMxOWEzMTFiN2M2NjA5MDVhNGU/s(w:640,h:360)/tag/000/366/779/8f740a18.jpg"}, {"slug": "prolapse", "title": "脱肛", "poster": ""}]}, {"id": "hair", "label": "头发", "cats": [{"slug": "redhead", "title": "红发", "poster": "https://ic-tt-nss.xhcdn.com/a/Yjg5MjYxMTI5MTU0MjFjZDBkNDViMTYxMDdkM2I3Y2Y/s(w:640,h:360)/tag/000/423/747/4b278096.jpg"}]}, {"id": "numberOfPeople", "label": "人数", "cats": [{"slug": "threesome", "title": "3P", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDQzMDRlM2E0MDQyYjM4NDdjMzA1NjVkYjliNzM4NDc/s(w:640,h:360)/tag/000/366/661/d4ae0967.jpg"}, {"slug": "foursome", "title": "4P", "poster": "https://ic-tt-nss.xhcdn.com/a/OGRiOWRhYmVmMjdjZDI3MGY1MTk5MTVlODRjMWY1OGQ/s(w:640,h:360)/tag/000/424/574/02682265.jpg"}, {"slug": "solo", "title": "单人表演", "poster": "https://ic-tt-nss.xhcdn.com/a/OGVjMjhlYzk2NmEyNjQ0MjMwYmY0ZTU3Y2Q2NjY2Mjk/s(w:640,h:360)/tag/000/313/735/0873c228.jpg"}, {"slug": "gangbang", "title": "多对一群交", "poster": "https://ic-tt-nss.xhcdn.com/a/YWI2YjhiNmY2NTIzM2E3ODQyN2E1OTFmZjdkNjNiOGQ/s(w:640,h:360)/tag/000/000/165/fc65e881.jpg"}, {"slug": "couple", "title": "情侣", "poster": "https://ic-tt-nss.xhcdn.com/a/ZTg3NmM5YzBkOTg5NWQ0NmM0MGI5YjA4NDYzMzcyZTI/s(w:640,h:360)/tag/000/074/837/e93d89e1.jpg"}, {"slug": "group-sex", "title": "群交", "poster": "https://ic-tt-nss.xhcdn.com/a/MmI5NzE0MGE0ODdjYzc0NzFjYmFiZTZlNWVhNGI1N2Q/s(w:640,h:360)/tag/000/000/168/fd30155d.jpg"}, {"slug": "orgy", "title": "群交派对", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDAxODI0NmM2MTYzMTJmMjc4YzAwMzZhNzA3YzRhMDM/s(w:640,h:360)/tag/000/313/743/da4bea38.jpg"}]}, {"id": "sexToys", "label": "性玩具", "cats": [{"slug": "dildo", "title": "假阳具", "poster": "https://ic-tt-nss.xhcdn.com/a/MzI4OTI2MGE1YzMyZWExOGY4YWRkOGQ2OGI5OGU2YmU/s(w:640,h:360)/tag/000/313/749/a16a43dc.jpg"}, {"slug": "ball-gag", "title": "堵嘴球", "poster": "https://ic-tt-nss.xhcdn.com/a/MGEzYjBiZDVhYzEzMWFjMWJlMzIyM2Q3MmVhNDhhYTI/s(w:640,h:360)/tag/000/366/669/3fd22a86.jpg"}, {"slug": "fucking-machine", "title": "性爱机器", "poster": "https://ic-tt-nss.xhcdn.com/a/NDE5ODliZGM4MDk0NzdmM2VkNzBiMTVmODdkNDVhOTg/s(w:640,h:360)/tag/000/423/716/55227e02.jpg"}, {"slug": "sex-doll", "title": "成人娃娃", "poster": "https://ic-tt-nss.xhcdn.com/a/NGRhM2NmYjYwZGViZmI2Nzg4OTM0ZjhlZWRiZDQ2ZGY/s(w:640,h:360)/tag/000/425/647/0293584d.jpg"}, {"slug": "sex-toy", "title": "成人玩具", "poster": "https://ic-tt-nss.xhcdn.com/a/MDIxYjQ5NTQ0ZDdiM2RmN2NkMmM5N2M2MjVhOThhMmI/s(w:640,h:360)/tag/000/000/181/e477fc6f.jpg"}, {"slug": "pump", "title": "抽插", "poster": "https://ic-tt-nss.xhcdn.com/a/Y2U3NzZkNTJlMzRjZTJkMWVjN2RhZjFjMjE5YzdlMjM/s(w:640,h:360)/tag/000/366/667/5a57a6ec.jpg"}, {"slug": "vibrator", "title": "振动棒", "poster": "https://ic-tt-nss.xhcdn.com/a/MjdjNDg3ODNmZWQzN2FmNDQ2MmFhMmM3NjBkMTA5Mzg/s(w:640,h:360)/tag/000/366/662/622e4b37.jpg"}, {"slug": "strapon", "title": "穿戴式假阳具", "poster": "https://ic-tt-nss.xhcdn.com/a/YjQwYjk3NzZhNmVkYjdmMDlkZWI3NzU4NTBmYTQ4ZjE/s(w:640,h:360)/tag/000/423/759/753c6517.jpg"}, {"slug": "harness", "title": "绑带", "poster": "https://ic-tt-nss.xhcdn.com/a/NjQ5NTQzOTJlZDM1NWI5Mjc5ZDc1NGVmNzc5YzRkYzk/s(w:640,h:360)/tag/000/366/670/cf38cc27.jpg"}, {"slug": "anal-toy", "title": "肛交玩具", "poster": "https://ic-tt-nss.xhcdn.com/a/MDJkNGMzOGRkMDEzZjc2NmY4MTQyZmY4OWUyMWM4YTY/s(w:640,h:360)/tag/000/366/664/a32d5837.jpg"}, {"slug": "sleeve", "title": "袖子", "poster": "https://ic-tt-nss.xhcdn.com/a/ODBhNDQxMjllYzRiMmJlMjE1MzE4ODUzNGZmZWUxNzI/s(w:640,h:360)/tag/000/366/665/c27c2d76.jpg"}, {"slug": "chain", "title": "锁链", "poster": "https://ic-tt-nss.xhcdn.com/a/Zjk0MjExOGQ2MDhmMGMxODJhMGVlYmZmN2I3MTZhY2I/s(w:640,h:360)/tag/000/366/671/a663020b.jpg"}, {"slug": "ben-wa-balls", "title": "阴道球", "poster": "https://ic-tt-nss.xhcdn.com/a/Zjc4YjQzZTBiZDFmYmRiNGNhMjczMzUzYTk4ZDQ1NTk/s(w:640,h:360)/tag/000/366/668/b9d0e32c.jpg"}, {"slug": "penis-ring", "title": "鸡巴环", "poster": "https://ic-tt-nss.xhcdn.com/a/NTI3MWY1ZjYwMmFlN2M5ODgwNmM0ZjBiOTIxZjViZTY/s(w:640,h:360)/tag/000/366/666/c20e4aa3.jpg"}, {"slug": "the-handy", "title": "The Handy", "poster": ""}]}, {"id": "apparel", "label": "衣服", "cats": [{"slug": "latex", "title": "乳胶服", "poster": "https://ic-tt-nss.xhcdn.com/a/MGU0ODI4ZTAzOWQ4MThlOTdkYWZhZmUzNmRlNTg4NzU/s(w:640,h:360)/tag/000/366/673/d6717be3.jpg"}, {"slug": "uniform", "title": "制服", "poster": "https://ic-tt-nss.xhcdn.com/a/MTM1MmUyZjgyMzg3Yjc1OWU4OGFmMTQzYzZjYWJkNWU/s(w:640,h:360)/tag/000/423/765/e1880ad9.jpg"}, {"slug": "nylon", "title": "尼龙袜", "poster": "https://ic-tt-nss.xhcdn.com/a/ZTIwNDM2ZjBhNTNhMGY2MmEyMDMyMTFlMWRiNzJmNjU/s(w:640,h:360)/tag/000/423/736/f0fa3a92.jpg"}, {"slug": "lingerie", "title": "性感内衣", "poster": "https://ic-tt-nss.xhcdn.com/a/YjAxM2JmYzdmNzFlMDEyMmIzOTQ5MWMwNmEwNTcyYmI/s(w:640,h:360)/tag/000/424/575/f581e5ff.jpg"}, {"slug": "underwear", "title": "水下", "poster": "https://ic-tt-nss.xhcdn.com/a/ZmI0Y2RmOWE4MWExODNlZWZlNTdiZjNiZjA1MWI0MWY/s(w:640,h:360)/tag/000/313/741/3e3af662.jpg"}, {"slug": "sneakers", "title": "球鞋", "poster": "https://ic-tt-nss.xhcdn.com/a/M2E5OGI0NWM5ZjBiZTllNmQxNTAyZjcwMzdiMmFjYWI/s(w:640,h:360)/tag/000/425/648/f4c5202e.jpg"}, {"slug": "leather", "title": "皮衣", "poster": "https://ic-tt-nss.xhcdn.com/a/ZGE1NjZkMGUxOTAxMTEwOTZmMGViZTU1M2UzYzcxYzI/s(w:640,h:360)/tag/000/366/674/f25db894.jpg"}, {"slug": "stockings", "title": "长筒丝袜", "poster": "https://ic-tt-nss.xhcdn.com/a/YmQ0ODk0NTg0ZTllMGQ4MTJlMTUyYzA4MGJiY2ZmM2I/s(w:640,h:360)/tag/000/423/758/d8abd93b.jpg"}, {"slug": "high-heels", "title": "高跟鞋", "poster": "https://ic-tt-nss.xhcdn.com/a/MTdjMzUxNjc5YjFiMWE0NjIzYTc2NWZiMmFmODllMTk/s(w:640,h:360)/tag/000/425/649/2a2e5368.jpg"}]}, {"id": "scenario", "label": "设想", "cats": [{"slug": "asmr", "title": "ASMR", "poster": "https://ic-tt-nss.xhcdn.com/a/NTZjMGE1NjhjMTg5ZGFmMzk5MDI1M2E4YWU3MmJjODU/s(w:640,h:360)/tag/000/441/519/73ed058f.jpg"}, {"slug": "cook", "title": "Cook", "poster": "https://ic-tt-nss.xhcdn.com/a/OGE5NWQ0Y2YwM2ExMWQzZmNmZjNlYmMxYWRmOTA0MzI/s(w:640,h:360)/tag/000/424/089/b98d0eff.jpg"}, {"slug": "husband", "title": "丈夫", "poster": "https://ic-tt-nss.xhcdn.com/a/OGJhM2FhOWY1NjZhZGFiMjI5NTk4OGFkMDAxZTJjYTE/s(w:640,h:360)/tag/000/423/724/ecb5f095.jpg"}, {"slug": "escort", "title": "三陪", "poster": "https://ic-tt-nss.xhcdn.com/a/MjRhZDAwN2Y4ZDNiMjdhNGRmYjFkNTY2MzZiMTJiZGY/s(w:640,h:360)/tag/000/423/709/800b5952.jpg"}, {"slug": "military", "title": "军队", "poster": "https://ic-tt-nss.xhcdn.com/a/MThlZDliMWVlZmFmYzc1OTU2Yjg3OTliOTlhZTkwZDM/s(w:640,h:360)/tag/000/000/177/5ee248b3.jpg"}, {"slug": "doctor", "title": "医生", "poster": "https://ic-tt-nss.xhcdn.com/a/YjIxZTEzMDQ1YjI2M2NiYzcyZmNhZWFkNjRjZmIzMWM/s(w:640,h:360)/tag/000/423/704/f0302e14.jpg"}, {"slug": "cruising", "title": "巡航", "poster": "https://ic-tt-nss.xhcdn.com/a/YzcxYTFiYWUzZWIxOTkwYTAzYjZlMmY2ZjFiNjVlMTE/s(w:640,h:360)/tag/000/441/521/c9d1c0f9.jpg"}, {"slug": "fantasy", "title": "幻想", "poster": "https://ic-tt-nss.xhcdn.com/a/MzQ0NzhkYTliMWYzNzU1ZmM3M2UwZTA2MWUwMzQxNjE/s(w:640,h:360)/tag/000/424/579/60af5c60.jpg"}, {"slug": "emo", "title": "情绪摇滚", "poster": "https://ic-tt-nss.xhcdn.com/a/YjRlYjQxZTVjOWNhMjM3OTdhZGE3NjFiMGFiNDNhNDI/s(w:640,h:360)/tag/000/000/162/7794bcf9.jpg"}, {"slug": "swingers", "title": "换妻癖者", "poster": "https://ic-tt-nss.xhcdn.com/a/OGRlOGNhNzc0NjZhZmU0MWQ3NGMwZmNhZmQ2NzVmODI/s(w:640,h:360)/tag/000/423/760/07b84d43.jpg"}, {"slug": "funny", "title": "搞笑", "poster": "https://ic-tt-nss.xhcdn.com/a/ODEyOTY0ZmQxMzVmYmRkOTU5MTNiMzc0YTcwOWRjNjU/s(w:640,h:360)/tag/000/313/701/a4d7d1b9.jpg"}, {"slug": "wrestling", "title": "摔跤", "poster": "https://ic-tt-nss.xhcdn.com/a/OTA0ZDEyOTZmODI3ZDMwNjUzOTIwYjkxMDhhN2E2OTQ/s(w:640,h:360)/tag/000/000/188/8010dca0.jpg"}, {"slug": "teacher", "title": "教师", "poster": "https://ic-tt-nss.xhcdn.com/a/N2MxNzliMTk2MjhmMTg2MGU1YmZjNTdmYzcwMDU0ODU/s(w:640,h:360)/tag/000/423/763/88f43125.jpg"}, {"slug": "party", "title": "派对", "poster": "https://ic-tt-nss.xhcdn.com/a/NzViZTY3MTM1N2ZkZjQ0ODNjZTA5OGNhM2U3NTJiZTg/s(w:640,h:360)/tag/000/423/741/ef4b83da.jpg"}, {"slug": "romantic", "title": "浪漫", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDgwNzFiM2FlM2E2ZGEyZjFhNDc0OWFkOWY4NTYzMDQ/s(w:640,h:360)/tag/000/424/576/fce4bb03.jpg"}, {"slug": "daddy", "title": "爸爸", "poster": "https://ic-tt-nss.xhcdn.com/a/MzcxODI1ZTU0MTdlMDUwOGQ0NTgxYTA0NTc2MTM4ZWI/s(w:640,h:360)/tag/000/000/161/957974cf.jpg"}, {"slug": "taboo", "title": "禁忌", "poster": "https://ic-tt-nss.xhcdn.com/a/MWY0NTIxYzQwNjAyYTRiYmFiY2Q1NmM5ZGRiNjg4YTA/s(w:640,h:360)/tag/000/428/324/a656b6e1.webp"}, {"slug": "first-time", "title": "第一次", "poster": "https://ic-tt-nss.xhcdn.com/a/NGMwNzMxZWViNWY1MDMwNjViMmEwZmM3Nzk4ZTM2Y2I/s(w:640,h:360)/tag/000/424/577/b027cef5.jpg"}, {"slug": "striptease", "title": "脱衣表演", "poster": "https://ic-tt-nss.xhcdn.com/a/YTc4OGQzOWY0ZTk0ZGZhOTAzMzg0YjM1NTJkODhkOWU/s(w:640,h:360)/tag/000/000/184/2d25e6d1.jpg"}, {"slug": "casting", "title": "试镜", "poster": "https://ic-tt-nss.xhcdn.com/a/MTFmMjFlMjI0MTMyZjAwM2Q0MDQwNzNmM2FhM2EyMDk/s(w:640,h:360)/tag/000/366/675/d8c6ea1b.jpg"}, {"slug": "condom", "title": "避孕套", "poster": "https://ic-tt-nss.xhcdn.com/a/ZTQyNzgwZDdiMjQ4NjFiMTdlNjhjNzYzNmU3NDkzOWU/s(w:640,h:360)/tag/000/425/646/a4100910.jpg"}]}, {"id": "location", "label": "地点", "cats": [{"slug": "gym", "title": "健身房", "poster": "https://ic-tt-nss.xhcdn.com/a/MDdiNmU1ZmZjMmIyZjVlNzg2MjIxNGFiMDU2YWRhN2Y/s(w:640,h:360)/tag/000/441/523/4120382e.jpg"}, {"slug": "public", "title": "公共场合", "poster": "https://ic-tt-nss.xhcdn.com/a/NDUwYjU1ZGM0NmE3M2ViMzRmMzNiYTI3ZjViYzgxYmI/s(w:640,h:360)/tag/000/366/678/4a5653a7.jpg"}, {"slug": "army", "title": "军人", "poster": "https://ic-tt-nss.xhcdn.com/a/YjAwYzdmOGVjNDRiYzE2OTRiZDFmY2E0Y2U3YmY5NjU/s(w:640,h:360)/tag/000/424/578/cbb1b81c.jpg"}, {"slug": "office", "title": "办公室", "poster": "https://ic-tt-nss.xhcdn.com/a/MTY2ZGE1M2UxY2M5ZjM3YzY0NDQ3NGIyNDgzOWUyMjc/s(w:640,h:360)/tag/000/423/737/4efd807d.jpg"}, {"slug": "college", "title": "大学", "poster": "https://ic-tt-nss.xhcdn.com/a/Mjk4ZDNhZjQ5MjlhM2Q2ZGQ3ZmQ5NTgzMDhkYmRiMWY/s(w:640,h:360)/tag/000/366/676/6ba069a7.jpg"}, {"slug": "glory-hole", "title": "寻欢洞", "poster": "https://ic-tt-nss.xhcdn.com/a/NjE2YzJlYmY3YWY5NmZhODE1MGZkODEwMzhmN2JhNDc/s(w:640,h:360)/tag/000/000/167/f86a6315.jpg"}, {"slug": "outdoor", "title": "户外", "poster": "https://ic-tt-nss.xhcdn.com/a/OTAzYjRlOGE2ZWFmZDI2OWRlNDNiYWE3NTQyYTk1ODk/s(w:640,h:360)/tag/000/000/180/79c9ef59.jpg"}, {"slug": "locker-room", "title": "更衣室", "poster": "https://ic-tt-nss.xhcdn.com/a/YmEzM2JlNDhkYmU5ODkxMTZiMzJkNGE2NGYwZjMyZDc/s(w:640,h:360)/tag/000/000/173/963636f7.jpg"}, {"slug": "sauna", "title": "桑拿", "poster": "https://ic-tt-nss.xhcdn.com/a/ZjVkMzU5NzBlY2JiNzQwYjBlZmQxZTA2ODNjYjM0N2E/s(w:640,h:360)/tag/000/441/522/80a6ee33.jpg"}, {"slug": "car", "title": "汽车", "poster": "https://ic-tt-nss.xhcdn.com/a/NTMxMTU5M2FiOWYyOTA4ZmVlN2M3NzJlNzM2Zjc5MWU/s(w:640,h:360)/tag/000/423/691/62f6d625.jpg"}, {"slug": "bathroom", "title": "浴室", "poster": "https://ic-tt-nss.xhcdn.com/a/ZGMxZDg5Y2Q5MTZiYTYwZTNiNjEzNjNlYzdiYTBlZDM/s(w:640,h:360)/tag/000/423/686/c07e8f22.jpg"}, {"slug": "beach", "title": "海滩", "poster": "https://ic-tt-nss.xhcdn.com/a/Y2IxYWE5NTYwZmVkODc0OGQ0NjFkZGVmNDk3NWRmOTI/s(w:640,h:360)/tag/000/000/154/fae7bc61.jpg"}]}, {"id": "countries", "label": "国家", "cats": [{"slug": "afghan", "title": "阿富汗人", "poster": ""}, {"slug": "albanian", "title": "阿尔巴尼亚人", "poster": ""}, {"slug": "algerian", "title": "阿尔及利亚人", "poster": ""}, {"slug": "american", "title": "美国人", "poster": ""}, {"slug": "andorran", "title": "安道尔人", "poster": ""}, {"slug": "angolan", "title": "安哥拉人", "poster": ""}, {"slug": "antiguan", "title": "安提瓜人", "poster": ""}, {"slug": "argentinian", "title": "阿根廷人", "poster": ""}, {"slug": "armenian", "title": "亚美尼亚人", "poster": ""}, {"slug": "aruban", "title": "阿鲁巴人", "poster": ""}, {"slug": "australian", "title": "澳大利亚人", "poster": ""}, {"slug": "austrian", "title": "奥地利人", "poster": ""}, {"slug": "azeri", "title": "阿塞拜疆人", "poster": ""}, {"slug": "bahamian", "title": "巴哈马人", "poster": ""}, {"slug": "bahraini", "title": "巴林人", "poster": ""}, {"slug": "bangladeshi", "title": "孟加拉人", "poster": ""}, {"slug": "barbadian", "title": "巴巴多斯人", "poster": ""}, {"slug": "belarusian", "title": "白俄罗斯人", "poster": ""}, {"slug": "belgian", "title": "比利时人", "poster": ""}, {"slug": "belizean", "title": "伯利兹人", "poster": ""}, {"slug": "beninese", "title": "贝宁人", "poster": ""}, {"slug": "bermudian", "title": "百慕大人", "poster": ""}, {"slug": "bhutanese", "title": "不丹人", "poster": ""}, {"slug": "bolivian", "title": "玻利维亚人", "poster": ""}, {"slug": "bosnian", "title": "波斯尼亚人", "poster": ""}, {"slug": "botswanan", "title": "博茨瓦纳人", "poster": ""}, {"slug": "brazilian", "title": "巴西人", "poster": ""}, {"slug": "british", "title": "英国帅哥", "poster": ""}, {"slug": "bruneian", "title": "文莱人", "poster": ""}, {"slug": "burmese", "title": "缅甸人", "poster": ""}, {"slug": "cambodian", "title": "高棉人", "poster": ""}, {"slug": "cameroonian", "title": "喀麦隆人", "poster": ""}, {"slug": "canadian", "title": "加拿大人", "poster": ""}, {"slug": "central-african", "title": "中非人", "poster": ""}, {"slug": "chadian", "title": "乍得人", "poster": ""}, {"slug": "chilean", "title": "智利人", "poster": ""}, {"slug": "colombian", "title": "哥伦比亚人", "poster": ""}, {"slug": "comorian", "title": "科摩罗人", "poster": ""}, {"slug": "congo-brazzaville", "title": "刚果（布）人", "poster": ""}, {"slug": "costa-rican", "title": "哥斯达黎加人", "poster": ""}, {"slug": "cuban", "title": "古巴人", "poster": ""}, {"slug": "cypriot", "title": "塞浦路斯人", "poster": ""}, {"slug": "dominican", "title": "多米尼加人", "poster": ""}, {"slug": "ecuadorian", "title": "厄瓜多尔人", "poster": ""}, {"slug": "egyptian", "title": "埃及人", "poster": ""}, {"slug": "emiri", "title": "阿联酋人", "poster": ""}, {"slug": "eritrean", "title": "厄立特里亚人", "poster": ""}, {"slug": "estonian", "title": "爱沙尼亚人", "poster": ""}, {"slug": "ethiopian", "title": "埃塞俄比亚人", "poster": ""}, {"slug": "fijian", "title": "斐济人", "poster": ""}, {"slug": "filipino", "title": "菲律宾男人", "poster": ""}, {"slug": "french-polynesian", "title": "法属波利尼西亚人", "poster": ""}, {"slug": "gambian", "title": "冈比亚人", "poster": ""}, {"slug": "georgian", "title": "格鲁吉亚人", "poster": ""}, {"slug": "ghanaian", "title": "加纳人", "poster": ""}, {"slug": "greenlandic", "title": "格陵兰人", "poster": ""}, {"slug": "grenadian", "title": "格林纳达人", "poster": ""}, {"slug": "guadeloupean", "title": "瓜德罗普岛人", "poster": ""}, {"slug": "guamanian", "title": "关岛人", "poster": ""}, {"slug": "guatemalan", "title": "危地马拉人", "poster": ""}, {"slug": "guernsey", "title": "根西岛人", "poster": ""}, {"slug": "guinean", "title": "几内亚人", "poster": ""}, {"slug": "guyanese", "title": "圭亚那人", "poster": ""}, {"slug": "haitian", "title": "海地人", "poster": ""}, {"slug": "honduran", "title": "洪都拉斯人", "poster": ""}, {"slug": "hong-kong", "title": "香港人", "poster": ""}, {"slug": "icelandic", "title": "冰岛人", "poster": ""}, {"slug": "iranian", "title": "伊朗人", "poster": ""}, {"slug": "iraqi", "title": "伊拉克人", "poster": ""}, {"slug": "irish", "title": "爱尔兰人", "poster": ""}, {"slug": "israeli", "title": "以色列人", "poster": ""}, {"slug": "ivorian", "title": "科特迪瓦人", "poster": ""}, {"slug": "jamaican", "title": "牙买加人", "poster": ""}, {"slug": "jordanian", "title": "约旦人", "poster": ""}, {"slug": "kazakh", "title": "哈萨克人", "poster": ""}, {"slug": "kenyan", "title": "肯尼亚人", "poster": ""}, {"slug": "kuwaiti", "title": "科威特人", "poster": ""}, {"slug": "kyrgyz", "title": "吉尔吉斯斯坦人", "poster": ""}, {"slug": "lao", "title": "老挝人", "poster": ""}, {"slug": "latvian", "title": "拉脱维亚人", "poster": ""}, {"slug": "lebanese", "title": "黎巴嫩人", "poster": ""}, {"slug": "liberian", "title": "利比里亚人", "poster": ""}, {"slug": "libyan", "title": "利比亚人", "poster": ""}, {"slug": "lithuanian", "title": "立陶宛人", "poster": ""}, {"slug": "luxembourg", "title": "卢森堡人", "poster": ""}, {"slug": "macedonian", "title": "马其顿人", "poster": ""}, {"slug": "malagasy", "title": "马尔加什人", "poster": ""}, {"slug": "malawian", "title": "马拉维人", "poster": ""}, {"slug": "malaysian", "title": "马来西亚人", "poster": ""}, {"slug": "maldivian", "title": "马尔代夫人", "poster": ""}, {"slug": "malian", "title": "马里人", "poster": ""}, {"slug": "maltese", "title": "马耳他人", "poster": ""}, {"slug": "manx", "title": "马恩岛人", "poster": ""}, {"slug": "marshallese", "title": "马绍尔人", "poster": ""}, {"slug": "mauritanian", "title": "毛里塔尼亚人", "poster": ""}, {"slug": "mauritian", "title": "毛里求斯人", "poster": ""}, {"slug": "mexican", "title": "墨西哥人", "poster": ""}, {"slug": "moldovan", "title": "摩尔多瓦人", "poster": ""}, {"slug": "montenegrin", "title": "黑山人", "poster": ""}, {"slug": "moroccan", "title": "摩洛哥人", "poster": ""}, {"slug": "mozambican", "title": "莫桑比克人", "poster": ""}, {"slug": "namibian", "title": "纳米比亚人", "poster": ""}, {"slug": "new-zealand", "title": "新西兰人", "poster": ""}, {"slug": "nicaraguan", "title": "尼加拉瓜人", "poster": ""}, {"slug": "nigerian", "title": "尼日利亚人", "poster": ""}, {"slug": "norwegian", "title": "挪威人", "poster": ""}, {"slug": "omani", "title": "阿曼人", "poster": ""}, {"slug": "pakistani", "title": "巴基斯坦人", "poster": ""}, {"slug": "palauan", "title": "帕劳人", "poster": ""}, {"slug": "palestinian", "title": "巴勒斯坦人", "poster": ""}, {"slug": "panamanian", "title": "巴拿马人", "poster": ""}, {"slug": "papuan", "title": "巴布亚人", "poster": ""}, {"slug": "paraguayan", "title": "巴拉圭人", "poster": ""}, {"slug": "peruvian", "title": "秘鲁人", "poster": ""}, {"slug": "puerto-rican", "title": "波多黎各人", "poster": ""}, {"slug": "qatari", "title": "卡塔尔人", "poster": ""}, {"slug": "rwandan", "title": "卢旺达人", "poster": ""}, {"slug": "salvadoran", "title": "萨尔瓦多人", "poster": ""}, {"slug": "samoan", "title": "萨摩亚人", "poster": ""}, {"slug": "saudi", "title": "沙特人", "poster": ""}, {"slug": "scottish", "title": "苏格兰人", "poster": ""}, {"slug": "senegalese", "title": "塞内加尔人", "poster": ""}, {"slug": "serbian", "title": "塞尔维亚人", "poster": ""}, {"slug": "sierra-leonean", "title": "塞拉利昂人", "poster": ""}, {"slug": "singaporean", "title": "新加坡人", "poster": ""}, {"slug": "slovak", "title": "斯洛伐克人", "poster": ""}, {"slug": "slovenian", "title": "斯洛文尼亚人", "poster": ""}, {"slug": "solomon-island", "title": "所罗门群岛人", "poster": ""}, {"slug": "somali", "title": "索马里人", "poster": ""}, {"slug": "south-african", "title": "南非人", "poster": ""}, {"slug": "south-sudanese", "title": "南苏丹人", "poster": ""}, {"slug": "sri-lankan", "title": "斯里兰卡人", "poster": ""}, {"slug": "sudanese", "title": "苏丹人", "poster": ""}, {"slug": "surinamese", "title": "苏里南人", "poster": ""}, {"slug": "swazi", "title": "斯威士兰人", "poster": ""}, {"slug": "swiss", "title": "瑞士人", "poster": ""}, {"slug": "syrian", "title": "叙利亚人", "poster": ""}, {"slug": "taiwanese", "title": "台湾人", "poster": ""}, {"slug": "tajik", "title": "塔吉克人", "poster": ""}, {"slug": "tanzanian", "title": "坦桑尼亚人", "poster": ""}, {"slug": "timorese", "title": "东帝汶人", "poster": ""}, {"slug": "togolese", "title": "多哥人", "poster": ""}, {"slug": "tongan", "title": "汤加人", "poster": ""}, {"slug": "trinidadian", "title": "特立尼达人", "poster": ""}, {"slug": "tunisian", "title": "突尼斯人", "poster": ""}, {"slug": "turkmen", "title": "土库曼人", "poster": ""}, {"slug": "ugandan", "title": "乌干达人", "poster": ""}, {"slug": "uruguayan", "title": "乌拉圭人", "poster": ""}, {"slug": "us-outlying-islands", "title": "美国离岛人", "poster": ""}, {"slug": "usvi", "title": "美属维尔京群岛人", "poster": ""}, {"slug": "uzbek", "title": "乌兹别克人", "poster": ""}, {"slug": "vatican", "title": "梵帝冈人", "poster": ""}, {"slug": "venezuelan", "title": "委内瑞拉人", "poster": ""}, {"slug": "yemeni", "title": "也门人", "poster": ""}, {"slug": "zambian", "title": "赞比亚人", "poster": ""}, {"slug": "zimbabwean", "title": "津巴布韦人", "poster": ""}]}, {"id": "languages", "label": "语言", "cats": [{"slug": "ai", "title": "人工智能", "poster": ""}, {"slug": "ar", "title": "الإباحية باللغة العربية", "poster": ""}, {"slug": "bg", "title": "Porn In Bulgarian", "poster": ""}, {"slug": "bn", "title": "বাংলা ভাষায় সেক্স ভিডিও", "poster": ""}, {"slug": "br", "title": "Porn e brezhoneg", "poster": ""}, {"slug": "cs", "title": "Porno v češtině", "poster": ""}, {"slug": "cy", "title": "Porn yn Gymraeg", "poster": ""}, {"slug": "da", "title": "Porn In Danish", "poster": ""}, {"slug": "de", "title": "Pornos auf Deutsch", "poster": ""}, {"slug": "el", "title": "Πορνό στα ελληνικά", "poster": ""}, {"slug": "en", "title": "Porn In English", "poster": ""}, {"slug": "es", "title": "Porno en español", "poster": ""}, {"slug": "fa", "title": "سکس به زبان فارسی", "poster": ""}, {"slug": "fi", "title": "Pornoa suomeksi", "poster": ""}, {"slug": "fo", "title": "Porn In Faroese", "poster": ""}, {"slug": "fr", "title": "Porno en français", "poster": ""}, {"slug": "gl", "title": "Porno en galego", "poster": ""}, {"slug": "ha", "title": "Batsa a Hausa", "poster": ""}, {"slug": "he", "title": "סקס בעברית", "poster": ""}, {"slug": "hi", "title": "हिंदी में अश्लील", "poster": ""}, {"slug": "hr", "title": "Pornografija na hrvatskom", "poster": ""}, {"slug": "hu", "title": "Magyar pornó", "poster": ""}, {"slug": "id", "title": "Porno di indonesia", "poster": ""}, {"slug": "it", "title": "Porno in italiano", "poster": ""}, {"slug": "ja", "title": "日本のアダルト動画", "poster": ""}, {"slug": "km", "title": "ភាពអាសអាភាសជាភាសាខ្មែរ", "poster": ""}, {"slug": "ko", "title": "한국어로 된 포르노", "poster": ""}, {"slug": "ml", "title": "മലയാളത്തിൽ അശ്ലീലം", "poster": ""}, {"slug": "mn", "title": "Монгол хэлээр порно", "poster": ""}, {"slug": "mr", "title": "मराठीत सेक्स", "poster": ""}, {"slug": "ms", "title": "Lucah Melayu", "poster": ""}, {"slug": "ne", "title": "नेपालीमा पोर्न", "poster": ""}, {"slug": "nl", "title": "Porno in het Nederlands", "poster": ""}, {"slug": "pa", "title": "ਪੰਜਾਬੀ ਵਿੱਚ ਪੋਰਨ", "poster": ""}, {"slug": "pl", "title": "Porno po polsku", "poster": ""}, {"slug": "pt", "title": "Vídeo pornô em português", "poster": ""}, {"slug": "ro", "title": "Porno în limba română", "poster": ""}, {"slug": "ru", "title": "Порно на русском", "poster": ""}, {"slug": "sd", "title": "Porn In Sindhi", "poster": ""}, {"slug": "si", "title": "සිංහලෙන් අශ්ලීල", "poster": ""}, {"slug": "sv", "title": "Porr på svenska", "poster": ""}, {"slug": "ta", "title": "தமிழில் அசல்", "poster": ""}, {"slug": "te", "title": "తెలుగులో సెక్స్", "poster": ""}, {"slug": "th", "title": "หนังโป๊ไทย", "poster": ""}, {"slug": "tl", "title": "Pornograpiya sa Tagalog", "poster": ""}, {"slug": "tr", "title": "Türkçe porno", "poster": ""}, {"slug": "uk", "title": "Порно українською мовою", "poster": ""}, {"slug": "ur", "title": "اردو میں فحش", "poster": ""}, {"slug": "vi", "title": "Khiêu Dâm ở Việt Nam", "poster": ""}, {"slug": "yo", "title": "Asán ni Yoruba", "poster": ""}, {"slug": "zh", "title": "中文色情", "poster": ""}]}];

var XH_CAT_INFO = {"3d": {"title": "3D", "poster": "https://ic-tt-nss.xhcdn.com/a/NmM1YzZhMmRjNGQ3NDc0MmIyYjFlYjY3NDAzMzMxY2U/s(w:640,h:360)/tag/000/425/503/9a9b855b.webp"}, "show": {"title": "Show", "poster": "https://ic-tt-nss.xhcdn.com/a/ZjljZTE2YTQ0Y2U4MDY2MDY0NTYwN2YyNzllMGJjNzY/s(w:640,h:360)/tag/000/451/461/9656663b.jpg"}, "voyeur": {"title": "偷窥癖", "poster": "https://ic-tt-nss.xhcdn.com/a/OGUwZWE3YzBkODViNzFhMzZmOTljMmJlYmIzNjRlZWQ/s(w:640,h:360)/tag/000/000/186/d552bffb.jpg"}, "anime": {"title": "动画", "poster": "https://ic-tt-nss.xhcdn.com/a/NTkyYzMzNDM5NTE3N2E5YzJmZmE2OWI3NGQ3ZjM5N2Q/s(w:640,h:360)/tag/000/313/732/66027de5.jpg"}, "cartoon": {"title": "卡通", "poster": "https://ic-tt-nss.xhcdn.com/a/MWQ0MzZlYzkxNjYxNWNhOTM3N2Q0ZjU0YWU5MzhlYzc/s(w:640,h:360)/tag/000/313/703/951e0d79.jpg"}, "compilation": {"title": "合集", "poster": "https://ic-tt-nss.xhcdn.com/a/MWIyYTRkZDYwNDE2MTk0ZmQ2MzkyZDg5YjZkMzc5Njc/s(w:640,h:360)/tag/000/366/778/115128d1.jpg"}, "vintage": {"title": "复古", "poster": "https://ic-tt-nss.xhcdn.com/a/MjgyYTA3MjcxNjAyY2U2NDRjNzc3YzBjMWE2ODdiN2E/s(w:640,h:360)/tag/000/000/185/b118d2f8.jpg"}, "homemade": {"title": "家庭自制", "poster": "https://ic-tt-nss.xhcdn.com/a/MWMwMGU1ZWQxNjI1NTQxZTUyMzljMjU0YjdhNDNjNDM/s(w:640,h:360)/tag/000/423/722/f3557037.jpg"}, "hentai": {"title": "成人动漫", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDMyYTQ2YmMxODU3ZGE1YTQwYjY5OWM4NjliZGIwZGE/s(w:640,h:360)/tag/000/313/734/c491216e.jpg"}, "close-up": {"title": "特写", "poster": "https://ic-tt-nss.xhcdn.com/a/NWE4NjRkYWRhMTQwYWU1NjY1YzlmYWQ4NmE3MjIzMjE/s(w:640,h:360)/tag/000/423/695/636ffe09.jpg"}, "reality": {"title": "现实", "poster": "https://ic-tt-nss.xhcdn.com/a/Nzc3MmZjYTNkYTlmYjRmZWYxZDJhOGE1N2JiMzU0NWE/s(w:640,h:360)/tag/000/366/679/aee3dbc5.jpg"}, "webcam": {"title": "直播", "poster": "https://ic-tt-nss.xhcdn.com/a/MzUwZDMxOThhN2YwZDNjYTBjNjBmNjZiZTM2YTk0ZDc/s(w:640,h:360)/tag/000/000/187/5466c841.jpg"}, "pov": {"title": "第一人称视角", "poster": "https://ic-tt-nss.xhcdn.com/a/YTJlYzRhY2Y0MThjNDBkZGZjYWVlNzA0NmFiZmU5ODA/s(w:640,h:360)/tag/000/366/677/8f1c0c8e.jpg"}, "amateur": {"title": "素人", "poster": "https://ic-tt-nss.xhcdn.com/a/MmViZDRhYjQyNTAzOWZiMzNhNjc4ZWI1ZGM0NjdjNzY/s(w:640,h:360)/tag/000/000/150/f133c4b7.jpg"}, "pornstar": {"title": "色情明星", "poster": "https://ic-tt-nss.xhcdn.com/a/Y2Y2NDM2YTMwMzMxMDM5MmM2ZDQ3OWI4ZWNkM2UxNzY/s(w:640,h:360)/tag/000/423/744/45415c78.jpg"}, "sfw": {"title": "非色情", "poster": ""}, "69": {"title": "69式", "poster": "https://ic-tt-nss.xhcdn.com/a/NGYwM2QwNjRlMDMzN2NjMzgyY2NjNWQ2NzJmMTA1N2Q/s(w:640,h:360)/tag/000/313/729/f24a8f6c.jpg"}, "kissing": {"title": "亲吻", "poster": "https://ic-tt-nss.xhcdn.com/a/MWZhMGRkNzY5MDdmZGQyMTQxYzRlYTgwMjc5ZGMzOWI/s(w:640,h:360)/tag/000/423/727/f4dab2a9.jpg"}, "creampie": {"title": "内射", "poster": "https://ic-tt-nss.xhcdn.com/a/YmU5M2RlN2VkYWMzNzJjZTJiMjg0ZWVkODY4ODA2YTc/s(w:640,h:360)/tag/000/313/715/a32392e5.jpg"}, "double-penetration": {"title": "双洞齐插", "poster": "https://ic-tt-nss.xhcdn.com/a/MDM4MzE2Mzc1NmE4YWFmZjA0NjNkMGE1ZGQ4OWQyNGQ/s(w:640,h:360)/tag/000/423/708/189b133f.jpg"}, "blowjob": {"title": "口交", "poster": "https://ic-tt-nss.xhcdn.com/a/ZTNkNTczOTRmZThlMGNjZWYwZTA3MDQ2NDYzODYxMTA/s(w:640,h:360)/tag/000/000/157/11a38625.jpg"}, "cum-in-mouth": {"title": "口爆", "poster": "https://ic-tt-nss.xhcdn.com/a/M2Y5OTYxODQ4ODc2YmJkMjc3ZDk3ZWUwNzQ5M2E2ZjE/s(w:640,h:360)/tag/000/423/699/039ab535.jpg"}, "cum-swallowing": {"title": "吞精", "poster": "https://ic-tt-nss.xhcdn.com/a/NzRkYzY3NzA0MWU1OWRiYzMzZjAyYjY3ZWM5NzdkYjg/s(w:640,h:360)/tag/000/423/700/7501e399.jpg"}, "cumshot": {"title": "射精", "poster": "https://ic-tt-nss.xhcdn.com/a/N2IwNzEwZjcxMjU4Y2I4NmM1MjdlZjIzMGM3ZDgyZGI/s(w:640,h:360)/tag/000/313/711/653ab129.jpg"}, "handjob": {"title": "手交", "poster": "https://ic-tt-nss.xhcdn.com/a/NWEyMjcwNWFkNDUyM2FlNTcyZTNlZDU5MTllODE5ZDc/s(w:640,h:360)/tag/000/000/169/03e56133.jpg"}, "fisting": {"title": "拳交", "poster": "https://ic-tt-nss.xhcdn.com/a/ZmY5MjUxNGZiNjM1NzQ3YzYzNTM0YzU5ODUxYmRmMmU/s(w:640,h:360)/tag/000/000/164/4c0d911c.jpg"}, "fingering": {"title": "指交", "poster": "https://ic-tt-nss.xhcdn.com/a/ZmZlOTBkZTRlOGZmNTdiODQyNDlkODY2M2RiMzdjYTk/s(w:640,h:360)/tag/000/423/712/995d513a.jpg"}, "massage": {"title": "按摩", "poster": "https://ic-tt-nss.xhcdn.com/a/OWQ2NmU4NWQxMjIwY2FhOTM5N2JhYjY3YzgyZWVlZWQ/s(w:640,h:360)/tag/000/000/174/ba1e8337.jpg"}, "bareback": {"title": "无套", "poster": "https://ic-tt-nss.xhcdn.com/a/ZjBkNDI3NzdlMjJjYTNhZWRiOTMzNzdiMDc4MTEwZDc/s(w:640,h:360)/tag/000/000/152/35619f58.jpg"}, "deep-throat": {"title": "深喉", "poster": "https://ic-tt-nss.xhcdn.com/a/MzE3ODk1YThlNzE1MzdiOTNlNTgxMWIzNDAzMmI0OTk/s(w:640,h:360)/tag/000/423/701/6c5dadf9.jpg"}, "rough-sex": {"title": "粗暴性爱", "poster": "https://ic-tt-nss.xhcdn.com/a/Y2UyOGEzNjQ0ZjUyNDY2OGE5YzQ4M2U1ZWJhMTcxZDc/s(w:640,h:360)/tag/000/366/649/e2feedeb.jpg"}, "cum-tribute": {"title": "精液致敬", "poster": "https://ic-tt-nss.xhcdn.com/a/MGU1MmY4ZjI5NjM0ODllN2M5OWU0NzM2ZjA3MTdhZWY/s(w:640,h:360)/tag/000/000/160/ebb3d934.jpg"}, "bukkake": {"title": "群交颜射", "poster": "https://ic-tt-nss.xhcdn.com/a/ZTgzNDZiNTMzZGExNWZiZGQyZGU4MmQ5ZjJlMjQwOGQ/s(w:640,h:360)/tag/000/000/158/790dd5a9.jpg"}, "anal": {"title": "肛交", "poster": "https://ic-tt-nss.xhcdn.com/a/ZmQ3YWVkMGM4MWQ0ZTk2YTY4ZTFiODU4YTQ1ZmRjMzc/s(w:640,h:360)/tag/000/074/836/3df1934d.jpg"}, "anal-masturbation": {"title": "肛交自慰", "poster": "https://ic-tt-nss.xhcdn.com/a/MmFiZjc1MDZjNTdlMjExMjkyMzFhNzc2Y2EyNzJjMmM/s(w:640,h:360)/tag/000/425/504/339caf06.jpg"}, "felching": {"title": "肛门吸精", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDM0YmI4NTA0ZmQwYWI5NzBhNTk1ODliNGJjYzMwZGE/s(w:640,h:360)/tag/000/424/572/39219690.jpg"}, "masturbation": {"title": "自慰", "poster": "https://ic-tt-nss.xhcdn.com/a/YTZkYjhlMWM5YzE4ZjFhNDNkODE4MGE5Zjg2NWM0MDM/s(w:640,h:360)/tag/000/000/175/4561afa5.jpg"}, "ass-licking": {"title": "舔肛", "poster": "https://ic-tt-nss.xhcdn.com/a/NDZiODcyMDhhMjAwN2QwZDJjMTZiMzUzNmNiYTFmODY/s(w:640,h:360)/tag/000/313/744/f7d82a05.jpg"}, "hardcore": {"title": "重口味", "poster": "https://ic-tt-nss.xhcdn.com/a/MGJkZThlM2U4NTM1MzBiNWMyMWZjZWVmZTI5MTg2NDc/s(w:640,h:360)/tag/000/313/742/01c3dbd1.jpg"}, "facial": {"title": "颜射", "poster": "https://ic-tt-nss.xhcdn.com/a/ZmZmMzkwMGViODE1NzEyMTE3YWVlNGFiZTk4YTY4NGI/s(w:640,h:360)/tag/000/313/736/a1fd5983.jpg"}, "riding": {"title": "骑乘", "poster": "https://ic-tt-nss.xhcdn.com/a/MzkxNmUwMGVjMzhiMzFkMTdmYWMxNDRlMWExYjdkZTQ/s(w:640,h:360)/tag/000/424/573/070158c0.jpg"}, "facesitting": {"title": "骑脸", "poster": "https://ic-tt-nss.xhcdn.com/a/NmFjZWNkYzM3Njc1MzdjNjFlNDg1YmNhYzk5Y2MxMWU/s(w:640,h:360)/tag/000/423/710/d3125f9c.jpg"}, "spm": {"title": "每分钟抽插次数", "poster": ""}, "sissy": {"title": "女装", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDYxMGZkNTc3YzdlYWFiZjI2MDk0ZTBhYmMyMTFjODY/s(w:640,h:360)/tag/000/313/725/b7eba029.jpg"}, "slave": {"title": "奴隶", "poster": "https://ic-tt-nss.xhcdn.com/a/Y2IxZDQ0ZTljNjdmZmNiZmFiZTQ0YTYxZTQ0ZGFkNDM/s(w:640,h:360)/tag/000/423/754/8d124552.jpg"}, "fetish": {"title": "恋物癖", "poster": "https://ic-tt-nss.xhcdn.com/a/Nzg5YjgxZTJjYTFhMjI4ZGJiYzg4MThhZTI5OTE4NjU/s(w:640,h:360)/tag/000/366/648/55f82021.jpg"}, "foot-fetish": {"title": "恋足癖", "poster": "https://ic-tt-nss.xhcdn.com/a/MjBhNjA0ZDliOGE0ZjIzMDJiNWE4YmRlNjc3MzJkMTE/s(w:640,h:360)/tag/000/423/714/af4fe0a9.jpg"}, "spanking": {"title": "打屁股", "poster": "https://ic-tt-nss.xhcdn.com/a/ZTIyZWJjMmFiZWE3MGJkNmY4NTQzNDg0MTAzYzc3YTc/s(w:640,h:360)/tag/000/000/183/c60e7fb2.jpg"}, "oiled": {"title": "抹油", "poster": "https://ic-tt-nss.xhcdn.com/a/YzM5OTczYzdmMTVhMmVlNjFhMzNkYmUwYzA2M2JmZmY/s(w:640,h:360)/tag/000/425/650/abbaf95e.jpg"}, "whipping": {"title": "抽打", "poster": "https://ic-tt-nss.xhcdn.com/a/ZjMzZjQ0ZmM2MWQ2NTc1OTdkNDFjYWVhOWUzNWQwNTA/s(w:640,h:360)/tag/000/423/767/b98e0839.jpg"}, "bondage": {"title": "捆绑", "poster": "https://ic-tt-nss.xhcdn.com/a/N2M5M2E5YzhmNmNiNjZiYzQ5NGYyYjIwNGM0MTRkMWY/s(w:640,h:360)/tag/000/313/719/3eef0052.jpg"}, "bdsm": {"title": "捆绑SM", "poster": "https://ic-tt-nss.xhcdn.com/a/NWM2ZjJmY2Q5YTk5YmE5ZmYxMTI2Y2Y5MTgwMDBhMjc/s(w:640,h:360)/tag/000/000/153/be98e371.jpg"}, "pissing": {"title": "撒尿", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDIyZDE1NTFjNWI3ZGZiMGJkZTlmNzFkZjU1NDVmZWU/s(w:640,h:360)/tag/000/423/743/c05e8f98.jpg"}, "domination": {"title": "支配", "poster": "https://ic-tt-nss.xhcdn.com/a/MmNiNjFkNzA0NGNjNGJlMjIwMmY3YjdkNTg0ZjAzZGQ/s(w:640,h:360)/tag/000/423/707/650d7d09.jpg"}, "shibari": {"title": "日式捆绑", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDU5MTQzOGY4ODNmN2NkOTljMjBiNTcyNWY3ZTRlMTY/s(w:640,h:360)/tag/000/366/672/ff705211.jpg"}, "feet": {"title": "美脚", "poster": "https://ic-tt-nss.xhcdn.com/a/NjhlMDhiYWM5MGVkMmE0ZTQzYzJkNzM5ZDM5MzU1MDg/s(w:640,h:360)/tag/000/424/580/54fc99e3.jpg"}, "humiliation": {"title": "羞辱", "poster": "https://ic-tt-nss.xhcdn.com/a/MGYxYTYyOGVkNmFjZmRhMGJhMzZmZmJkMmJhYzEzOTg/s(w:640,h:360)/tag/000/423/723/0085618a.jpg"}, "gaping": {"title": "肛门扩张", "poster": "https://ic-tt-nss.xhcdn.com/a/MzA5NGY4Yzg3MDgxNGVlMDJmNzZjNjE1M2NkYjM1YTQ/s(w:640,h:360)/tag/000/000/166/9a222ea7.jpg"}, "jock": {"title": "体育生", "poster": "https://ic-tt-nss.xhcdn.com/a/MWU5ZjlhYTllMDdmMGU4OGM2ZjM1YTg2YTM1MzFkNjc/s(w:640,h:360)/tag/000/313/750/1081fd9d.jpg"}, "femboy": {"title": "娘娘腔", "poster": "https://ic-tt-nss.xhcdn.com/a/ZjM2OWYyOGIzODIxMDc1ZDZjNmRiODQyN2FkZDk4MTE/s(w:640,h:360)/tag/000/428/272/86e357d8.jpg"}, "crossdresser": {"title": "异装癖", "poster": "https://ic-tt-nss.xhcdn.com/a/NTU0MzA0ZmM0Mjg2YzRiYTdkNDJiZTc1ZWUxMDRiY2M/s(w:640,h:360)/tag/000/000/159/ae7072b2.jpg"}, "bear": {"title": "强壮多毛男", "poster": "https://ic-tt-nss.xhcdn.com/a/ZmQwZjY0NDFhYWQ0ZjA3ZmI2MDQ5MzU3Mjg3YTk3Nzg/s(w:640,h:360)/tag/000/000/155/e28477eb.jpg"}, "straight-guy": {"title": "直男", "poster": "https://ic-tt-nss.xhcdn.com/a/NTA0ZmE4NTgyMjgyZGViYjEzNjE1YzI2ODM2YWFiZjQ/s(w:640,h:360)/tag/000/425/651/fb0d0fad.jpg"}, "man": {"title": "男人", "poster": ""}, "middle-aged": {"title": "中年", "poster": "https://ic-tt-nss.xhcdn.com/a/NWE0ODY3MTFlOTQ5NzA5ZWE4NWExYjA4YTdiN2EyMDY/s(w:640,h:360)/tag/000/366/651/7bca5e29.jpg"}, "dilf": {"title": "人夫", "poster": "https://ic-tt-nss.xhcdn.com/a/MzY1NGNhZjkwZDI3YTM2OTY2OWE2YzczMjU2NzU0OGU/s(w:640,h:360)/tag/000/423/702/9a62b744.jpg"}, "young": {"title": "成熟", "poster": "https://ic-tt-nss.xhcdn.com/a/OGE5NThiODYwMjExMmE2ZTFhNjhjZjA4ZjJmZGZkZGE/s(w:640,h:360)/tag/000/313/706/ef142b19.jpg"}, "mature": {"title": "成熟", "poster": "https://ic-tt-nss.xhcdn.com/a/MzE4YjlkMmIxYmE4YjM5MjQ1NDdiNzJkMDkzZDQ1ZGM/s(w:640,h:360)/tag/000/313/702/b79ee435.jpg"}, "grandpa": {"title": "爷爷", "poster": "https://ic-tt-nss.xhcdn.com/a/ODg3MjdlZjQ5MjgzMDExZGRmNTZhMTgwYTc0NDI0Nzc/s(w:640,h:360)/tag/000/313/712/185bbaab.jpg"}, "old-young": {"title": "老的", "poster": "https://ic-tt-nss.xhcdn.com/a/OWJiNWM4MjM5NzNkMzljYzU0NTFkYzEzNTk5YTA3ZmI/s(w:640,h:360)/tag/000/000/179/e56e0d83.jpg"}, "old": {"title": "老的", "poster": "https://ic-tt-nss.xhcdn.com/a/YjFjNDYxNmVlNzU2N2E4ZGQwZGRiNDJiZWU1YWUxY2Q/s(w:640,h:360)/tag/000/366/650/4e6c4c19.jpg"}, "teen": {"title": "", "poster": "https://ic-tt-nss.xhcdn.com/a/ZTlkYWFjODgxNzdhOGMwMDk2NWQ3ZTE5OGY0NmExN2Q/s(w:640,h:360)/tag/000/313/697/0c07c028.jpg"}, "asian": {"title": "亚洲人", "poster": "https://ic-tt-nss.xhcdn.com/a/MDQ2NWFhNTVlZWQ0MGMxNjgyMDljNWY2NjFhZDM2MTc/s(w:640,h:360)/tag/000/000/151/202d3a77.jpg"}, "desi": {"title": "印度", "poster": "https://ic-tt-nss.xhcdn.com/a/MjA0M2M2Y2Q5Yjk4YzFjNWM4NjMwYzZlYTI4ZWVmMzY/s(w:640,h:360)/tag/000/438/933/59b48220.jpg"}, "indian": {"title": "印度人", "poster": "https://ic-tt-nss.xhcdn.com/a/YjFhMGU5MWIyMWVkOTVkYWIxYzA5Mjc5MzQxMTc3Mjg/s(w:640,h:360)/tag/000/313/728/769fec5e.jpg"}, "mzansi": {"title": "姆赞西", "poster": "https://ic-tt-nss.xhcdn.com/a/ODIyMWMwYzM4Mzc5MjJmYTc4NTc5YTEyYzhmZGNhM2Q/s(w:640,h:360)/tag/000/441/546/b5dfac6c.jpg"}, "latino": {"title": "拉丁帅哥", "poster": "https://ic-tt-nss.xhcdn.com/a/MzBjM2Y4NTM2MTMzOTQxNDgyOTJiOTEwYjMxODI5YjM/s(w:640,h:360)/tag/000/000/172/f6d23d19.jpg"}, "european": {"title": "欧洲人", "poster": "https://ic-tt-nss.xhcdn.com/a/OTM3MjY5ZTBhNjM5ZGJkZmQwMmVlOTJhYjY0M2MzOWM/s(w:640,h:360)/tag/000/366/654/7008680b.jpg"}, "jewish": {"title": "犹太人", "poster": "https://ic-tt-nss.xhcdn.com/a/ZjQyMDY4ZmFkZDVhYmQzZWJkOTNkYTY3YmZkYjE4YmU/s(w:640,h:360)/tag/000/366/655/0a96c18f.jpg"}, "white": {"title": "白人", "poster": "https://ic-tt-nss.xhcdn.com/a/MjUwNDAyZTc1YmUzYTM0ZWIxNmJlOTQ1OTA4ZDk1ZGY/s(w:640,h:360)/tag/000/366/657/4d3a14d9.jpg"}, "interracial": {"title": "跨人种", "poster": "https://ic-tt-nss.xhcdn.com/a/NmY3ZDMzYjAwMjZjYTZiMGRlY2VlYTg5YzgyYzA1Y2Y/s(w:640,h:360)/tag/000/000/171/65e37949.jpg"}, "arab": {"title": "阿拉伯人", "poster": "https://ic-tt-nss.xhcdn.com/a/NzAwODQxMDJmYjI0ODZiMzgwZDM0YTdiMDYwYjAxNTU/s(w:640,h:360)/tag/000/366/653/47bee330.jpg"}, "african": {"title": "非洲人", "poster": "https://ic-tt-nss.xhcdn.com/a/MjQ2NTY3YjkyNDE3YjAxYzQyNzMyZTE1Mzg0NGYzNjU/s(w:640,h:360)/tag/000/366/652/7126cbae.jpg"}, "black": {"title": "黑人", "poster": "https://ic-tt-nss.xhcdn.com/a/OGQ1OTgzNGJhYjQyZGNhOWRhMGU5NzA0NmU3MjA1MDM/s(w:640,h:360)/tag/000/000/106/26e8ef91.jpg"}, "midget": {"title": "侏儒", "poster": "https://ic-tt-nss.xhcdn.com/a/ZWM1MDlhYmU5NmI2OThiYjM4ZmM5NDE2Yzk3ZDk2ZmU/s(w:640,h:360)/tag/000/423/731/601612e7.jpg"}, "average-body": {"title": "大众身材", "poster": "https://ic-tt-nss.xhcdn.com/a/ZmUxYmE5ZGFhY2I0NmU0Y2EzNzk1MzdjNmE5YjNmNjA/s(w:640,h:360)/tag/000/366/656/a0403568.jpg"}, "big-ass": {"title": "大屁股", "poster": "https://ic-tt-nss.xhcdn.com/a/YjJkZDhjYmY2YTc0YzAwNzgzOTA5MGZmMzJmNGQ5MGE/s(w:640,h:360)/tag/000/423/687/cec1a7f6.jpg"}, "big-cock": {"title": "大鸡巴", "poster": "https://ic-tt-nss.xhcdn.com/a/NzA2MjhhN2RiZTZkNGU1MmZmMjY1Y2QzZGFhNTk1ZTg/s(w:640,h:360)/tag/000/000/156/f4fca75e.jpg"}, "bbc": {"title": "大黑屌", "poster": "https://ic-tt-nss.xhcdn.com/a/NTkwODg4NTRhMjI4OWJmMWYxMjM2OTNkOGI2NDg0OTA/s(w:640,h:360)/tag/000/313/717/6e4eb9ff.jpg"}, "small-cock": {"title": "小鸡巴", "poster": "https://ic-tt-nss.xhcdn.com/a/OGY0OGVlZGU0YzhhNTM1MzZkOGUwNDU3NThmMmZkODY/s(w:640,h:360)/tag/000/000/182/a496d535.jpg"}, "twink": {"title": "年轻男同", "poster": "https://ic-tt-nss.xhcdn.com/a/OGUzZTg3MTllNDBlYTQ0OGI4YzJkODIyMjE5MzcxMDk/s(w:640,h:360)/tag/000/000/131/fa40e181.jpg"}, "hunk": {"title": "建美男", "poster": "https://ic-tt-nss.xhcdn.com/a/OWI0ZGYyMTBhNGMwMWEzMDFiOWE2ZjU4Njc5NWY2NDk/s(w:640,h:360)/tag/000/000/170/b5d879a7.jpg"}, "chubby": {"title": "微胖", "poster": "https://ic-tt-nss.xhcdn.com/a/NDg5ZmM5YjdiYTViMTEyNWQzMmM2MTdkMWExYzljNmY/s(w:640,h:360)/tag/000/313/709/59122620.jpg"}, "uncut": {"title": "未剪辑", "poster": "https://ic-tt-nss.xhcdn.com/a/OTdmMzQ0MmY2NDA1MmJhZWNmNGVjNjg2MDhlMDc0OTY/s(w:640,h:360)/tag/000/366/660/8b3be5e5.jpg"}, "hairy": {"title": "毛发浓密", "poster": "https://ic-tt-nss.xhcdn.com/a/NmJmNWU4NjgwN2VjYThlMTA1NjRiYmNjOWEyYmU2MWU/s(w:640,h:360)/tag/000/313/726/0b13c28f.jpg"}, "tattoo": {"title": "纹身", "poster": "https://ic-tt-nss.xhcdn.com/a/MTdkYTQ3MjMzY2Q5NjQ5NmFlYWZhNGRlZTBkOWY3MDA/s(w:640,h:360)/tag/000/366/658/105b00b1.jpg"}, "muscular": {"title": "肌肉发达", "poster": "https://ic-tt-nss.xhcdn.com/a/MDlhNDVjYzIyN2QxZjNmNjlkZmEyZDhhZTUzOTM0NGE/s(w:640,h:360)/tag/000/000/178/bf643218.jpg"}, "fat": {"title": "肥胖", "poster": "https://ic-tt-nss.xhcdn.com/a/NzNhNDc2ZTYyMjMzZTI3OTAwYzBjMzEzM2I0MDFmMjg/s(w:640,h:360)/tag/000/000/163/518fca97.jpg"}, "bubble-butt": {"title": "蜜桃臀", "poster": "https://ic-tt-nss.xhcdn.com/a/YzBlODUzODBhNjA0ZjE0MzIyN2ZiZWIwOWViZjhjNzI/s(w:640,h:360)/tag/000/441/520/9e933948.jpg"}, "nude": {"title": "裸体", "poster": "https://ic-tt-nss.xhcdn.com/a/Y2Y5Mzk0Zjc5YTdmOGNjMGRkYjQyZjIxOGI1NmRiMjU/s(w:640,h:360)/tag/000/313/698/d4288214.jpg"}, "piercing": {"title": "身体穿孔", "poster": "https://ic-tt-nss.xhcdn.com/a/NmE4ZjM1NjE4ODIzOTkzMWQzNzQwYWY1NDNhZmEzNmU/s(w:640,h:360)/tag/000/366/659/3aefe06d.jpg"}, "skinny": {"title": "骨感", "poster": "https://ic-tt-nss.xhcdn.com/a/ZWU0M2MyYWRlNDllZDBjZDIyYTk5NDdmNjlhZjM2MDc/s(w:640,h:360)/tag/000/074/838/e9b295f6.jpg"}, "average-cock": {"title": "鸡巴尺寸一般", "poster": "https://ic-tt-nss.xhcdn.com/a/NmZjOTU4M2RkODMwZmMxOWEzMTFiN2M2NjA5MDVhNGU/s(w:640,h:360)/tag/000/366/779/8f740a18.jpg"}, "prolapse": {"title": "脱肛", "poster": ""}, "redhead": {"title": "红发", "poster": "https://ic-tt-nss.xhcdn.com/a/Yjg5MjYxMTI5MTU0MjFjZDBkNDViMTYxMDdkM2I3Y2Y/s(w:640,h:360)/tag/000/423/747/4b278096.jpg"}, "threesome": {"title": "3P", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDQzMDRlM2E0MDQyYjM4NDdjMzA1NjVkYjliNzM4NDc/s(w:640,h:360)/tag/000/366/661/d4ae0967.jpg"}, "foursome": {"title": "4P", "poster": "https://ic-tt-nss.xhcdn.com/a/OGRiOWRhYmVmMjdjZDI3MGY1MTk5MTVlODRjMWY1OGQ/s(w:640,h:360)/tag/000/424/574/02682265.jpg"}, "solo": {"title": "单人表演", "poster": "https://ic-tt-nss.xhcdn.com/a/OGVjMjhlYzk2NmEyNjQ0MjMwYmY0ZTU3Y2Q2NjY2Mjk/s(w:640,h:360)/tag/000/313/735/0873c228.jpg"}, "gangbang": {"title": "多对一群交", "poster": "https://ic-tt-nss.xhcdn.com/a/YWI2YjhiNmY2NTIzM2E3ODQyN2E1OTFmZjdkNjNiOGQ/s(w:640,h:360)/tag/000/000/165/fc65e881.jpg"}, "couple": {"title": "情侣", "poster": "https://ic-tt-nss.xhcdn.com/a/ZTg3NmM5YzBkOTg5NWQ0NmM0MGI5YjA4NDYzMzcyZTI/s(w:640,h:360)/tag/000/074/837/e93d89e1.jpg"}, "group-sex": {"title": "群交", "poster": "https://ic-tt-nss.xhcdn.com/a/MmI5NzE0MGE0ODdjYzc0NzFjYmFiZTZlNWVhNGI1N2Q/s(w:640,h:360)/tag/000/000/168/fd30155d.jpg"}, "orgy": {"title": "群交派对", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDAxODI0NmM2MTYzMTJmMjc4YzAwMzZhNzA3YzRhMDM/s(w:640,h:360)/tag/000/313/743/da4bea38.jpg"}, "dildo": {"title": "假阳具", "poster": "https://ic-tt-nss.xhcdn.com/a/MzI4OTI2MGE1YzMyZWExOGY4YWRkOGQ2OGI5OGU2YmU/s(w:640,h:360)/tag/000/313/749/a16a43dc.jpg"}, "ball-gag": {"title": "堵嘴球", "poster": "https://ic-tt-nss.xhcdn.com/a/MGEzYjBiZDVhYzEzMWFjMWJlMzIyM2Q3MmVhNDhhYTI/s(w:640,h:360)/tag/000/366/669/3fd22a86.jpg"}, "fucking-machine": {"title": "性爱机器", "poster": "https://ic-tt-nss.xhcdn.com/a/NDE5ODliZGM4MDk0NzdmM2VkNzBiMTVmODdkNDVhOTg/s(w:640,h:360)/tag/000/423/716/55227e02.jpg"}, "sex-doll": {"title": "成人娃娃", "poster": "https://ic-tt-nss.xhcdn.com/a/NGRhM2NmYjYwZGViZmI2Nzg4OTM0ZjhlZWRiZDQ2ZGY/s(w:640,h:360)/tag/000/425/647/0293584d.jpg"}, "sex-toy": {"title": "成人玩具", "poster": "https://ic-tt-nss.xhcdn.com/a/MDIxYjQ5NTQ0ZDdiM2RmN2NkMmM5N2M2MjVhOThhMmI/s(w:640,h:360)/tag/000/000/181/e477fc6f.jpg"}, "pump": {"title": "抽插", "poster": "https://ic-tt-nss.xhcdn.com/a/Y2U3NzZkNTJlMzRjZTJkMWVjN2RhZjFjMjE5YzdlMjM/s(w:640,h:360)/tag/000/366/667/5a57a6ec.jpg"}, "vibrator": {"title": "振动棒", "poster": "https://ic-tt-nss.xhcdn.com/a/MjdjNDg3ODNmZWQzN2FmNDQ2MmFhMmM3NjBkMTA5Mzg/s(w:640,h:360)/tag/000/366/662/622e4b37.jpg"}, "strapon": {"title": "穿戴式假阳具", "poster": "https://ic-tt-nss.xhcdn.com/a/YjQwYjk3NzZhNmVkYjdmMDlkZWI3NzU4NTBmYTQ4ZjE/s(w:640,h:360)/tag/000/423/759/753c6517.jpg"}, "harness": {"title": "绑带", "poster": "https://ic-tt-nss.xhcdn.com/a/NjQ5NTQzOTJlZDM1NWI5Mjc5ZDc1NGVmNzc5YzRkYzk/s(w:640,h:360)/tag/000/366/670/cf38cc27.jpg"}, "anal-toy": {"title": "肛交玩具", "poster": "https://ic-tt-nss.xhcdn.com/a/MDJkNGMzOGRkMDEzZjc2NmY4MTQyZmY4OWUyMWM4YTY/s(w:640,h:360)/tag/000/366/664/a32d5837.jpg"}, "sleeve": {"title": "袖子", "poster": "https://ic-tt-nss.xhcdn.com/a/ODBhNDQxMjllYzRiMmJlMjE1MzE4ODUzNGZmZWUxNzI/s(w:640,h:360)/tag/000/366/665/c27c2d76.jpg"}, "chain": {"title": "锁链", "poster": "https://ic-tt-nss.xhcdn.com/a/Zjk0MjExOGQ2MDhmMGMxODJhMGVlYmZmN2I3MTZhY2I/s(w:640,h:360)/tag/000/366/671/a663020b.jpg"}, "ben-wa-balls": {"title": "阴道球", "poster": "https://ic-tt-nss.xhcdn.com/a/Zjc4YjQzZTBiZDFmYmRiNGNhMjczMzUzYTk4ZDQ1NTk/s(w:640,h:360)/tag/000/366/668/b9d0e32c.jpg"}, "penis-ring": {"title": "鸡巴环", "poster": "https://ic-tt-nss.xhcdn.com/a/NTI3MWY1ZjYwMmFlN2M5ODgwNmM0ZjBiOTIxZjViZTY/s(w:640,h:360)/tag/000/366/666/c20e4aa3.jpg"}, "the-handy": {"title": "The Handy", "poster": ""}, "latex": {"title": "乳胶服", "poster": "https://ic-tt-nss.xhcdn.com/a/MGU0ODI4ZTAzOWQ4MThlOTdkYWZhZmUzNmRlNTg4NzU/s(w:640,h:360)/tag/000/366/673/d6717be3.jpg"}, "uniform": {"title": "制服", "poster": "https://ic-tt-nss.xhcdn.com/a/MTM1MmUyZjgyMzg3Yjc1OWU4OGFmMTQzYzZjYWJkNWU/s(w:640,h:360)/tag/000/423/765/e1880ad9.jpg"}, "nylon": {"title": "尼龙袜", "poster": "https://ic-tt-nss.xhcdn.com/a/ZTIwNDM2ZjBhNTNhMGY2MmEyMDMyMTFlMWRiNzJmNjU/s(w:640,h:360)/tag/000/423/736/f0fa3a92.jpg"}, "lingerie": {"title": "性感内衣", "poster": "https://ic-tt-nss.xhcdn.com/a/YjAxM2JmYzdmNzFlMDEyMmIzOTQ5MWMwNmEwNTcyYmI/s(w:640,h:360)/tag/000/424/575/f581e5ff.jpg"}, "underwear": {"title": "水下", "poster": "https://ic-tt-nss.xhcdn.com/a/ZmI0Y2RmOWE4MWExODNlZWZlNTdiZjNiZjA1MWI0MWY/s(w:640,h:360)/tag/000/313/741/3e3af662.jpg"}, "sneakers": {"title": "球鞋", "poster": "https://ic-tt-nss.xhcdn.com/a/M2E5OGI0NWM5ZjBiZTllNmQxNTAyZjcwMzdiMmFjYWI/s(w:640,h:360)/tag/000/425/648/f4c5202e.jpg"}, "leather": {"title": "皮衣", "poster": "https://ic-tt-nss.xhcdn.com/a/ZGE1NjZkMGUxOTAxMTEwOTZmMGViZTU1M2UzYzcxYzI/s(w:640,h:360)/tag/000/366/674/f25db894.jpg"}, "stockings": {"title": "长筒丝袜", "poster": "https://ic-tt-nss.xhcdn.com/a/YmQ0ODk0NTg0ZTllMGQ4MTJlMTUyYzA4MGJiY2ZmM2I/s(w:640,h:360)/tag/000/423/758/d8abd93b.jpg"}, "high-heels": {"title": "高跟鞋", "poster": "https://ic-tt-nss.xhcdn.com/a/MTdjMzUxNjc5YjFiMWE0NjIzYTc2NWZiMmFmODllMTk/s(w:640,h:360)/tag/000/425/649/2a2e5368.jpg"}, "asmr": {"title": "ASMR", "poster": "https://ic-tt-nss.xhcdn.com/a/NTZjMGE1NjhjMTg5ZGFmMzk5MDI1M2E4YWU3MmJjODU/s(w:640,h:360)/tag/000/441/519/73ed058f.jpg"}, "cook": {"title": "Cook", "poster": "https://ic-tt-nss.xhcdn.com/a/OGE5NWQ0Y2YwM2ExMWQzZmNmZjNlYmMxYWRmOTA0MzI/s(w:640,h:360)/tag/000/424/089/b98d0eff.jpg"}, "husband": {"title": "丈夫", "poster": "https://ic-tt-nss.xhcdn.com/a/OGJhM2FhOWY1NjZhZGFiMjI5NTk4OGFkMDAxZTJjYTE/s(w:640,h:360)/tag/000/423/724/ecb5f095.jpg"}, "escort": {"title": "三陪", "poster": "https://ic-tt-nss.xhcdn.com/a/MjRhZDAwN2Y4ZDNiMjdhNGRmYjFkNTY2MzZiMTJiZGY/s(w:640,h:360)/tag/000/423/709/800b5952.jpg"}, "military": {"title": "军队", "poster": "https://ic-tt-nss.xhcdn.com/a/MThlZDliMWVlZmFmYzc1OTU2Yjg3OTliOTlhZTkwZDM/s(w:640,h:360)/tag/000/000/177/5ee248b3.jpg"}, "doctor": {"title": "医生", "poster": "https://ic-tt-nss.xhcdn.com/a/YjIxZTEzMDQ1YjI2M2NiYzcyZmNhZWFkNjRjZmIzMWM/s(w:640,h:360)/tag/000/423/704/f0302e14.jpg"}, "cruising": {"title": "巡航", "poster": "https://ic-tt-nss.xhcdn.com/a/YzcxYTFiYWUzZWIxOTkwYTAzYjZlMmY2ZjFiNjVlMTE/s(w:640,h:360)/tag/000/441/521/c9d1c0f9.jpg"}, "fantasy": {"title": "幻想", "poster": "https://ic-tt-nss.xhcdn.com/a/MzQ0NzhkYTliMWYzNzU1ZmM3M2UwZTA2MWUwMzQxNjE/s(w:640,h:360)/tag/000/424/579/60af5c60.jpg"}, "emo": {"title": "情绪摇滚", "poster": "https://ic-tt-nss.xhcdn.com/a/YjRlYjQxZTVjOWNhMjM3OTdhZGE3NjFiMGFiNDNhNDI/s(w:640,h:360)/tag/000/000/162/7794bcf9.jpg"}, "swingers": {"title": "换妻癖者", "poster": "https://ic-tt-nss.xhcdn.com/a/OGRlOGNhNzc0NjZhZmU0MWQ3NGMwZmNhZmQ2NzVmODI/s(w:640,h:360)/tag/000/423/760/07b84d43.jpg"}, "funny": {"title": "搞笑", "poster": "https://ic-tt-nss.xhcdn.com/a/ODEyOTY0ZmQxMzVmYmRkOTU5MTNiMzc0YTcwOWRjNjU/s(w:640,h:360)/tag/000/313/701/a4d7d1b9.jpg"}, "wrestling": {"title": "摔跤", "poster": "https://ic-tt-nss.xhcdn.com/a/OTA0ZDEyOTZmODI3ZDMwNjUzOTIwYjkxMDhhN2E2OTQ/s(w:640,h:360)/tag/000/000/188/8010dca0.jpg"}, "teacher": {"title": "教师", "poster": "https://ic-tt-nss.xhcdn.com/a/N2MxNzliMTk2MjhmMTg2MGU1YmZjNTdmYzcwMDU0ODU/s(w:640,h:360)/tag/000/423/763/88f43125.jpg"}, "party": {"title": "派对", "poster": "https://ic-tt-nss.xhcdn.com/a/NzViZTY3MTM1N2ZkZjQ0ODNjZTA5OGNhM2U3NTJiZTg/s(w:640,h:360)/tag/000/423/741/ef4b83da.jpg"}, "romantic": {"title": "浪漫", "poster": "https://ic-tt-nss.xhcdn.com/a/ZDgwNzFiM2FlM2E2ZGEyZjFhNDc0OWFkOWY4NTYzMDQ/s(w:640,h:360)/tag/000/424/576/fce4bb03.jpg"}, "daddy": {"title": "爸爸", "poster": "https://ic-tt-nss.xhcdn.com/a/MzcxODI1ZTU0MTdlMDUwOGQ0NTgxYTA0NTc2MTM4ZWI/s(w:640,h:360)/tag/000/000/161/957974cf.jpg"}, "taboo": {"title": "禁忌", "poster": "https://ic-tt-nss.xhcdn.com/a/MWY0NTIxYzQwNjAyYTRiYmFiY2Q1NmM5ZGRiNjg4YTA/s(w:640,h:360)/tag/000/428/324/a656b6e1.webp"}, "first-time": {"title": "第一次", "poster": "https://ic-tt-nss.xhcdn.com/a/NGMwNzMxZWViNWY1MDMwNjViMmEwZmM3Nzk4ZTM2Y2I/s(w:640,h:360)/tag/000/424/577/b027cef5.jpg"}, "striptease": {"title": "脱衣表演", "poster": "https://ic-tt-nss.xhcdn.com/a/YTc4OGQzOWY0ZTk0ZGZhOTAzMzg0YjM1NTJkODhkOWU/s(w:640,h:360)/tag/000/000/184/2d25e6d1.jpg"}, "casting": {"title": "试镜", "poster": "https://ic-tt-nss.xhcdn.com/a/MTFmMjFlMjI0MTMyZjAwM2Q0MDQwNzNmM2FhM2EyMDk/s(w:640,h:360)/tag/000/366/675/d8c6ea1b.jpg"}, "condom": {"title": "避孕套", "poster": "https://ic-tt-nss.xhcdn.com/a/ZTQyNzgwZDdiMjQ4NjFiMTdlNjhjNzYzNmU3NDkzOWU/s(w:640,h:360)/tag/000/425/646/a4100910.jpg"}, "gym": {"title": "健身房", "poster": "https://ic-tt-nss.xhcdn.com/a/MDdiNmU1ZmZjMmIyZjVlNzg2MjIxNGFiMDU2YWRhN2Y/s(w:640,h:360)/tag/000/441/523/4120382e.jpg"}, "public": {"title": "公共场合", "poster": "https://ic-tt-nss.xhcdn.com/a/NDUwYjU1ZGM0NmE3M2ViMzRmMzNiYTI3ZjViYzgxYmI/s(w:640,h:360)/tag/000/366/678/4a5653a7.jpg"}, "army": {"title": "军人", "poster": "https://ic-tt-nss.xhcdn.com/a/YjAwYzdmOGVjNDRiYzE2OTRiZDFmY2E0Y2U3YmY5NjU/s(w:640,h:360)/tag/000/424/578/cbb1b81c.jpg"}, "office": {"title": "办公室", "poster": "https://ic-tt-nss.xhcdn.com/a/MTY2ZGE1M2UxY2M5ZjM3YzY0NDQ3NGIyNDgzOWUyMjc/s(w:640,h:360)/tag/000/423/737/4efd807d.jpg"}, "college": {"title": "大学", "poster": "https://ic-tt-nss.xhcdn.com/a/Mjk4ZDNhZjQ5MjlhM2Q2ZGQ3ZmQ5NTgzMDhkYmRiMWY/s(w:640,h:360)/tag/000/366/676/6ba069a7.jpg"}, "glory-hole": {"title": "寻欢洞", "poster": "https://ic-tt-nss.xhcdn.com/a/NjE2YzJlYmY3YWY5NmZhODE1MGZkODEwMzhmN2JhNDc/s(w:640,h:360)/tag/000/000/167/f86a6315.jpg"}, "outdoor": {"title": "户外", "poster": "https://ic-tt-nss.xhcdn.com/a/OTAzYjRlOGE2ZWFmZDI2OWRlNDNiYWE3NTQyYTk1ODk/s(w:640,h:360)/tag/000/000/180/79c9ef59.jpg"}, "locker-room": {"title": "更衣室", "poster": "https://ic-tt-nss.xhcdn.com/a/YmEzM2JlNDhkYmU5ODkxMTZiMzJkNGE2NGYwZjMyZDc/s(w:640,h:360)/tag/000/000/173/963636f7.jpg"}, "sauna": {"title": "桑拿", "poster": "https://ic-tt-nss.xhcdn.com/a/ZjVkMzU5NzBlY2JiNzQwYjBlZmQxZTA2ODNjYjM0N2E/s(w:640,h:360)/tag/000/441/522/80a6ee33.jpg"}, "car": {"title": "汽车", "poster": "https://ic-tt-nss.xhcdn.com/a/NTMxMTU5M2FiOWYyOTA4ZmVlN2M3NzJlNzM2Zjc5MWU/s(w:640,h:360)/tag/000/423/691/62f6d625.jpg"}, "bathroom": {"title": "浴室", "poster": "https://ic-tt-nss.xhcdn.com/a/ZGMxZDg5Y2Q5MTZiYTYwZTNiNjEzNjNlYzdiYTBlZDM/s(w:640,h:360)/tag/000/423/686/c07e8f22.jpg"}, "beach": {"title": "海滩", "poster": "https://ic-tt-nss.xhcdn.com/a/Y2IxYWE5NTYwZmVkODc0OGQ0NjFkZGVmNDk3NWRmOTI/s(w:640,h:360)/tag/000/000/154/fae7bc61.jpg"}, "afghan": {"title": "阿富汗人", "poster": ""}, "albanian": {"title": "阿尔巴尼亚人", "poster": ""}, "algerian": {"title": "阿尔及利亚人", "poster": ""}, "american": {"title": "美国人", "poster": ""}, "andorran": {"title": "安道尔人", "poster": ""}, "angolan": {"title": "安哥拉人", "poster": ""}, "antiguan": {"title": "安提瓜人", "poster": ""}, "argentinian": {"title": "阿根廷人", "poster": ""}, "armenian": {"title": "亚美尼亚人", "poster": ""}, "aruban": {"title": "阿鲁巴人", "poster": ""}, "australian": {"title": "澳大利亚人", "poster": ""}, "austrian": {"title": "奥地利人", "poster": ""}, "azeri": {"title": "阿塞拜疆人", "poster": ""}, "bahamian": {"title": "巴哈马人", "poster": ""}, "bahraini": {"title": "巴林人", "poster": ""}, "bangladeshi": {"title": "孟加拉人", "poster": ""}, "barbadian": {"title": "巴巴多斯人", "poster": ""}, "belarusian": {"title": "白俄罗斯人", "poster": ""}, "belgian": {"title": "比利时人", "poster": ""}, "belizean": {"title": "伯利兹人", "poster": ""}, "beninese": {"title": "贝宁人", "poster": ""}, "bermudian": {"title": "百慕大人", "poster": ""}, "bhutanese": {"title": "不丹人", "poster": ""}, "bolivian": {"title": "玻利维亚人", "poster": ""}, "bosnian": {"title": "波斯尼亚人", "poster": ""}, "botswanan": {"title": "博茨瓦纳人", "poster": ""}, "brazilian": {"title": "巴西人", "poster": ""}, "british": {"title": "英国帅哥", "poster": ""}, "bruneian": {"title": "文莱人", "poster": ""}, "burmese": {"title": "缅甸人", "poster": ""}, "cambodian": {"title": "高棉人", "poster": ""}, "cameroonian": {"title": "喀麦隆人", "poster": ""}, "canadian": {"title": "加拿大人", "poster": ""}, "central-african": {"title": "中非人", "poster": ""}, "chadian": {"title": "乍得人", "poster": ""}, "chilean": {"title": "智利人", "poster": ""}, "colombian": {"title": "哥伦比亚人", "poster": ""}, "comorian": {"title": "科摩罗人", "poster": ""}, "congo-brazzaville": {"title": "刚果（布）人", "poster": ""}, "costa-rican": {"title": "哥斯达黎加人", "poster": ""}, "cuban": {"title": "古巴人", "poster": ""}, "cypriot": {"title": "塞浦路斯人", "poster": ""}, "dominican": {"title": "多米尼加人", "poster": ""}, "ecuadorian": {"title": "厄瓜多尔人", "poster": ""}, "egyptian": {"title": "埃及人", "poster": ""}, "emiri": {"title": "阿联酋人", "poster": ""}, "eritrean": {"title": "厄立特里亚人", "poster": ""}, "estonian": {"title": "爱沙尼亚人", "poster": ""}, "ethiopian": {"title": "埃塞俄比亚人", "poster": ""}, "fijian": {"title": "斐济人", "poster": ""}, "filipino": {"title": "菲律宾男人", "poster": ""}, "french-polynesian": {"title": "法属波利尼西亚人", "poster": ""}, "gambian": {"title": "冈比亚人", "poster": ""}, "georgian": {"title": "格鲁吉亚人", "poster": ""}, "ghanaian": {"title": "加纳人", "poster": ""}, "greenlandic": {"title": "格陵兰人", "poster": ""}, "grenadian": {"title": "格林纳达人", "poster": ""}, "guadeloupean": {"title": "瓜德罗普岛人", "poster": ""}, "guamanian": {"title": "关岛人", "poster": ""}, "guatemalan": {"title": "危地马拉人", "poster": ""}, "guernsey": {"title": "根西岛人", "poster": ""}, "guinean": {"title": "几内亚人", "poster": ""}, "guyanese": {"title": "圭亚那人", "poster": ""}, "haitian": {"title": "海地人", "poster": ""}, "honduran": {"title": "洪都拉斯人", "poster": ""}, "hong-kong": {"title": "香港人", "poster": ""}, "icelandic": {"title": "冰岛人", "poster": ""}, "iranian": {"title": "伊朗人", "poster": ""}, "iraqi": {"title": "伊拉克人", "poster": ""}, "irish": {"title": "爱尔兰人", "poster": ""}, "israeli": {"title": "以色列人", "poster": ""}, "ivorian": {"title": "科特迪瓦人", "poster": ""}, "jamaican": {"title": "牙买加人", "poster": ""}, "jordanian": {"title": "约旦人", "poster": ""}, "kazakh": {"title": "哈萨克人", "poster": ""}, "kenyan": {"title": "肯尼亚人", "poster": ""}, "kuwaiti": {"title": "科威特人", "poster": ""}, "kyrgyz": {"title": "吉尔吉斯斯坦人", "poster": ""}, "lao": {"title": "老挝人", "poster": ""}, "latvian": {"title": "拉脱维亚人", "poster": ""}, "lebanese": {"title": "黎巴嫩人", "poster": ""}, "liberian": {"title": "利比里亚人", "poster": ""}, "libyan": {"title": "利比亚人", "poster": ""}, "lithuanian": {"title": "立陶宛人", "poster": ""}, "luxembourg": {"title": "卢森堡人", "poster": ""}, "macedonian": {"title": "马其顿人", "poster": ""}, "malagasy": {"title": "马尔加什人", "poster": ""}, "malawian": {"title": "马拉维人", "poster": ""}, "malaysian": {"title": "马来西亚人", "poster": ""}, "maldivian": {"title": "马尔代夫人", "poster": ""}, "malian": {"title": "马里人", "poster": ""}, "maltese": {"title": "马耳他人", "poster": ""}, "manx": {"title": "马恩岛人", "poster": ""}, "marshallese": {"title": "马绍尔人", "poster": ""}, "mauritanian": {"title": "毛里塔尼亚人", "poster": ""}, "mauritian": {"title": "毛里求斯人", "poster": ""}, "mexican": {"title": "墨西哥人", "poster": ""}, "moldovan": {"title": "摩尔多瓦人", "poster": ""}, "montenegrin": {"title": "黑山人", "poster": ""}, "moroccan": {"title": "摩洛哥人", "poster": ""}, "mozambican": {"title": "莫桑比克人", "poster": ""}, "namibian": {"title": "纳米比亚人", "poster": ""}, "new-zealand": {"title": "新西兰人", "poster": ""}, "nicaraguan": {"title": "尼加拉瓜人", "poster": ""}, "nigerian": {"title": "尼日利亚人", "poster": ""}, "norwegian": {"title": "挪威人", "poster": ""}, "omani": {"title": "阿曼人", "poster": ""}, "pakistani": {"title": "巴基斯坦人", "poster": ""}, "palauan": {"title": "帕劳人", "poster": ""}, "palestinian": {"title": "巴勒斯坦人", "poster": ""}, "panamanian": {"title": "巴拿马人", "poster": ""}, "papuan": {"title": "巴布亚人", "poster": ""}, "paraguayan": {"title": "巴拉圭人", "poster": ""}, "peruvian": {"title": "秘鲁人", "poster": ""}, "puerto-rican": {"title": "波多黎各人", "poster": ""}, "qatari": {"title": "卡塔尔人", "poster": ""}, "rwandan": {"title": "卢旺达人", "poster": ""}, "salvadoran": {"title": "萨尔瓦多人", "poster": ""}, "samoan": {"title": "萨摩亚人", "poster": ""}, "saudi": {"title": "沙特人", "poster": ""}, "scottish": {"title": "苏格兰人", "poster": ""}, "senegalese": {"title": "塞内加尔人", "poster": ""}, "serbian": {"title": "塞尔维亚人", "poster": ""}, "sierra-leonean": {"title": "塞拉利昂人", "poster": ""}, "singaporean": {"title": "新加坡人", "poster": ""}, "slovak": {"title": "斯洛伐克人", "poster": ""}, "slovenian": {"title": "斯洛文尼亚人", "poster": ""}, "solomon-island": {"title": "所罗门群岛人", "poster": ""}, "somali": {"title": "索马里人", "poster": ""}, "south-african": {"title": "南非人", "poster": ""}, "south-sudanese": {"title": "南苏丹人", "poster": ""}, "sri-lankan": {"title": "斯里兰卡人", "poster": ""}, "sudanese": {"title": "苏丹人", "poster": ""}, "surinamese": {"title": "苏里南人", "poster": ""}, "swazi": {"title": "斯威士兰人", "poster": ""}, "swiss": {"title": "瑞士人", "poster": ""}, "syrian": {"title": "叙利亚人", "poster": ""}, "taiwanese": {"title": "台湾人", "poster": ""}, "tajik": {"title": "塔吉克人", "poster": ""}, "tanzanian": {"title": "坦桑尼亚人", "poster": ""}, "timorese": {"title": "东帝汶人", "poster": ""}, "togolese": {"title": "多哥人", "poster": ""}, "tongan": {"title": "汤加人", "poster": ""}, "trinidadian": {"title": "特立尼达人", "poster": ""}, "tunisian": {"title": "突尼斯人", "poster": ""}, "turkmen": {"title": "土库曼人", "poster": ""}, "ugandan": {"title": "乌干达人", "poster": ""}, "uruguayan": {"title": "乌拉圭人", "poster": ""}, "us-outlying-islands": {"title": "美国离岛人", "poster": ""}, "usvi": {"title": "美属维尔京群岛人", "poster": ""}, "uzbek": {"title": "乌兹别克人", "poster": ""}, "vatican": {"title": "梵帝冈人", "poster": ""}, "venezuelan": {"title": "委内瑞拉人", "poster": ""}, "yemeni": {"title": "也门人", "poster": ""}, "zambian": {"title": "赞比亚人", "poster": ""}, "zimbabwean": {"title": "津巴布韦人", "poster": ""}, "ai": {"title": "人工智能", "poster": ""}, "ar": {"title": "الإباحية باللغة العربية", "poster": ""}, "bg": {"title": "Porn In Bulgarian", "poster": ""}, "bn": {"title": "বাংলা ভাষায় সেক্স ভিডিও", "poster": ""}, "br": {"title": "Porn e brezhoneg", "poster": ""}, "cs": {"title": "Porno v češtině", "poster": ""}, "cy": {"title": "Porn yn Gymraeg", "poster": ""}, "da": {"title": "Porn In Danish", "poster": ""}, "de": {"title": "Pornos auf Deutsch", "poster": ""}, "el": {"title": "Πορνό στα ελληνικά", "poster": ""}, "en": {"title": "Porn In English", "poster": ""}, "es": {"title": "Porno en español", "poster": ""}, "fa": {"title": "سکس به زبان فارسی", "poster": ""}, "fi": {"title": "Pornoa suomeksi", "poster": ""}, "fo": {"title": "Porn In Faroese", "poster": ""}, "fr": {"title": "Porno en français", "poster": ""}, "gl": {"title": "Porno en galego", "poster": ""}, "ha": {"title": "Batsa a Hausa", "poster": ""}, "he": {"title": "סקס בעברית", "poster": ""}, "hi": {"title": "हिंदी में अश्लील", "poster": ""}, "hr": {"title": "Pornografija na hrvatskom", "poster": ""}, "hu": {"title": "Magyar pornó", "poster": ""}, "id": {"title": "Porno di indonesia", "poster": ""}, "it": {"title": "Porno in italiano", "poster": ""}, "ja": {"title": "日本のアダルト動画", "poster": ""}, "km": {"title": "ភាពអាសអាភាសជាភាសាខ្មែរ", "poster": ""}, "ko": {"title": "한국어로 된 포르노", "poster": ""}, "ml": {"title": "മലയാളത്തിൽ അശ്ലീലം", "poster": ""}, "mn": {"title": "Монгол хэлээр порно", "poster": ""}, "mr": {"title": "मराठीत सेक्स", "poster": ""}, "ms": {"title": "Lucah Melayu", "poster": ""}, "ne": {"title": "नेपालीमा पोर्न", "poster": ""}, "nl": {"title": "Porno in het Nederlands", "poster": ""}, "pa": {"title": "ਪੰਜਾਬੀ ਵਿੱਚ ਪੋਰਨ", "poster": ""}, "pl": {"title": "Porno po polsku", "poster": ""}, "pt": {"title": "Vídeo pornô em português", "poster": ""}, "ro": {"title": "Porno în limba română", "poster": ""}, "ru": {"title": "Порно на русском", "poster": ""}, "sd": {"title": "Porn In Sindhi", "poster": ""}, "si": {"title": "සිංහලෙන් අශ්ලීල", "poster": ""}, "sv": {"title": "Porr på svenska", "poster": ""}, "ta": {"title": "தமிழில் அசல்", "poster": ""}, "te": {"title": "తెలుగులో సెక్స్", "poster": ""}, "th": {"title": "หนังโป๊ไทย", "poster": ""}, "tl": {"title": "Pornograpiya sa Tagalog", "poster": ""}, "tr": {"title": "Türkçe porno", "poster": ""}, "uk": {"title": "Порно українською мовою", "poster": ""}, "ur": {"title": "اردو میں فحش", "poster": ""}, "vi": {"title": "Khiêu Dâm ở Việt Nam", "poster": ""}, "yo": {"title": "Asán ni Yoruba", "poster": ""}, "zh": {"title": "中文色情", "poster": ""}};

var STREAM_CACHE = {};
var STREAM_TTL = 10 * 60 * 1000;

function xhHeaders() {
  return {
    "User-Agent": XH_UA,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    Referer: XH_BASE + "/",
  };
}

function xhAbsolute(value) {
  if (!value) return "";
  var url = String(value).trim();
  if (!url) return "";
  if (url.indexOf("//") === 0) return "https:" + url;
  if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) return url;
  if (url.charAt(0) === "/") return XH_BASE + url;
  return XH_BASE + "/" + url;
}

function xhDecode(value) {
  if (!value) return "";
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (_, code) {
      return String.fromCharCode(parseInt(code, 10));
    })
    .replace(/&#x([0-9a-fA-F]+);/g, function (_, code) {
      return String.fromCharCode(parseInt(code, 16));
    })
    .replace(/\s+/g, " ")
    .trim();
}

function xhSlugFromUrl(url) {
  var m = String(url || "").match(/\/videos\/([^/?#]+)/);
  return m ? m[1] : "";
}

function xhSecondsToText(seconds) {
  var s = Math.max(0, Math.round(Number(seconds) || 0));
  var h = Math.floor(s / 3600);
  var m = Math.floor((s % 3600) / 60);
  var sec = s % 60;
  var pad = function (v) {
    return v < 10 ? "0" + v : String(v);
  };
  if (h > 0) return h + ":" + pad(m) + ":" + pad(sec);
  return m + ":" + pad(sec);
}

// 和 ONE 一样，把所有可能的图片字段都铺上，Rex 认哪个都行
function withImages(item, url) {
  if (!url) return item;
  item.coverUrl = url;
  item.posterUrl = url;
  item.posterURL = url;
  item.posterurl = url;
  item.poster_url = url;
  item.posterPath = url;
  item.poster_path = url;
  item.backdropPath = url;
  item.backdropPaths = [url];
  item.thumbnailUrl = url;
  item.imageUrl = url;
  item.detailPoster = url;
  item.detailPosterUrl = url;
  item.detailPosterURL = url;
  item.detail_poster = url;
  item.detail_poster_path = url;
  return item;
}

// ───────────────────────── 请求 ─────────────────────────

function xhSleep(ms) {
  return new Promise(function (resolve) {
    if (typeof setTimeout === "function") setTimeout(resolve, ms);
    else resolve();
  });
}

function xhLooksLikeErrorPage(text) {
  if (!text || typeof text !== "string") return true;
  if (text.indexOf("error404-page") >= 0) return true;
  if (text.indexOf("error-page") >= 0 && text.indexOf("data-video-id=") < 0) return true;
  return false;
}

async function xhHttp(url) {
  var headers = xhHeaders();
  var lastError = null;
  // 网页是 GET 端点，先试 GET；POST 到页面 URL 会返回 404 错误页，必须识别出来再回落
  try {
    if (Widget.http && typeof Widget.http.get === "function") {
      var getResp = await Widget.http.get(url, { headers: headers });
      var getData = typeof getResp === "string" ? getResp : getResp && getResp.data;
      console.log("[xh.gay] GET " + url + " -> " + (typeof getData === "string" ? getData.length : "非字符串") + " 字符，预览：" + String(getData || "").slice(0, 150).replace(/\s+/g, " "));
      if (typeof getData === "string" && getData && !xhLooksLikeErrorPage(getData)) return getData;
      if (getData && !xhLooksLikeErrorPage(String(getData))) {
        try { return JSON.stringify(getData); } catch (_) { return String(getData); }
      }
      console.log("[xh.gay] GET 返回疑似错误页，改试 POST");
    }
  } catch (e) {
    console.log("[xh.gay] GET 抛错：" + e.message);
    lastError = e;
  }
  try {
    if (Widget.http && typeof Widget.http.post === "function") {
      var postResp = await Widget.http.post(url, "", { headers: headers });
      var postData = typeof postResp === "string" ? postResp : postResp && postResp.data;
      console.log("[xh.gay] POST " + url + " -> " + (typeof postData === "string" ? postData.length : "非字符串") + " 字符，预览：" + String(postData || "").slice(0, 150).replace(/\s+/g, " "));
      if (typeof postData === "string" && postData && !xhLooksLikeErrorPage(postData)) return postData;
      if (postData && !xhLooksLikeErrorPage(String(postData))) {
        try { return JSON.stringify(postData); } catch (_) { return String(postData); }
      }
      console.log("[xh.gay] POST 返回疑似错误页");
    }
  } catch (e) {
    console.log("[xh.gay] POST 抛错：" + e.message);
    lastError = e;
  }
  throw lastError || new Error("请求失败：" + url);
}

// Rex 里到网站的 TLS 连接会间歇性失败（09:12 日志：列表调用三次全是 TLS 错误），
// 3 次重试、间隔 2 秒不够。改成 5 次、退避 1s/2s/4s/8s，总窗口约 15 秒，
// 扛住短暂的网络抖动；如果 VPN 本身断了，重试也救不了。
async function fetchHtml(url) {
  var backoff = [1000, 2000, 4000, 8000];
  var lastError = null;
  for (var attempt = 1; attempt <= 5; attempt++) {
    try {
      var data = await xhHttp(url);
      if (data) return data;
      throw new Error("空内容：" + url);
    } catch (error) {
      lastError = error;
      console.log("[xh.gay] fetch 失败 第" + attempt + "/5次：" + error.message);
      if (attempt < 5) await xhSleep(backoff[attempt - 1]);
    }
  }
  throw lastError;
}

// ───────────────────────── 列表解析 ─────────────────────────

function parseList(html) {
  var items = [];
  if (!html) return items;
  var seen = {};

  // 页面里嵌了一份 videoThumbProps JSON（pageURL/thumbURL/imageURL），
  // 桌面版只给前几张卡直出 <img>，后面的卡是骨架占位、图全在这份 JSON 里。
  // 先按 slug 建表，列表封面优先用它，<img> src 只作兜底。
  var posterBySlug = {};
  var jsonRe = /"pageURL":"([^"]+?)","thumbURL":"([^"]*?)","imageURL":"([^"]*?)"/g;
  var jm;
  while ((jm = jsonRe.exec(html)) !== null) {
    var pSlug = xhSlugFromUrl(jm[1].replace(/\\\//g, "/"));
    var iUrl = (jm[3] || jm[2] || "").replace(/\\\//g, "/");
    if (pSlug && iUrl && !posterBySlug[pSlug]) posterBySlug[pSlug] = iUrl;
  }

  var cardRe =
    /<div[^>]*class="[^"]*video-thumb[^"]*"[^>]*data-video-id="(\d+)"[\s\S]*?(?=<div[^>]*class="[^"]*video-thumb[^"]*"[^>]*data-video-id="|<div class="[^"]*pagination|$)/g;

  var cardMatch;
  while ((cardMatch = cardRe.exec(html)) !== null) {
    var card = cardMatch[0];
    var hrefMatch = card.match(/href="(https:\/\/[^"\/]+\/videos\/[^"]+)"/i);
    if (!hrefMatch) continue;
    var url = hrefMatch[1];
    var slug = xhSlugFromUrl(url);
    if (!slug || seen[slug]) continue;
    seen[slug] = true;

    var title = "";
    var titleAttr = card.match(/\btitle="([^"]{2,300})"/i);
    if (titleAttr) title = xhDecode(titleAttr[1]);
    if (!title) {
      var ariaAttr = card.match(/aria-label="([^"]{2,300})"/i);
      if (ariaAttr) title = xhDecode(ariaAttr[1]);
    }
    if (!title) title = xhDecode(slug.replace(/-/g, " "));

    var poster = "";
    var imgMatch = card.match(/<img\b[^>]*\bsrc="([^"]+)"/i);
    if (imgMatch) poster = xhAbsolute(imgMatch[1]);
    if (!poster) {
      var srcsetMatch = card.match(/\bsrcset="(https:\/\/[^"\s]+)/i);
      if (srcsetMatch) poster = xhAbsolute(srcsetMatch[1]);
    }
    // JSON 里的 imageURL 覆盖全量封面，优先用它（桌面版后面的卡片没有 <img>）
    if (posterBySlug[slug]) poster = posterBySlug[slug];

    var durationText = "";
    var durBlock = card.match(/data-role="video-duration"[\s\S]{0,400}?<\/div>/i);
    if (durBlock) {
      var durText = durBlock[0].replace(/<[^>]+>/g, " ").match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
      if (durText) durationText = durText[1];
    }

    var descBits = [];
    var upMatch = card.match(/video-uploader__name[^>]*>([\s\S]{0,80}?)<\/a>/i);
    if (upMatch) {
      var up = xhDecode(upMatch[1].replace(/<[^>]+>/g, ""));
      if (up) descBits.push(up);
    }
    var viewBlock = card.match(/video-thumb-views[^>]*>([\s\S]{0,120}?)<\/div>/i);
    if (viewBlock) {
      var vt = xhDecode(viewBlock[1].replace(/<[^>]+>/g, ""));
      if (vt) descBits.push(vt);
    }
    if (durationText) descBits.push(durationText);

    var item = {
      id: slug,
      type: "detail",
      mediaType: "movie",
      title: title,
      link: url,
      description: descBits.join(" · "),
    };
    if (durationText) item.durationText = durationText;

    items.push(withImages(item, poster));
  }

  return items;
}

// ───────────────────────── 详情解析 ─────────────────────────

function parseDetail(html, fallbackUrl) {
  var result = {
    title: "",
    description: "",
    poster: "",
    durationText: "",
    durationSeconds: 0,
    m3u8: "",
    previewMp4: "",
    genreTitle: "",
    releaseDate: "",
  };
  if (!html) return result;

  var ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
  if (ogTitle) result.title = xhDecode(ogTitle[1]);
  if (!result.title) {
    var h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1) result.title = xhDecode(h1[1].replace(/<[^>]+>/g, ""));
  }

  var ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i);
  if (ogImage) result.poster = xhAbsolute(ogImage[1]);

  var ogDesc = html.match(/<meta\s+name="description"\s+content='([^']*)'/i);
  if (!ogDesc) ogDesc = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  if (ogDesc) result.description = xhDecode(ogDesc[1]);

  var m3u8 = html.match(/(https:\/\/video-[a-z0-9]+\.xhcdn\.com\/[^"'\s<>]+\.m3u8)/i);
  if (m3u8) result.m3u8 = m3u8[1].replace(/\\\//g, "/");

  var mp4 = html.match(/(https:\/\/thumb-[a-z0-9]+\.xhcdn\.com\/[^"'\s<>]+\.mp4)/i);
  if (mp4) result.previewMp4 = mp4[1].replace(/\\\//g, "/");

  var dur = html.match(/"duration":(\d+)/);
  if (dur) {
    result.durationSeconds = Number(dur[1]);
    result.durationText = xhSecondsToText(result.durationSeconds);
  }

  var genres = [];
  var genreRe = /href="https:\/\/[^\/]+\/(?:gay\/)?categories-([a-z0-9\-]+)"/gi;
  var gm;
  while ((gm = genreRe.exec(html)) !== null) {
    var g = xhDecode(gm[1]);
    if (g && genres.indexOf(g) === -1) genres.push(g);
  }
  result.genreTitle = genres.slice(0, 6).join(", ");

  return result;
}

// ───────────────────────── HLS 选档 ─────────────────────────

function resolveRelative(base, rel) {
  if (!rel) return "";
  if (/^https?:\/\//i.test(rel)) return rel;
  if (rel.indexOf("//") === 0) return "https:" + rel;

  var baseNoQuery = base.split("?")[0].split("#")[0];
  var lastSlash = baseNoQuery.lastIndexOf("/");
  var dir = lastSlash >= 0 ? baseNoQuery.slice(0, lastSlash + 1) : baseNoQuery + "/";
  if (rel.charAt(0) === "/") {
    var m = baseNoQuery.match(/^(https?:\/\/[^/]+)/);
    return (m ? m[1] : "") + rel;
  }
  return dir + rel;
}

function pickBestVariant(manifest, masterUrl) {
  if (!manifest || manifest.indexOf("#EXT-X-STREAM-INF") === -1) return "";
  var lines = manifest.split(/\r?\n/);
  var best = null;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.indexOf("#EXT-X-STREAM-INF") !== 0) continue;

    var bwMatch = line.match(/BANDWIDTH=(\d+)/i);
    var resMatch = line.match(/RESOLUTION=(\d+)x(\d+)/i);
    var bandwidth = bwMatch ? Number(bwMatch[1]) : 0;
    var height = resMatch ? Number(resMatch[2]) : 0;

    var j = i + 1;
    while (j < lines.length && (!lines[j].trim() || lines[j].trim().charAt(0) === "#")) j++;
    if (j >= lines.length) break;
    var uri = lines[j].trim();

    if (!best || bandwidth > best.bandwidth || (bandwidth === best.bandwidth && height > best.height)) {
      best = { bandwidth: bandwidth, height: height, uri: resolveRelative(masterUrl, uri) };
    }
  }
  return best ? best.uri : "";
}

// 取 master 清单里的最高档位；失败时返回 master 本身
async function resolveBestVariant(masterUrl) {
  try {
    var manifest = await fetchHtml(masterUrl);
    var best = pickBestVariant(manifest, masterUrl);
    if (best) {
      var m = best.match(/\/(\d+)p\.[^\/]*\.m3u8/i);
      return { url: best, res: m ? m[1] + "p" : "" };
    }
  } catch (e) {
    console.log("[xh.gay] 取最高档位失败：" + e.message);
  }
  return { url: masterUrl, res: "" };
}

// ───────────────────────── 列表入口 ─────────────────────────

function listPath(kind) {
  switch (String(kind || "home")) {
    case "home":
      return "gay";
    case "newest":
      return "gay/newest";
    case "best":
      return "gay/best";
    case "shorts":
      return "gay/shorts";
    case "channels":
      return "gay/channels";
    case "pornstars":
      return "gay/pornstars";
    default:
      // 任意 cat-<slug> 直接对应 gay/categories/<slug>，不用逐个写 case
      if (kind && kind.indexOf("cat-") === 0) return "gay/categories/" + kind.slice(4);
      return "gay";
  }
}

// ───────────────────────── 大分类 → 小分类 ─────────────────────────

// 大分类标签页的内容：该大分类下的小分类列表。
// 每个小分类是一个 detail 条目，点进去由 loadDetail 的 xh://cat/ 分支
// 抓分类页并把视频塞进 relatedItems（和搜索结果页的做法一样）。
function groupItems(groupId) {
  var g = null;
  for (var i = 0; i < XH_GROUPS.length; i++) {
    if (XH_GROUPS[i].id === groupId) { g = XH_GROUPS[i]; break; }
  }
  if (!g) return [];
  var items = [];
  for (var j = 0; j < g.cats.length; j++) {
    var c = g.cats[j];
    var it = {
      id: "xh-cat-" + c.slug,
      type: "detail",
      mediaType: "movie",
      title: c.title,
      link: "xh://cat/" + c.slug,
      description: "分类 · " + g.label,
    };
    if (c.poster) withImages(it, c.poster);
    items.push(it);
  }
  return items;
}

// 分类文件夹的第一个视频（可播流），播放按钮和资源行共用，带缓存。
// Rex 会把 detail 当视频处理：文件夹没有 videoUrl 时，点播放就一直转圈，
// 所以文件夹的播放按钮就从第一个视频开始播。
var CAT_FIRST = {};

async function resolveCategoryFirst(slug, items) {
  var cached = CAT_FIRST[slug];
  if (cached) return cached;
  if (!items) {
    var html = await fetchHtml(XH_BASE + "/gay/categories/" + slug);
    items = parseList(html);
  }
  if (!items.length) return null;
  var first = items[0];
  var rec = await resolveStream(first.link);
  var p = rec.parsed;
  var best = p.m3u8 ? await resolveBestVariant(p.m3u8) : { url: "", res: "" };
  var info = {
    title: first.title || slug,
    videoUrl: best.url || p.m3u8 || p.previewMp4 || "",
    res: best.res || "",
    previewMp4: p.previewMp4 || "",
  };
  CAT_FIRST[slug] = info;
  return info;
}

// 小分类文件夹：抓分类页，把视频列表放进 relatedItems。
// 注意：文件夹一定不要带 videoUrl / childItems。
// Rex 只要看到 videoUrl 就会把文件夹当成单个视频，只播第一个、不显示列表
// （v14 就是这么坏的）。不带 videoUrl 时 Rex 会把 relatedItems 当列表显示，
// 播放按钮则走 loadResource 的 xh://cat/ 分支（播第一个视频）。
async function loadCategoryDetail(slug) {
  var info = XH_CAT_INFO[slug] || { title: slug, poster: "" };
  var url = XH_BASE + "/gay/categories/" + slug;
  console.log("[xh.gay] category=" + slug + " url=" + url);
  var html = await fetchHtml(url);
  var items = parseList(html);
  console.log("[xh.gay] category items=" + items.length);
  var item = {
    id: "xh-cat-" + slug,
    type: "detail",
    mediaType: "movie",
    title: info.title,
    link: "xh://cat/" + slug,
    description: "分类 · 共 " + items.length + " 个视频",
    relatedItems: items,
  };
  var poster = info.poster || (items.length ? items[0].posterUrl : "");
  if (poster) withImages(item, poster);
  return item;
}

async function loadList(params) {
  params = params || {};
  var kind = params.kind || "home";

  // 大分类标签页：直接返回该大分类下的小分类（不抓网页）
  if (kind.indexOf("group-") === 0) {
    return groupItems(kind.slice(6));
  }

  var rawPage = params.page;
  var page = parseInt(String(rawPage == null ? "1" : rawPage), 10);
  if (!isFinite(page) || page < 1) page = 1;

  var path = listPath(kind);
  var url = page <= 1 ? XH_BASE + "/" + path : XH_BASE + "/" + path + "/" + page;

  console.log("[xh.gay] loadList kind=" + kind + " page=" + page + " url=" + url);
  var html = await fetchHtml(url);
  var items = parseList(html);
  console.log("[xh.gay] loadList items=" + items.length);
  return items;
}

// ───────────────────────── 搜索 ─────────────────────────

async function searchVideos(params) {
  params = params || {};
  var keyword = String(params.keyword || params.query || params.q || "").trim();
  if (!keyword) return [];

  var page = parseInt(String(params.page == null ? "1" : params.page), 10);
  if (!isFinite(page) || page < 1) page = 1;

  var encoded = encodeURIComponent(keyword);
  var url = page <= 1
    ? XH_BASE + "/search/" + encoded
    : XH_BASE + "/search/" + encoded + "/" + page;

  console.log("[xh.gay] search=" + keyword + " page=" + page);
  var html = await fetchHtml(url);
  var items = parseList(html);
  console.log("[xh.gay] search items=" + items.length);

  // 和 ONE 的 detailKeyword 一样：返回一个 detail 条目，把结果塞进 relatedItems
  return {
    id: "xh-kw-" + keyword,
    type: "detail",
    mediaType: "movie",
    title: keyword,
    description: "搜索 · 共 " + items.length + " 条",
    link: "xh://k/" + encoded,
    relatedItems: items,
  };
}

// ───────────────────────── 详情 ─────────────────────────

function resolveLink(link) {
  var raw = String(link || "").trim();
  if (!raw) return "";
  if (raw.indexOf("xh://k/") === 0) return ""; // 关键词页不需要抓详情
  if (/^https?:\/\//.test(raw)) return xhAbsolute(raw);
  if (raw.indexOf("/videos/") === 0) return XH_BASE + raw;
  if (raw.indexOf("videos/") === 0) return XH_BASE + "/" + raw;
  // 纯 slug
  if (/^[a-z0-9\-]+$/i.test(raw)) return XH_BASE + "/videos/" + raw;
  return "";
}

async function resolveStream(url) {
  var cached = STREAM_CACHE[url];
  if (cached && Date.now() - cached.ts < STREAM_TTL) return cached;

  var html = await fetchHtml(url);
  var parsed = parseDetail(html, url);
  var rec = { parsed: parsed, ts: Date.now() };
  STREAM_CACHE[url] = rec;
  return rec;
}

async function loadDetail(link) {
  var raw = String(link || "").trim();

  // 小分类文件夹
  if (raw.indexOf("xh://cat/") === 0) {
    var catSlug = raw.replace("xh://cat/", "");
    return await loadCategoryDetail(catSlug);
  }

  // 关键词结果页
  if (raw.indexOf("xh://k/") === 0) {
    var kw = decodeURIComponent(raw.replace("xh://k/", ""));
    var found = await searchVideos({ keyword: kw, page: 1 });
    return found;
  }

  var url = resolveLink(raw);
  if (!url) {
    throw new Error("无法识别 XH 链接：" + raw);
  }

  var rec = await resolveStream(url);
  var p = rec.parsed;
  var slug = xhSlugFromUrl(url);

  // 直接播放也要走最高档位：把 master 清单换成最高档位的子清单地址
  // （播放器拿到 master 清单会从最低档起播，所以详情页的 videoUrl 必须已经是最高档）
  var bestDetail = p.m3u8 ? await resolveBestVariant(p.m3u8) : { url: "", res: "" };
  var detailPlayUrl = bestDetail.url || p.m3u8 || p.previewMp4 || "";

  var bits = [];
  if (p.genreTitle) bits.push(p.genreTitle);
  if (p.durationText) bits.push(p.durationText);
  var head = bits.join(" · ");
  var body = p.description || "";
  var desc = body ? (head ? head + "\n" + body : body) : head;

  var item = {
    id: slug,
    type: "detail",
    mediaType: "movie",
    title: p.title || xhDecode(slug.replace(/-/g, " ")),
    link: url,
    description: desc,
    overview: body,
    videoUrl: detailPlayUrl,
  };

  if (p.durationSeconds > 0) {
    item.duration = p.durationSeconds;
    item.durationText = p.durationText;
  }
  if (p.genreTitle) item.genreTitle = p.genreTitle;

  // 多线路塞进 childItems，和 ONE 的做法一致
  var lines = [];
  if (p.m3u8) {
    lines.push({ name: bestDetail.res ? "HLS " + bestDetail.res : "HLS 最高画质", description: "最高画质直出", url: detailPlayUrl });
  }
  if (p.previewMp4) {
    lines.push({ name: "预览 MP4", description: "低码率预览", url: p.previewMp4 });
  }
  if (lines.length) {
    item.childItems = lines.map(function (l, idx) {
      return {
        id: slug + "-" + (idx + 1),
        type: "url",
        mediaType: "movie",
        title: l.name,
        description: l.description,
        videoUrl: l.url,
        link: l.url,
      };
    });
  }

  console.log("[xh.gay] loadDetail title=" + item.title + " lines=" + lines.length);
  return withImages(item, p.poster);
}

// ───────────────────────── 播放资源 ─────────────────────────

async function loadResource(params) {
  params = params || {};
  console.log("[xh.gay] loadResource params=" + JSON.stringify(params));
  // Rex 可能直接传字符串链接，也可能传 {link,title} 对象，两种都接
  var link = "";
  if (typeof params === "string") link = params;
  else link = params.link || params.url || params.id || "";

  // 分类文件夹：返回第一个视频的可播流（播放按钮和资源行共用）
  if (typeof link === "string" && link.indexOf("xh://cat/") === 0) {
    var catSlug = link.replace("xh://cat/", "");
    var first = await resolveCategoryFirst(catSlug, null);
    if (first && first.videoUrl) {
      var out = [{ name: first.res ? "HLS " + first.res : "HLS 最高画质", description: "从第一个视频开始：" + first.title, url: first.videoUrl }];
      if (first.previewMp4) out.push({ name: "预览 MP4", description: "低码率预览", url: first.previewMp4 });
      console.log("[xh.gay] loadResource 分类文件夹资源数=" + out.length);
      return out;
    }
    return [{ name: "❌分类为空", description: "该分类下没有视频", url: XH_BASE + "/gay/categories/" + catSlug }];
  }

  var url = resolveLink(link);
  console.log("[xh.gay] loadResource link=" + link + " -> url=" + url);

  if (!url) {
    console.log("[xh.gay] loadResource 无有效链接");
    return [{ name: "⚠️未收到链接", description: "params=" + JSON.stringify(params).slice(0, 120), url: XH_BASE + "/" }];
  }

  // 如果直接传进来的是 m3u8 地址，直接当 master 清单展开
  if (/\.m3u8(\?|#|$)/i.test(url)) {
    var playUrl = url;
    try {
      var manifest0 = await fetchHtml(url);
      var best0 = pickBestVariant(manifest0, url);
      if (best0) playUrl = best0;
    } catch (e) {
      console.log("[xh.gay] 展开 master 失败：" + e.message);
    }
    console.log("[xh.gay] loadResource 直连 m3u8 资源数=1");
    return [{ name: "HLS", description: "最高码率", url: playUrl }];
  }

  var rec;
  try {
    rec = await resolveStream(url);
  } catch (error) {
    console.log("[xh.gay] loadResource 取详情失败：" + error.message);
    return [{ name: "❌抓详情失败", description: error.message, url: url }];
  }
  var p = rec.parsed;
  console.log("[xh.gay] loadResource 解析到 m3u8=" + (p.m3u8 ? "有" : "无") + " mp4=" + (p.previewMp4 ? "有" : "无"));

  var out = [];

  if (p.m3u8) {
    var playUrl = p.m3u8;
    var playRes = "";
    try {
      var manifest = await fetchHtml(p.m3u8);
      var best = pickBestVariant(manifest, p.m3u8);
      if (best) {
        playUrl = best;
        var rm = best.match(/\/(\d+)p\.[^\/]*\.m3u8/i);
        if (rm) playRes = rm[1] + "p";
        console.log("[xh.gay] 选中高码率子清单");
      }
    } catch (error) {
      console.log("[xh.gay] 展开 master 失败：" + error.message);
    }
    out.push({ name: playRes ? "HLS " + playRes : "HLS", description: "最高码率", url: playUrl });
  }

  if (p.previewMp4) {
    out.push({ name: "预览 MP4", description: "低码率预览", url: p.previewMp4 });
  }

  if (!out.length) {
    console.log("[xh.gay] loadResource 未解析到地址");
    return [{ name: "❌没解析到地址", description: "详情页已抓到但无 m3u8/mp4", url: url }];
  }

  console.log("[xh.gay] loadResource 资源数=" + out.length + " 首条=" + (out[0] ? out[0].url.slice(0, 90) : ""));
  return out;
}

// 兼容别名
var getDetail = loadDetail;
var loadResources = loadResource;
var stream = loadResource;
var mediaHook = loadResource;
