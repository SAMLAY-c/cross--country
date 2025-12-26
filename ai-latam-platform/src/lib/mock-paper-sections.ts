export type PaperVisual = {
  visual_type: "mermaid";
  visual_spec: string;
};

export type PaperSection = {
  id: number;
  section_index: number;
  title: string;
  explanation_md: string;
  visuals: PaperVisual[];
};

export const MOCK_PAPER_SECTIONS: PaperSection[] = [
  {
    id: 1,
    section_index: 0,
    title: "方法总览",
    explanation_md: [
      "本论文提出了一种 **Agentic RAG** 框架，",
      "将任务拆解为 *规划 → 检索 → 执行* 三个阶段。",
      "",
      "- 用规划器判断问题类型与子任务",
      "- 用检索器拉取外部证据",
      "- 用执行器输出可验证答案",
    ].join("\n"),
    visuals: [
      {
        visual_type: "mermaid",
        visual_spec: [
          "flowchart LR",
          "  Q[用户问题]",
          "  P[任务规划器]",
          "  R[检索器]",
          "  E[执行器]",
          "  A[答案]",
          "",
          "  Q --> P --> R --> E --> A",
        ].join("\n"),
      },
    ],
  },
  {
    id: 2,
    section_index: 1,
    title: "模块分工",
    explanation_md: [
      "系统按角色拆分，以便对每一段做可控评估。",
      "",
      "- Planner: 产出子任务与工具路由",
      "- Retriever: 找到证据与来源",
      "- Executor: 组合证据并生成答案",
    ].join("\n"),
    visuals: [
      {
        visual_type: "mermaid",
        visual_spec: [
          "flowchart TB",
          "  Planner -->|指令| Retriever",
          "  Retriever -->|证据| Executor",
          "  Planner -->|约束| Executor",
        ].join("\n"),
      },
    ],
  },
  {
    id: 3,
    section_index: 2,
    title: "实验与指标",
    explanation_md: [
      "评测关注三类指标：正确率、成本、可解释性。",
      "",
      "- 任务成功率提升 12-18%",
      "- 平均检索次数下降 24%",
      "- 计划步骤可追踪且可审计",
    ].join("\n"),
    visuals: [],
  },
  {
    id: 4,
    section_index: 3,
    title: "产品启示",
    explanation_md: [
      "将论文结论转成产品动作：",
      "",
      "- 上线任务分层与可视化流程",
      "- 把检索日志作为质量评估资产",
      "- 用成本预算控制多步推理",
    ].join("\n"),
    visuals: [],
  },
];
