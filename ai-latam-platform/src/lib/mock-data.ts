export const DUMMY_TOOLS = [
  {
    id: 1,
    name: "Kling AI",
    tag: "视频",
    description: "中国最强大的视频生成工具，Sora 的竞争对手。",
    price: "免费试用",
  },
  {
    id: 2,
    name: "Midjourney",
    tag: "图像",
    description: "艺术图像生成的黄金标准。",
    price: "付费",
  },
  {
    id: 3,
    name: "HeyGen",
    tag: "数字人",
    description: "声音克隆和逼真视频数字人，用于营销推广。",
    price: "免费增值",
  },
  {
    id: 4,
    name: "Notion AI",
    tag: "生产力",
    description: "你的第二大脑，现在拥有魔法般的写作能力。",
    price: "付费",
  },
  {
    id: 5,
    name: "Gamma",
    tag: "演示",
    description: "用 AI 在几秒钟内创建演示文稿。",
    price: "免费增值",
  },
];

export const DUMMY_PROMPTS = [
  {
    id: 1,
    title: "Reels 爆款脚本",
    category: "营销",
    platforms: ["GPT-4", "Claude"],
    preview: "你是创意策略师。为一个带货 Reels 生成 30 秒脚本...",
    prompt:
      "你是创意策略师。为[产品]生成一个 30 秒 Reels 脚本。开头 3 秒必须有强钩子，包含快速演示，并以直接 CTA 结尾。语气：高能、鼓舞。",
  },
  {
    id: 2,
    title: "产品发布简报",
    category: "产品",
    platforms: ["GPT-4", "Gemini"],
    preview: "你是资深 PMM，为新产品撰写发布简报...",
    prompt:
      "你是资深产品市场经理。为[产品]撰写发布简报，包含目标人群、价值主张、定位、关键信息、渠道与 KPI。",
  },
  {
    id: 3,
    title: "广告创意点子",
    category: "广告",
    platforms: ["GPT-4"],
    preview: "为某品牌生成 10 条 Meta Ads 广告创意...",
    prompt:
      "为[行业]品牌生成 10 条 Meta Ads 创意，包含格式、钩子、主文案与 CTA。",
  },
  {
    id: 4,
    title: "内容计划表",
    category: "社媒",
    platforms: ["Claude", "GPT-4"],
    preview: "生成 30 天内容日历，包含主题与目标...",
    prompt:
      "为[品牌]生成 30 天内容日历，每天包含主题、形式、目标与 CTA。",
  },
  {
    id: 5,
    title: "Midjourney 画面提示词",
    category: "创意",
    platforms: ["Midjourney"],
    preview: "为夜景暖光画面生成电影感提示词...",
    prompt:
      "生成电影感提示词：夜晚木屋场景，室内暖光，潮湿森林，轻雾，编辑风摄影，35mm，景深明显，低调光。",
  },
  {
    id: 6,
    title: "销售邮件模板",
    category: "销售",
    platforms: ["GPT-4", "Claude"],
    preview: "撰写一封咨询式 B2B 销售邮件...",
    prompt:
      "为[产品]撰写咨询式 B2B 销售邮件，包含痛点、价值主张、社会证明与预约演示 CTA。",
  },
];

export const DUMMY_POSTS = [
  {
    id: 1,
    title: "Midjourney V6 提示词工程全面指南",
    excerpt: "从光影控制到材质渲染，拆解 V6 版本的核心逻辑与实战技巧。",
    tag: "深度测评",
    readTime: "8 Min Read",
    publishedAt: "2025.12.23",
  },
  {
    id: 2,
    title: "Claude 做客户调研的高效流程",
    excerpt: "用结构化提示词建立用户洞察框架，提高调研质量与效率。",
    tag: "增长实验",
    readTime: "6 Min Read",
    publishedAt: "2025.12.19",
  },
  {
    id: 3,
    title: "GPT-4o 视频脚本黄金模板",
    excerpt: "一套可复用的短视频脚本框架，适用于带货与品牌传播。",
    tag: "提示词拆解",
    readTime: "5 Min Read",
    publishedAt: "2025.12.12",
  },
];
