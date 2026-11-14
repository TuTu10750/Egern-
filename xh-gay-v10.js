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
  id: "user.xhgay10",
  title: "XH Gay",
  description: "zh.xhzone.life 男同视频 · 最新/热门/分类/搜索，HLS 直连",
  author: "YG",
  version: "1.1.0",
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
      id: "xh-cat-american",
      title: "美国人",
      description: "美国人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-american" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-old-young",
      title: "老少配",
      description: "老少配分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-old-young" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-daddy",
      title: "爸爸",
      description: "爸爸分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-daddy" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-amateur",
      title: "素人",
      description: "素人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-amateur" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bear",
      title: "强壮多毛男",
      description: "强壮多毛男分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bear" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-big-cock",
      title: "大鸡巴",
      description: "大鸡巴分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-big-cock" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bareback",
      title: "无套",
      description: "无套分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bareback" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-black",
      title: "黑人",
      description: "黑人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-black" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-crossdresser",
      title: "异装癖",
      description: "异装癖分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-crossdresser" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-blowjob",
      title: "口交",
      description: "口交分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-blowjob" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-twink",
      title: "年轻男同",
      description: "年轻男同分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-twink" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-homemade",
      title: "家庭自制",
      description: "家庭自制分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-homemade" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-femboy",
      title: "娘娘腔",
      description: "娘娘腔分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-femboy" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-straight-guy",
      title: "直男",
      description: "直男分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-straight-guy" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bbc",
      title: "大黑屌",
      description: "大黑屌分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bbc" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-3d",
      title: "3D",
      description: "3D分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-3d" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-show",
      title: "Show",
      description: "Show分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-show" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-voyeur",
      title: "偷窥癖",
      description: "偷窥癖分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-voyeur" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-anime",
      title: "动画",
      description: "动画分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-anime" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-cartoon",
      title: "卡通",
      description: "卡通分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-cartoon" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-compilation",
      title: "合集",
      description: "合集分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-compilation" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-vintage",
      title: "复古",
      description: "复古分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-vintage" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-hentai",
      title: "成人动漫",
      description: "成人动漫分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-hentai" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-close-up",
      title: "特写",
      description: "特写分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-close-up" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-reality",
      title: "现实",
      description: "现实分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-reality" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-webcam",
      title: "直播",
      description: "直播分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-webcam" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-pov",
      title: "第一人称视角",
      description: "第一人称视角分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-pov" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-pornstar",
      title: "色情明星",
      description: "色情明星分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-pornstar" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-69",
      title: "69式",
      description: "69式分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-69" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-kissing",
      title: "亲吻",
      description: "亲吻分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-kissing" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-creampie",
      title: "内射",
      description: "内射分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-creampie" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-double-penetration",
      title: "双洞齐插",
      description: "双洞齐插分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-double-penetration" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-cum-in-mouth",
      title: "口爆",
      description: "口爆分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-cum-in-mouth" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-cum-swallowing",
      title: "吞精",
      description: "吞精分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-cum-swallowing" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-cumshot",
      title: "射精",
      description: "射精分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-cumshot" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-handjob",
      title: "手交",
      description: "手交分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-handjob" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-fisting",
      title: "拳交",
      description: "拳交分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-fisting" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-fingering",
      title: "指交",
      description: "指交分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-fingering" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-massage",
      title: "按摩",
      description: "按摩分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-massage" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-deep-throat",
      title: "深喉",
      description: "深喉分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-deep-throat" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-rough-sex",
      title: "粗暴性爱",
      description: "粗暴性爱分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-rough-sex" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-cum-tribute",
      title: "精液致敬",
      description: "精液致敬分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-cum-tribute" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bukkake",
      title: "群交颜射",
      description: "群交颜射分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bukkake" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-anal",
      title: "肛交",
      description: "肛交分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-anal" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-anal-masturbation",
      title: "肛交自慰",
      description: "肛交自慰分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-anal-masturbation" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-felching",
      title: "肛门吸精",
      description: "肛门吸精分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-felching" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-masturbation",
      title: "自慰",
      description: "自慰分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-masturbation" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ass-licking",
      title: "舔肛",
      description: "舔肛分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ass-licking" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-hardcore",
      title: "重口味",
      description: "重口味分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-hardcore" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-facial",
      title: "颜射",
      description: "颜射分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-facial" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-riding",
      title: "骑乘",
      description: "骑乘分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-riding" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-facesitting",
      title: "骑脸",
      description: "骑脸分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-facesitting" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-sissy",
      title: "女装",
      description: "女装分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-sissy" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-slave",
      title: "奴隶",
      description: "奴隶分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-slave" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-fetish",
      title: "恋物癖",
      description: "恋物癖分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-fetish" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-foot-fetish",
      title: "恋足癖",
      description: "恋足癖分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-foot-fetish" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-spanking",
      title: "打屁股",
      description: "打屁股分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-spanking" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-oiled",
      title: "抹油",
      description: "抹油分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-oiled" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-whipping",
      title: "抽打",
      description: "抽打分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-whipping" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bondage",
      title: "捆绑",
      description: "捆绑分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bondage" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bdsm",
      title: "捆绑SM",
      description: "捆绑SM分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bdsm" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-pissing",
      title: "撒尿",
      description: "撒尿分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-pissing" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-domination",
      title: "支配",
      description: "支配分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-domination" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-shibari",
      title: "日式捆绑",
      description: "日式捆绑分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-shibari" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-feet",
      title: "美脚",
      description: "美脚分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-feet" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-humiliation",
      title: "羞辱",
      description: "羞辱分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-humiliation" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-gaping",
      title: "肛门扩张",
      description: "肛门扩张分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-gaping" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-jock",
      title: "体育生",
      description: "体育生分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-jock" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-middle-aged",
      title: "中年",
      description: "中年分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-middle-aged" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-dilf",
      title: "人夫",
      description: "人夫分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-dilf" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-young",
      title: "年轻",
      description: "年轻分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-young" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-mature",
      title: "成熟",
      description: "成熟分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-mature" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-grandpa",
      title: "爷爷",
      description: "爷爷分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-grandpa" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-old",
      title: "老的",
      description: "老的分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-old" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-teen",
      title: "青年",
      description: "青年分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-teen" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-asian",
      title: "亚洲人",
      description: "亚洲人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-asian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-desi",
      title: "印度",
      description: "印度分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-desi" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-indian",
      title: "印度人",
      description: "印度人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-indian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-mzansi",
      title: "姆赞西",
      description: "姆赞西分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-mzansi" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-latino",
      title: "拉丁帅哥",
      description: "拉丁帅哥分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-latino" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-european",
      title: "欧洲人",
      description: "欧洲人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-european" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-jewish",
      title: "犹太人",
      description: "犹太人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-jewish" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-white",
      title: "白人",
      description: "白人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-white" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-interracial",
      title: "跨人种",
      description: "跨人种分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-interracial" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-arab",
      title: "阿拉伯人",
      description: "阿拉伯人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-arab" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-african",
      title: "非洲人",
      description: "非洲人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-african" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-midget",
      title: "侏儒",
      description: "侏儒分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-midget" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-average-body",
      title: "大众身材",
      description: "大众身材分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-average-body" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-big-ass",
      title: "大屁股",
      description: "大屁股分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-big-ass" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-small-cock",
      title: "小鸡巴",
      description: "小鸡巴分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-small-cock" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-hunk",
      title: "建美男",
      description: "建美男分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-hunk" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-chubby",
      title: "微胖",
      description: "微胖分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-chubby" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-uncut",
      title: "未剪辑",
      description: "未剪辑分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-uncut" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-hairy",
      title: "毛发浓密",
      description: "毛发浓密分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-hairy" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-tattoo",
      title: "纹身",
      description: "纹身分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-tattoo" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-muscular",
      title: "肌肉发达",
      description: "肌肉发达分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-muscular" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-fat",
      title: "肥胖",
      description: "肥胖分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-fat" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bubble-butt",
      title: "蜜桃臀",
      description: "蜜桃臀分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bubble-butt" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-nude",
      title: "裸体",
      description: "裸体分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-nude" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-piercing",
      title: "身体穿孔",
      description: "身体穿孔分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-piercing" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-skinny",
      title: "骨感",
      description: "骨感分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-skinny" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-average-cock",
      title: "鸡巴尺寸一般",
      description: "鸡巴尺寸一般分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-average-cock" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-redhead",
      title: "红发",
      description: "红发分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-redhead" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-threesome",
      title: "3P",
      description: "3P分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-threesome" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-foursome",
      title: "4P",
      description: "4P分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-foursome" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-solo",
      title: "单人表演",
      description: "单人表演分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-solo" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-gangbang",
      title: "多对一群交",
      description: "多对一群交分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-gangbang" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-couple",
      title: "情侣",
      description: "情侣分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-couple" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-group-sex",
      title: "群交",
      description: "群交分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-group-sex" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-orgy",
      title: "群交派对",
      description: "群交派对分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-orgy" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-dildo",
      title: "假阳具",
      description: "假阳具分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-dildo" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ball-gag",
      title: "堵嘴球",
      description: "堵嘴球分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ball-gag" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-fucking-machine",
      title: "性爱机器",
      description: "性爱机器分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-fucking-machine" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-sex-doll",
      title: "成人娃娃",
      description: "成人娃娃分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-sex-doll" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-sex-toy",
      title: "成人玩具",
      description: "成人玩具分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-sex-toy" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-pump",
      title: "抽插",
      description: "抽插分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-pump" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-vibrator",
      title: "振动棒",
      description: "振动棒分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-vibrator" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-strapon",
      title: "穿戴式假阳具",
      description: "穿戴式假阳具分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-strapon" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-harness",
      title: "绑带",
      description: "绑带分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-harness" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-anal-toy",
      title: "肛交玩具",
      description: "肛交玩具分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-anal-toy" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-sleeve",
      title: "袖子",
      description: "袖子分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-sleeve" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-chain",
      title: "锁链",
      description: "锁链分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-chain" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ben-wa-balls",
      title: "阴道球",
      description: "阴道球分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ben-wa-balls" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-penis-ring",
      title: "鸡巴环",
      description: "鸡巴环分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-penis-ring" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-latex",
      title: "乳胶服",
      description: "乳胶服分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-latex" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-uniform",
      title: "制服",
      description: "制服分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-uniform" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-nylon",
      title: "尼龙袜",
      description: "尼龙袜分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-nylon" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-lingerie",
      title: "性感内衣",
      description: "性感内衣分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-lingerie" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-underwear",
      title: "水下",
      description: "水下分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-underwear" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-sneakers",
      title: "球鞋",
      description: "球鞋分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-sneakers" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-leather",
      title: "皮衣",
      description: "皮衣分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-leather" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-stockings",
      title: "长筒丝袜",
      description: "长筒丝袜分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-stockings" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-high-heels",
      title: "高跟鞋",
      description: "高跟鞋分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-high-heels" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-asmr",
      title: "ASMR",
      description: "ASMR分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-asmr" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-cook",
      title: "Cook",
      description: "Cook分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-cook" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-husband",
      title: "丈夫",
      description: "丈夫分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-husband" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-escort",
      title: "三陪",
      description: "三陪分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-escort" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-military",
      title: "军队",
      description: "军队分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-military" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-doctor",
      title: "医生",
      description: "医生分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-doctor" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-cruising",
      title: "巡航",
      description: "巡航分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-cruising" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-fantasy",
      title: "幻想",
      description: "幻想分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-fantasy" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-emo",
      title: "情绪摇滚",
      description: "情绪摇滚分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-emo" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-swingers",
      title: "换妻癖者",
      description: "换妻癖者分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-swingers" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-funny",
      title: "搞笑",
      description: "搞笑分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-funny" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-wrestling",
      title: "摔跤",
      description: "摔跤分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-wrestling" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-teacher",
      title: "教师",
      description: "教师分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-teacher" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-party",
      title: "派对",
      description: "派对分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-party" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-romantic",
      title: "浪漫",
      description: "浪漫分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-romantic" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-taboo",
      title: "禁忌",
      description: "禁忌分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-taboo" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-first-time",
      title: "第一次",
      description: "第一次分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-first-time" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-striptease",
      title: "脱衣表演",
      description: "脱衣表演分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-striptease" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-casting",
      title: "试镜",
      description: "试镜分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-casting" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-condom",
      title: "避孕套",
      description: "避孕套分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-condom" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-gym",
      title: "健身房",
      description: "健身房分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-gym" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-public",
      title: "公共场合",
      description: "公共场合分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-public" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-army",
      title: "军人",
      description: "军人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-army" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-office",
      title: "办公室",
      description: "办公室分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-office" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-college",
      title: "大学",
      description: "大学分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-college" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-glory-hole",
      title: "寻欢洞",
      description: "寻欢洞分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-glory-hole" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-outdoor",
      title: "户外",
      description: "户外分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-outdoor" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-locker-room",
      title: "更衣室",
      description: "更衣室分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-locker-room" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-sauna",
      title: "桑拿",
      description: "桑拿分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-sauna" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-car",
      title: "汽车",
      description: "汽车分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-car" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bathroom",
      title: "浴室",
      description: "浴室分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bathroom" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-beach",
      title: "海滩",
      description: "海滩分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-beach" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-zh",
      title: "中文色情",
      description: "中文色情分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-zh" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-yo",
      title: "Asán ni Yoruba",
      description: "Asán ni Yoruba分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-yo" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ha",
      title: "Batsa a Hausa",
      description: "Batsa a Hausa分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ha" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-vi",
      title: "Khiêu Dâm ở Việt Nam",
      description: "Khiêu Dâm ở Việt Nam分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-vi" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ms",
      title: "Lucah Melayu",
      description: "Lucah Melayu分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ms" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-hu",
      title: "Magyar pornó",
      description: "Magyar pornó分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-hu" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-br",
      title: "Porn e brezhoneg",
      description: "Porn e brezhoneg分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-br" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bg",
      title: "Porn In Bulgarian",
      description: "Porn In Bulgarian分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bg" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-da",
      title: "Porn In Danish",
      description: "Porn In Danish分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-da" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-en",
      title: "Porn In English",
      description: "Porn In English分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-en" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-fo",
      title: "Porn In Faroese",
      description: "Porn In Faroese分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-fo" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-sd",
      title: "Porn In Sindhi",
      description: "Porn In Sindhi分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-sd" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-cy",
      title: "Porn yn Gymraeg",
      description: "Porn yn Gymraeg分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-cy" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-id",
      title: "Porno di indonesia",
      description: "Porno di indonesia分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-id" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-es",
      title: "Porno en español",
      description: "Porno en español分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-es" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-fr",
      title: "Porno en français",
      description: "Porno en français分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-fr" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-gl",
      title: "Porno en galego",
      description: "Porno en galego分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-gl" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-nl",
      title: "Porno in het Nederlands",
      description: "Porno in het Nederlands分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-nl" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-it",
      title: "Porno in italiano",
      description: "Porno in italiano分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-it" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-pl",
      title: "Porno po polsku",
      description: "Porno po polsku分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-pl" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-cs",
      title: "Porno v češtině",
      description: "Porno v češtině分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-cs" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ro",
      title: "Porno în limba română",
      description: "Porno în limba română分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ro" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-fi",
      title: "Pornoa suomeksi",
      description: "Pornoa suomeksi分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-fi" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-hr",
      title: "Pornografija na hrvatskom",
      description: "Pornografija na hrvatskom分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-hr" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-tl",
      title: "Pornograpiya sa Tagalog",
      description: "Pornograpiya sa Tagalog分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-tl" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-de",
      title: "Pornos auf Deutsch",
      description: "Pornos auf Deutsch分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-de" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-sv",
      title: "Porr på svenska",
      description: "Porr på svenska分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-sv" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-tr",
      title: "Türkçe porno",
      description: "Türkçe porno分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-tr" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-pt",
      title: "Vídeo pornô em português",
      description: "Vídeo pornô em português分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-pt" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-el",
      title: "Πορνό στα ελληνικά",
      description: "Πορνό στα ελληνικά分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-el" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-mn",
      title: "Монгол хэлээр порно",
      description: "Монгол хэлээр порно分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-mn" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ru",
      title: "Порно на русском",
      description: "Порно на русском分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ru" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-uk",
      title: "Порно українською мовою",
      description: "Порно українською мовою分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-uk" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-he",
      title: "סקס בעברית",
      description: "סקס בעברית分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-he" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ur",
      title: "اردو میں فحش",
      description: "اردو میں فحش分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ur" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ar",
      title: "الإباحية باللغة العربية",
      description: "الإباحية باللغة العربية分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ar" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-fa",
      title: "سکس به زبان فارسی",
      description: "سکس به زبان فارسی分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-fa" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ne",
      title: "नेपालीमा पोर्न",
      description: "नेपालीमा पोर्न分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ne" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-mr",
      title: "मराठीत सेक्स",
      description: "मराठीत सेक्स分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-mr" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-hi",
      title: "हिंदी में अश्लील",
      description: "हिंदी में अश्लील分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-hi" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bn",
      title: "বাংলা ভাষায় সেক্স ভিডিও",
      description: "বাংলা ভাষায় সেক্স ভিডিও分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bn" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-pa",
      title: "ਪੰਜਾਬੀ ਵਿੱਚ ਪੋਰਨ",
      description: "ਪੰਜਾਬੀ ਵਿੱਚ ਪੋਰਨ分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-pa" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ta",
      title: "தமிழில் அசல்",
      description: "தமிழில் அசல்分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ta" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-te",
      title: "తెలుగులో సెక్స్",
      description: "తెలుగులో సెక్స్分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-te" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ml",
      title: "മലയാളത്തിൽ അശ്ലീലം",
      description: "മലയാളത്തിൽ അശ്ലീലം分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ml" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-si",
      title: "සිංහලෙන් අශ්ලීල",
      description: "සිංහලෙන් අශ්ලීල分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-si" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-th",
      title: "หนังโป๊ไทย",
      description: "หนังโป๊ไทย分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-th" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-km",
      title: "ភាពអាសអាភាសជាភាសាខ្មែរ",
      description: "ភាពអាសអាភាសជាភាសាខ្មែរ分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-km" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ja",
      title: "日本のアダルト動画",
      description: "日本のアダルト動画分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ja" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ko",
      title: "한국어로 된 포르노",
      description: "한국어로 된 포르노分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ko" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bhutanese",
      title: "不丹人",
      description: "不丹人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bhutanese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-timorese",
      title: "东帝汶人",
      description: "东帝汶人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-timorese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-central-african",
      title: "中非人",
      description: "中非人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-central-african" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-uzbek",
      title: "乌兹别克人",
      description: "乌兹别克人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-uzbek" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ugandan",
      title: "乌干达人",
      description: "乌干达人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ugandan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-uruguayan",
      title: "乌拉圭人",
      description: "乌拉圭人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-uruguayan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-chadian",
      title: "乍得人",
      description: "乍得人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-chadian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-yemeni",
      title: "也门人",
      description: "也门人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-yemeni" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-armenian",
      title: "亚美尼亚人",
      description: "亚美尼亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-armenian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ai",
      title: "人工智能",
      description: "人工智能分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ai" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-israeli",
      title: "以色列人",
      description: "以色列人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-israeli" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-iraqi",
      title: "伊拉克人",
      description: "伊拉克人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-iraqi" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-iranian",
      title: "伊朗人",
      description: "伊朗人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-iranian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-belizean",
      title: "伯利兹人",
      description: "伯利兹人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-belizean" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-guamanian",
      title: "关岛人",
      description: "关岛人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-guamanian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-gambian",
      title: "冈比亚人",
      description: "冈比亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-gambian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-icelandic",
      title: "冰岛人",
      description: "冰岛人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-icelandic" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-guinean",
      title: "几内亚人",
      description: "几内亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-guinean" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-congo-brazzaville",
      title: "刚果（布）人",
      description: "刚果（布）人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-congo-brazzaville" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-libyan",
      title: "利比亚人",
      description: "利比亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-libyan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-liberian",
      title: "利比里亚人",
      description: "利比里亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-liberian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-canadian",
      title: "加拿大人",
      description: "加拿大人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-canadian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ghanaian",
      title: "加纳人",
      description: "加纳人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ghanaian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-south-sudanese",
      title: "南苏丹人",
      description: "南苏丹人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-south-sudanese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-south-african",
      title: "南非人",
      description: "南非人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-south-african" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-botswanan",
      title: "博茨瓦纳人",
      description: "博茨瓦纳人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-botswanan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-qatari",
      title: "卡塔尔人",
      description: "卡塔尔人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-qatari" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-rwandan",
      title: "卢旺达人",
      description: "卢旺达人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-rwandan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-luxembourg",
      title: "卢森堡人",
      description: "卢森堡人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-luxembourg" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-guatemalan",
      title: "危地马拉人",
      description: "危地马拉人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-guatemalan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ecuadorian",
      title: "厄瓜多尔人",
      description: "厄瓜多尔人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ecuadorian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-eritrean",
      title: "厄立特里亚人",
      description: "厄立特里亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-eritrean" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-syrian",
      title: "叙利亚人",
      description: "叙利亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-syrian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-cuban",
      title: "古巴人",
      description: "古巴人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-cuban" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-taiwanese",
      title: "台湾人",
      description: "台湾人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-taiwanese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-kyrgyz",
      title: "吉尔吉斯斯坦人",
      description: "吉尔吉斯斯坦人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-kyrgyz" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-kazakh",
      title: "哈萨克人",
      description: "哈萨克人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-kazakh" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-colombian",
      title: "哥伦比亚人",
      description: "哥伦比亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-colombian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-costa-rican",
      title: "哥斯达黎加人",
      description: "哥斯达黎加人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-costa-rican" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-cameroonian",
      title: "喀麦隆人",
      description: "喀麦隆人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-cameroonian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-turkmen",
      title: "土库曼人",
      description: "土库曼人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-turkmen" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-guyanese",
      title: "圭亚那人",
      description: "圭亚那人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-guyanese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-tanzanian",
      title: "坦桑尼亚人",
      description: "坦桑尼亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-tanzanian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-egyptian",
      title: "埃及人",
      description: "埃及人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-egyptian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ethiopian",
      title: "埃塞俄比亚人",
      description: "埃塞俄比亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ethiopian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-tajik",
      title: "塔吉克人",
      description: "塔吉克人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-tajik" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-senegalese",
      title: "塞内加尔人",
      description: "塞内加尔人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-senegalese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-serbian",
      title: "塞尔维亚人",
      description: "塞尔维亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-serbian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-sierra-leonean",
      title: "塞拉利昂人",
      description: "塞拉利昂人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-sierra-leonean" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-cypriot",
      title: "塞浦路斯人",
      description: "塞浦路斯人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-cypriot" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-mexican",
      title: "墨西哥人",
      description: "墨西哥人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-mexican" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-togolese",
      title: "多哥人",
      description: "多哥人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-togolese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-dominican",
      title: "多米尼加人",
      description: "多米尼加人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-dominican" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-austrian",
      title: "奥地利人",
      description: "奥地利人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-austrian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-venezuelan",
      title: "委内瑞拉人",
      description: "委内瑞拉人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-venezuelan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bangladeshi",
      title: "孟加拉人",
      description: "孟加拉人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bangladeshi" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-angolan",
      title: "安哥拉人",
      description: "安哥拉人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-angolan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-antiguan",
      title: "安提瓜人",
      description: "安提瓜人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-antiguan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-andorran",
      title: "安道尔人",
      description: "安道尔人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-andorran" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-nicaraguan",
      title: "尼加拉瓜人",
      description: "尼加拉瓜人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-nicaraguan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-nigerian",
      title: "尼日利亚人",
      description: "尼日利亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-nigerian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-palestinian",
      title: "巴勒斯坦人",
      description: "巴勒斯坦人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-palestinian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bahamian",
      title: "巴哈马人",
      description: "巴哈马人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bahamian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-pakistani",
      title: "巴基斯坦人",
      description: "巴基斯坦人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-pakistani" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-barbadian",
      title: "巴巴多斯人",
      description: "巴巴多斯人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-barbadian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-papuan",
      title: "巴布亚人",
      description: "巴布亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-papuan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-paraguayan",
      title: "巴拉圭人",
      description: "巴拉圭人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-paraguayan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-panamanian",
      title: "巴拿马人",
      description: "巴拿马人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-panamanian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bahraini",
      title: "巴林人",
      description: "巴林人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bahraini" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-brazilian",
      title: "巴西人",
      description: "巴西人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-brazilian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-palauan",
      title: "帕劳人",
      description: "帕劳人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-palauan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-solomon-island",
      title: "所罗门群岛人",
      description: "所罗门群岛人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-solomon-island" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-latvian",
      title: "拉脱维亚人",
      description: "拉脱维亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-latvian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-norwegian",
      title: "挪威人",
      description: "挪威人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-norwegian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-moldovan",
      title: "摩尔多瓦人",
      description: "摩尔多瓦人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-moldovan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-moroccan",
      title: "摩洛哥人",
      description: "摩洛哥人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-moroccan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bruneian",
      title: "文莱人",
      description: "文莱人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bruneian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-fijian",
      title: "斐济人",
      description: "斐济人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-fijian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-swazi",
      title: "斯威士兰人",
      description: "斯威士兰人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-swazi" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-slovak",
      title: "斯洛伐克人",
      description: "斯洛伐克人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-slovak" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-slovenian",
      title: "斯洛文尼亚人",
      description: "斯洛文尼亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-slovenian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-sri-lankan",
      title: "斯里兰卡人",
      description: "斯里兰卡人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-sri-lankan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-singaporean",
      title: "新加坡人",
      description: "新加坡人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-singaporean" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-new-zealand",
      title: "新西兰人",
      description: "新西兰人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-new-zealand" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-chilean",
      title: "智利人",
      description: "智利人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-chilean" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-guernsey",
      title: "根西岛人",
      description: "根西岛人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-guernsey" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-grenadian",
      title: "格林纳达人",
      description: "格林纳达人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-grenadian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-greenlandic",
      title: "格陵兰人",
      description: "格陵兰人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-greenlandic" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-georgian",
      title: "格鲁吉亚人",
      description: "格鲁吉亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-georgian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-vatican",
      title: "梵帝冈人",
      description: "梵帝冈人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-vatican" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-spm",
      title: "每分钟抽插次数",
      description: "每分钟抽插次数分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-spm" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-belgian",
      title: "比利时人",
      description: "比利时人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-belgian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-mauritanian",
      title: "毛里塔尼亚人",
      description: "毛里塔尼亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-mauritanian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-mauritian",
      title: "毛里求斯人",
      description: "毛里求斯人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-mauritian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-tongan",
      title: "汤加人",
      description: "汤加人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-tongan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-saudi",
      title: "沙特人",
      description: "沙特人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-saudi" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-french-polynesian",
      title: "法属波利尼西亚人",
      description: "法属波利尼西亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-french-polynesian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-puerto-rican",
      title: "波多黎各人",
      description: "波多黎各人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-puerto-rican" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bosnian",
      title: "波斯尼亚人",
      description: "波斯尼亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bosnian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-zimbabwean",
      title: "津巴布韦人",
      description: "津巴布韦人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-zimbabwean" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-honduran",
      title: "洪都拉斯人",
      description: "洪都拉斯人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-honduran" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-haitian",
      title: "海地人",
      description: "海地人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-haitian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-australian",
      title: "澳大利亚人",
      description: "澳大利亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-australian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-irish",
      title: "爱尔兰人",
      description: "爱尔兰人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-irish" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-estonian",
      title: "爱沙尼亚人",
      description: "爱沙尼亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-estonian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-jamaican",
      title: "牙买加人",
      description: "牙买加人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-jamaican" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-trinidadian",
      title: "特立尼达人",
      description: "特立尼达人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-trinidadian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bolivian",
      title: "玻利维亚人",
      description: "玻利维亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bolivian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-swiss",
      title: "瑞士人",
      description: "瑞士人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-swiss" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-guadeloupean",
      title: "瓜德罗普岛人",
      description: "瓜德罗普岛人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-guadeloupean" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-man",
      title: "男人",
      description: "男人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-man" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-belarusian",
      title: "白俄罗斯人",
      description: "白俄罗斯人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-belarusian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-bermudian",
      title: "百慕大人",
      description: "百慕大人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-bermudian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-kuwaiti",
      title: "科威特人",
      description: "科威特人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-kuwaiti" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-comorian",
      title: "科摩罗人",
      description: "科摩罗人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-comorian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-ivorian",
      title: "科特迪瓦人",
      description: "科特迪瓦人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-ivorian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-peruvian",
      title: "秘鲁人",
      description: "秘鲁人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-peruvian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-tunisian",
      title: "突尼斯人",
      description: "突尼斯人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-tunisian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-lithuanian",
      title: "立陶宛人",
      description: "立陶宛人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-lithuanian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-somali",
      title: "索马里人",
      description: "索马里人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-somali" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-jordanian",
      title: "约旦人",
      description: "约旦人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-jordanian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-namibian",
      title: "纳米比亚人",
      description: "纳米比亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-namibian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-burmese",
      title: "缅甸人",
      description: "缅甸人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-burmese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-us-outlying-islands",
      title: "美国离岛人",
      description: "美国离岛人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-us-outlying-islands" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-usvi",
      title: "美属维尔京群岛人",
      description: "美属维尔京群岛人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-usvi" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-lao",
      title: "老挝人",
      description: "老挝人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-lao" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-kenyan",
      title: "肯尼亚人",
      description: "肯尼亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-kenyan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-prolapse",
      title: "脱肛",
      description: "脱肛分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-prolapse" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-sudanese",
      title: "苏丹人",
      description: "苏丹人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-sudanese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-scottish",
      title: "苏格兰人",
      description: "苏格兰人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-scottish" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-surinamese",
      title: "苏里南人",
      description: "苏里南人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-surinamese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-british",
      title: "英国帅哥",
      description: "英国帅哥分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-british" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-mozambican",
      title: "莫桑比克人",
      description: "莫桑比克人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-mozambican" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-filipino",
      title: "菲律宾男人",
      description: "菲律宾男人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-filipino" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-salvadoran",
      title: "萨尔瓦多人",
      description: "萨尔瓦多人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-salvadoran" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-samoan",
      title: "萨摩亚人",
      description: "萨摩亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-samoan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-beninese",
      title: "贝宁人",
      description: "贝宁人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-beninese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-zambian",
      title: "赞比亚人",
      description: "赞比亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-zambian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-azeri",
      title: "阿塞拜疆人",
      description: "阿塞拜疆人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-azeri" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-afghan",
      title: "阿富汗人",
      description: "阿富汗人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-afghan" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-algerian",
      title: "阿尔及利亚人",
      description: "阿尔及利亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-algerian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-albanian",
      title: "阿尔巴尼亚人",
      description: "阿尔巴尼亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-albanian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-omani",
      title: "阿曼人",
      description: "阿曼人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-omani" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-argentinian",
      title: "阿根廷人",
      description: "阿根廷人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-argentinian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-emiri",
      title: "阿联酋人",
      description: "阿联酋人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-emiri" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-aruban",
      title: "阿鲁巴人",
      description: "阿鲁巴人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-aruban" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-sfw",
      title: "非色情",
      description: "非色情分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-sfw" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-hong-kong",
      title: "香港人",
      description: "香港人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-hong-kong" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-macedonian",
      title: "马其顿人",
      description: "马其顿人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-macedonian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-maldivian",
      title: "马尔代夫人",
      description: "马尔代夫人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-maldivian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-malagasy",
      title: "马尔加什人",
      description: "马尔加什人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-malagasy" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-manx",
      title: "马恩岛人",
      description: "马恩岛人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-manx" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-malawian",
      title: "马拉维人",
      description: "马拉维人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-malawian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-malaysian",
      title: "马来西亚人",
      description: "马来西亚人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-malaysian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-marshallese",
      title: "马绍尔人",
      description: "马绍尔人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-marshallese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-maltese",
      title: "马耳他人",
      description: "马耳他人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-maltese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-malian",
      title: "马里人",
      description: "马里人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-malian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-cambodian",
      title: "高棉人",
      description: "高棉人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-cambodian" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-lebanese",
      title: "黎巴嫩人",
      description: "黎巴嫩人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-lebanese" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-montenegrin",
      title: "黑山人",
      description: "黑山人分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-montenegrin" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "xh-cat-the-handy",
      title: "The Handy",
      description: "The Handy分类 · 全部视频",
      requiresWebView: false,
      cacheDuration: 120,
      functionName: "loadList",
      params: [
        { name: "kind", title: "类型", type: "constant", value: "cat-the-handy" },
        { name: "page", title: "页码", type: "page" },
      ],
    },
  ],
};

// ───────────────────────── 常量 ─────────────────────────

var XH_BASE = "https://zh.xhzone.life";
var XH_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

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

async function loadList(params) {
  params = params || {};
  var kind = params.kind || "home";
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
    videoUrl: p.m3u8 || p.previewMp4 || "",
  };

  if (p.durationSeconds > 0) {
    item.duration = p.durationSeconds;
    item.durationText = p.durationText;
  }
  if (p.genreTitle) item.genreTitle = p.genreTitle;

  // 多线路塞进 childItems，和 ONE 的做法一致
  var lines = [];
  if (p.m3u8) {
    lines.push({ name: "HLS 自动", description: "自动选最高码率", url: p.m3u8 });
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
    try {
      var manifest = await fetchHtml(p.m3u8);
      var best = pickBestVariant(manifest, p.m3u8);
      if (best) {
        playUrl = best;
        console.log("[xh.gay] 选中高码率子清单");
      }
    } catch (error) {
      console.log("[xh.gay] 展开 master 失败：" + error.message);
    }
    out.push({ name: "HLS", description: "最高码率", url: playUrl });
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
