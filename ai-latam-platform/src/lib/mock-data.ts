export const DUMMY_TOOLS = [
  {
    id: 1,
    name: "Kling AI",
    tag: "视频",
    description: "中国最强大的视频生成工具，Sora 的竞争对手。",
    price: "免费试用",
    url: null,
  },
  {
    id: 2,
    name: "Midjourney",
    tag: "图像",
    description: "艺术图像生成的黄金标准。",
    price: "付费",
    url: null,
  },
  {
    id: 3,
    name: "HeyGen",
    tag: "数字人",
    description: "声音克隆和逼真视频数字人，用于营销推广。",
    price: "免费增值",
    url: null,
  },
  {
    id: 4,
    name: "Notion AI",
    tag: "生产力",
    description: "你的第二大脑，现在拥有魔法般的写作能力。",
    price: "付费",
    url: null,
  },
  {
    id: 5,
    name: "Gamma",
    tag: "演示",
    description: "用 AI 在几秒钟内创建演示文稿。",
    price: "免费增值",
    url: null,
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

export const DUMMY_LEARNING_NOTES = [
  {
    id: 1,
    title: "Prompt Engineering 基本功",
    slug: "prompt-engineering-core",
    category: "提示词工程",
    summary:
      "整理 Few-shot、Chain-of-Thought、自洽性等关键策略，形成可复制的提示词模板。",
    tags: ["Few-shot", "CoT", "Self-Consistency"],
    coverImage: "/eco-hero.svg",
    content:
      "一套可复用的 Prompt 模板，核心包含角色设定、目标边界、输出结构与约束条件。\n\n先用 Few-shot 建立语感，再用 CoT 引导步骤化推理，最后用 Self-Consistency 校验答案。",
    updatedAt: "2025-01-12T10:00:00.000Z",
  },
  {
    id: 4,
    title: "提示词结构化写作法",
    slug: "prompt-structure-writing",
    category: "提示词工程",
    summary:
      "用角色、背景、目标、输出四段式结构化提示词，让模型稳定输出高质量结果。",
    tags: ["Structure", "Persona", "Constraints"],
    coverImage: "/eco-hero.svg",
    content:
      "结构化写作法强调先定角色与语气，再给背景与目标，最后定义输出格式与限制条件。\n\n当目标复杂时，先让模型复述任务再开始执行，可显著降低偏题率。",
    updatedAt: "2025-01-10T16:40:00.000Z",
  },
  {
    id: 5,
    title: "多轮提示的协作流程",
    slug: "multi-turn-prompt-flow",
    category: "提示词工程",
    summary:
      "将复杂任务拆成探索、收敛、交付三轮，逐步提升输出精度与一致性。",
    tags: ["Iteration", "Refine", "Workflow"],
    coverImage: "/eco-hero.svg",
    content:
      "第一轮只要方向与素材，第二轮聚焦结构与风格，第三轮补上细节与校验。\n\n每轮都给出评价标准，避免模型自由发挥导致漂移。",
    updatedAt: "2025-01-07T12:15:00.000Z",
  },
  {
    id: 10,
    title: "模型提示词校验清单",
    slug: "prompt-validation-checklist",
    category: "提示词工程",
    summary:
      "把输出质量拆成可检查的条目，避免上线后才发现格式或逻辑偏差。",
    tags: ["Checklist", "QA", "Spec"],
    coverImage: "/eco-hero.svg",
    content:
      "先列出必须满足的格式、范围、引用规范，再把常见错误转成否决项。\n\n每次迭代只改一项条件，方便定位问题来源。",
    updatedAt: "2025-01-02T09:10:00.000Z",
  },
  {
    id: 2,
    title: "Agent 架构拆解",
    slug: "agent-architecture",
    category: "智能体",
    summary:
      "从工具调用、记忆系统、任务规划三条主线拆解 Agent 框架，形成可落地的模块清单。",
    tags: ["Tooling", "Memory", "Planner"],
    coverImage: "/eco-hero.svg",
    content:
      "核心模块包含：任务拆解器、工具路由、记忆检索与执行反馈。\n\n重点是把状态机抽出来，保证每个步骤可回溯、可调试。",
    updatedAt: "2025-01-08T09:30:00.000Z",
  },
  {
    id: 6,
    title: "工具调用路由设计",
    slug: "agent-tool-routing",
    category: "智能体",
    summary:
      "用意图分类 + 约束规则做工具路由，降低误调用并提升执行成功率。",
    tags: ["Tooling", "Routing", "Guardrails"],
    coverImage: "/eco-hero.svg",
    content:
      "先定义意图标签与触发条件，再为每个工具设定输入校验与回退策略。\n\n对高风险工具加入确认步骤，避免不可逆操作。",
    updatedAt: "2025-01-06T18:10:00.000Z",
  },
  {
    id: 7,
    title: "记忆系统的三层分工",
    slug: "agent-memory-layers",
    category: "智能体",
    summary:
      "区分短期、长期与工作记忆，让 Agent 在保持上下文的同时不过载。",
    tags: ["Memory", "Summarize", "Context"],
    coverImage: "/eco-hero.svg",
    content:
      "短期记忆保存最近对话，工作记忆保存当前任务关键变量，长期记忆做向量检索。\n\n定期压缩摘要，保证上下文窗口可控。",
    updatedAt: "2025-01-04T11:05:00.000Z",
  },
  {
    id: 11,
    title: "任务分解与回放策略",
    slug: "agent-task-decomposition",
    category: "智能体",
    summary:
      "把复杂任务拆成可回放的步骤，确保每次执行都能定位失败环节。",
    tags: ["Planner", "Replay", "Steps"],
    coverImage: "/eco-hero.svg",
    content:
      "用目标-子任务-检查点三层结构组织任务，再为每个步骤记录输入与输出。\n\n回放时只重跑失败步骤，降低整体成本。",
    updatedAt: "2025-01-03T17:30:00.000Z",
  },
  {
    id: 3,
    title: "RAG 检索策略清单",
    slug: "rag-retrieval-playbook",
    category: "RAG",
    summary:
      "总结混合检索、向量召回、重排与评估指标，形成一份可执行的优化路径。",
    tags: ["Hybrid", "Rerank", "RAGAS"],
    coverImage: "/eco-hero.svg",
    content:
      "先用 BM25+向量混合召回保证覆盖率，再用重排模型提升相关性。\n\n评估优先看检索召回率与上下文相关性。",
    updatedAt: "2025-01-05T14:20:00.000Z",
  },
  {
    id: 8,
    title: "向量库评估指标速记",
    slug: "rag-vector-evaluation",
    category: "RAG",
    summary:
      "用召回率、命中率、平均相关性三指标评估检索质量并定位瓶颈。",
    tags: ["Recall", "Precision", "Metrics"],
    coverImage: "/eco-hero.svg",
    content:
      "先看召回率是否覆盖关键知识，再看命中率与平均相关性判断噪声。\n\n每轮评估绑定具体 query 集与标注样本。",
    updatedAt: "2025-01-03T09:20:00.000Z",
  },
  {
    id: 9,
    title: "上下文压缩与重排",
    slug: "rag-context-compression",
    category: "RAG",
    summary:
      "通过压缩与重排减少上下文长度，提升模型回答的聚焦度。",
    tags: ["Compression", "Rerank", "Context"],
    coverImage: "/eco-hero.svg",
    content:
      "先用抽取式摘要筛掉无关段，再用重排模型选出最高相关片段。\n\n最终上下文按问题-证据顺序组织，保证回答可追溯。",
    updatedAt: "2025-01-02T15:45:00.000Z",
  },
  {
    id: 12,
    title: "知识切分与索引规则",
    slug: "rag-chunking-indexing",
    category: "RAG",
    summary:
      "从段落粒度、重叠比例、元数据设计三方面优化切分与索引质量。",
    tags: ["Chunking", "Index", "Metadata"],
    coverImage: "/eco-hero.svg",
    content:
      "先按语义边界切分，再用 10%~20% 重叠避免上下文断裂。\n\n为每个切片补上来源、主题与更新时间，方便检索与过滤。",
    updatedAt: "2025-01-01T12:40:00.000Z",
  },
];
