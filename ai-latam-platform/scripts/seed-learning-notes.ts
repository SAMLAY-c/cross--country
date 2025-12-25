/**
 * 上传虚拟学习笔记数据到数据库
 * 运行方式: npx tsx scripts/seed-learning-notes.ts
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

const DUMMY_LEARNING_NOTES = [
  {
    title: "Prompt Engineering 基本功",
    slug: "prompt-engineering-core",
    category: "提示词工程",
    summary: "整理 Few-shot、Chain-of-Thought、自洽性等关键策略，形成可复制的提示词模板。",
    tags: ["Few-shot", "CoT", "Self-Consistency"],
    coverImage: "/eco-hero.svg",
    content: `# Prompt Engineering 基本功

一套可复用的 Prompt 模板，核心包含角色设定、目标边界、输出结构与约束条件。

## 核心策略

### Few-shot Learning
先用示例建立语感，让模型理解期望的输出格式。

### Chain-of-Thought (CoT)
引导模型进行步骤化推理，展示思考过程。

### Self-Consistency
让模型生成多个答案，再选择最一致的结果。

## 实践建议

1. **明确角色设定**: 告诉模型它是什么身份
2. **设定任务边界**: 明确什么可以做，什么不能做
3. **结构化输出**: 定义清晰的输出格式
4. **添加约束条件**: 限制长度、风格、范围

## 示例

\`\`\`
你是一位资深的提示词工程师。请帮我优化以下提示词，使其更加清晰和有效。

要求：
- 保持原意不变
- 增加具体指导
- 添加输出格式说明
\`\`\`
`,
    orderIndex: 0,
  },
  {
    title: "Agent 架构拆解",
    slug: "agent-architecture",
    category: "智能体",
    summary: "从工具调用、记忆系统、任务规划三条主线拆解 Agent 框架，形成可落地的模块清单。",
    tags: ["Tooling", "Memory", "Planner"],
    coverImage: "/eco-hero.svg",
    content: `# Agent 架构拆解

从工具调用、记忆系统、任务规划三条主线拆解 Agent 框架。

## 核心模块

### 1. 工具调用 (Tooling)
- 任务拆解器
- 工具路由
- 执行反馈

### 2. 记忆系统 (Memory)
- 短期记忆
- 长期记忆
- 工作记忆

### 3. 任务规划 (Planner)
- 目标分解
- 步骤排序
- 进度跟踪

## 实现要点

核心模块包含：任务拆解器、工具路由、记忆检索与执行反馈。

重点是把状态机抽出来，保证每个步骤可回溯、可调试。
`,
    orderIndex: 4,
  },
  {
    title: "RAG 检索策略清单",
    slug: "rag-retrieval-playbook",
    category: "RAG",
    summary: "总结混合检索、向量召回、重排与评估指标，形成一份可执行的优化路径。",
    tags: ["Hybrid", "Rerank", "RAGAS"],
    coverImage: "/eco-hero.svg",
    content: `# RAG 检索策略清单

总结混合检索、向量召回、重排与评估指标。

## 优化路径

### 1. 混合检索
先用 BM25+向量混合召回保证覆盖率

### 2. 重排序
再用重排模型提升相关性

### 3. 评估指标
- 检索召回率
- 上下文相关性
- 答案准确率

## 实践建议

先用 BM25+向量混合召回保证覆盖率，再用重排模型提升相关性。

评估优先看检索召回率与上下文相关性。
`,
    orderIndex: 8,
  },
  {
    title: "提示词结构化写作法",
    slug: "prompt-structure-writing",
    category: "提示词工程",
    summary: "用角色、背景、目标、输出四段式结构化提示词，让模型稳定输出高质量结果。",
    tags: ["Structure", "Persona", "Constraints"],
    coverImage: "/eco-hero.svg",
    content: `# 提示词结构化写作法

用角色、背景、目标、输出四段式结构化提示词。

## 四段式结构

### 1. 角色设定
告诉模型它是什么身份，有什么专业知识。

### 2. 背景信息
提供必要的上下文和背景知识。

### 3. 任务目标
明确要完成的任务和期望结果。

### 4. 输出格式
定义清晰的输出结构和约束。

## 实践技巧

结构化写作法强调先定角色与语气，再给背景与目标，最后定义输出格式与限制条件。

当目标复杂时，先让模型复述任务再开始执行，可显著降低偏题率。
`,
    orderIndex: 1,
  },
  {
    title: "多轮提示的协作流程",
    slug: "multi-turn-prompt-flow",
    category: "提示词工程",
    summary: "将复杂任务拆成探索、收敛、交付三轮，逐步提升输出精度与一致性。",
    tags: ["Iteration", "Refine", "Workflow"],
    coverImage: "/eco-hero.svg",
    content: `# 多轮提示的协作流程

将复杂任务拆成探索、收敛、交付三轮。

## 三轮流程

### 第一轮：探索
- 只要方向与素材
- 快速产出初稿

### 第二轮：收敛
- 聚焦结构与风格
- 统一表达方式

### 第三轮：交付
- 补上细节与校验
- 最终质量把关

## 注意事项

每轮都给出评价标准，避免模型自由发挥导致漂移。

逐步迭代比一次性完成更可靠。
`,
    orderIndex: 2,
  },
  {
    title: "模型提示词校验清单",
    slug: "prompt-validation-checklist",
    category: "提示词工程",
    summary: "把输出质量拆成可检查的条目，避免上线后才发现格式或逻辑偏差。",
    tags: ["Checklist", "QA", "Spec"],
    coverImage: "/eco-hero.svg",
    content: `# 模型提示词校验清单

把输出质量拆成可检查的条目。

## 校验维度

### 必须满足
- ✅ 格式规范
- ✅ 范围准确
- ✅ 引用正确

### 常见错误
- ❌ 格式偏差
- ❌ 逻辑错误
- ❌ 内容缺失

## 优化方法

先列出必须满足的格式、范围、引用规范，再把常见错误转成否决项。

每次迭代只改一项条件，方便定位问题来源。
`,
    orderIndex: 3,
  },
  {
    title: "工具调用路由设计",
    slug: "agent-tool-routing",
    category: "智能体",
    summary: "用意图分类 + 约束规则做工具路由，降低误调用并提升执行成功率。",
    tags: ["Tooling", "Routing", "Guardrails"],
    coverImage: "/eco-hero.svg",
    content: `# 工具调用路由设计

用意图分类 + 约束规则做工具路由。

## 设计原则

### 1. 意图分类
定义清晰的意图标签与触发条件。

### 2. 约束规则
为每个工具设定输入校验与回退策略。

### 3. 安全机制
对高风险工具加入确认步骤。

## 实践建议

先定义意图标签与触发条件，再为每个工具设定输入校验与回退策略。

对高风险工具加入确认步骤，避免不可逆操作。
`,
    orderIndex: 5,
  },
  {
    title: "记忆系统的三层分工",
    slug: "agent-memory-layers",
    category: "智能体",
    summary: "区分短期、长期与工作记忆，让 Agent 在保持上下文的同时不过载。",
    tags: ["Memory", "Summarize", "Context"],
    coverImage: "/eco-hero.svg",
    content: `# 记忆系统的三层分工

区分短期、长期与工作记忆。

## 三层结构

### 短期记忆
保存最近对话内容。

### 工作记忆
保存当前任务关键变量。

### 长期记忆
向量检索历史信息。

## 管理策略

短期记忆保存最近对话，工作记忆保存当前任务关键变量，长期记忆做向量检索。

定期压缩摘要，保证上下文窗口可控。
`,
    orderIndex: 6,
  },
  {
    title: "任务分解与回放策略",
    slug: "agent-task-decomposition",
    category: "智能体",
    summary: "把复杂任务拆成可回放的步骤，确保每次执行都能定位失败环节。",
    tags: ["Planner", "Replay", "Steps"],
    coverImage: "/eco-hero.svg",
    content: `# 任务分解与回放策略

把复杂任务拆成可回放的步骤。

## 分解方法

### 三层结构
- 目标层
- 子任务层
- 检查点层

### 回放机制
记录每个步骤的输入与输出。

## 优化建议

用目标-子任务-检查点三层结构组织任务，再为每个步骤记录输入与输出。

回放时只重跑失败步骤，降低整体成本。
`,
    orderIndex: 7,
  },
  {
    title: "向量库评估指标速记",
    slug: "rag-vector-evaluation",
    category: "RAG",
    summary: "用召回率、命中率、平均相关性三指标评估检索质量并定位瓶颈。",
    tags: ["Recall", "Precision", "Metrics"],
    coverImage: "/eco-hero.svg",
    content: `# 向量库评估指标速记

用召回率、命中率、平均相关性评估检索质量。

## 核心指标

### 召回率 (Recall)
是否覆盖关键知识。

### 命中率 (Precision)
检索结果的相关性。

### 平均相关性
整体检索质量。

## 评估方法

先看召回率是否覆盖关键知识，再看命中率与平均相关性判断噪声。

每轮评估绑定具体 query 集与标注样本。
`,
    orderIndex: 9,
  },
  {
    title: "上下文压缩与重排",
    slug: "rag-context-compression",
    category: "RAG",
    summary: "通过压缩与重排减少上下文长度，提升模型回答的聚焦度。",
    tags: ["Compression", "Rerank", "Context"],
    coverImage: "/eco-hero.svg",
    content: `# 上下文压缩与重排

通过压缩与重排减少上下文长度。

## 压缩策略

### 抽取式摘要
筛掉无关段落。

### 重排序
选出最相关片段。

## 优化建议

先用抽取式摘要筛掉无关段，再用重排模型选出最高相关片段。

最终上下文按问题-证据顺序组织，保证回答可追溯。
`,
    orderIndex: 10,
  },
  {
    title: "知识切分与索引规则",
    slug: "rag-chunking-indexing",
    category: "RAG",
    summary: "从段落粒度、重叠比例、元数据设计三方面优化切分与索引质量。",
    tags: ["Chunking", "Index", "Metadata"],
    coverImage: "/eco-hero.svg",
    content: `# 知识切分与索引规则

从段落粒度、重叠比例、元数据设计三方面优化。

## 切分策略

### 语义边界
按自然段落切分。

### 重叠比例
10%-20% 重叠避免断裂。

### 元数据
来源、主题、更新时间。

## 实践建议

先按语义边界切分，再用 10%~20% 重叠避免上下文断裂。

为每个切片补上来源、主题与更新时间，方便检索与过滤。
`,
    orderIndex: 11,
  },
];

async function uploadLearningNotes() {
  console.log("开始上传学习笔记数据...\n");

  for (const note of DUMMY_LEARNING_NOTES) {
    try {
      const response = await fetch(`${API_BASE}/api/learning-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: note.title,
          slug: note.slug,
          category: note.category,
          summary: note.summary,
          tags: note.tags,
          cover_image: note.coverImage,
          content: note.content,
          order_index: note.orderIndex,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ 成功上传: ${note.title}`);
      } else {
        const error = await response.text();
        console.error(`❌ 上传失败: ${note.title}`);
        console.error(`   错误: ${error}`);
      }
    } catch (error) {
      console.error(`❌ 网络错误: ${note.title}`);
      console.error(`   ${error}`);
    }
  }

  console.log("\n上传完成！");
  console.log(`总计: ${DUMMY_LEARNING_NOTES.length} 条笔记`);
}

// 执行上传
uploadLearningNotes().catch(console.error);
