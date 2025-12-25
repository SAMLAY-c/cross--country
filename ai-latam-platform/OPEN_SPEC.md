# OpenSpec 项目定制指南（AI LATAM 平台）

本项目的核心理念：**不要让 AI 猜你想要什么，而是先写好图纸，让 AI 按图施工。**

OpenSpec 在这个仓库中的定位是：把需求固化成“可执行的设计契约”，再让 AI 按契约生成代码。

---

## 一、OpenSpec 使用速查表（项目定制版）

| 步骤 | 阶段名称 | 你的角色 | 核心动作 | 产出物 (OpenSpec) | 工具/格式 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 01 | 设计契约 | 架构师 | 定义技术栈、数据模型、业务流程、UI 结构 | `specs/xxx_spec.md` 或 `types.ts` | Markdown + TS Interface + OpenAPI |
| 02 | 派发任务 | 包工头 | 把 Spec 发给 AI，给简短指令 | 提示词：“基于 spec 文件实现 xx 功能” | Cursor / Windsurf / Copilot |
| 03 | 代码生成 | 验收员 | AI 生成代码，你负责运行和检查 | 可运行代码 | IDE + 本地 Dev Server |
| 04 | 迭代修改 | 设计师 | 先改 Spec，再让 AI 重写 | 更新后的 Spec | Markdown |

---

## 二、项目专属约束（写 Spec 时必须明确）

### 1) 技术栈与目录约定
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4
- **Backend**: Express + Prisma (TypeScript 5.7)
- **Database**: Supabase PostgreSQL
- **目录结构**:
  - 前端页面: `src/app/...`
  - 组件: `src/components/...`
  - 后端 API: `backend/src/...`
  - 数据模型: `backend/prisma/schema.prisma` 与前端 `types.ts`

### 2) 统一数据获取模式（必须写进 Spec）
**默认数据流**：API 优先，失败则走 Supabase，最终回退到 Mock。

伪代码模板：
```ts
async function getData() {
  try {
    const res = await fetch(`${API_BASE}/api/resource`)
    if (!res.ok) throw new Error("API failed")
    return await res.json()
  } catch {
    try {
      const { data } = await supabase.from("table").select("*")
      return data
    } catch {
      return DUMMY_DATA
    }
  }
}
```

### 3) Realtime 功能规范
- 仅在需要实时更新时启用 Realtime。
- 订阅失败必须 `console.warn`，不允许直接抛错导致 UI 崩溃。
- 必须有清理逻辑：`supabase.removeChannel(channel)`。

### 4) 命名与字段风格
- **数据库**: snake_case
- **API 返回**: snake_case
- **前端 TS 类型**: camelCase（必要时映射字段）

---

## 三、OpenSpec 标准结构（本项目专用模板）

建议每个功能模块新建 `specs/模块名_spec.md`，格式如下：

```md
# 模块名 Spec

## 1. 全局目标
一句话说明这个模块做什么，目标用户是谁，核心价值是什么。

## 2. 技术栈约定
- 前端: Next.js 16 + React 19 + Tailwind v4
- 后端: Express + Prisma
- 数据库: Supabase PostgreSQL

## 3. 数据模型 (TypeScript)
```ts
export type Example = {
  id: number
  title: string
  createdAt: string
}
```

## 4. API 设计 (OpenAPI/REST)
- GET /api/example
- POST /api/example
- PUT /api/example/:id
- DELETE /api/example/:id

## 5. UI/UX 结构
- 布局结构
- 主要组件拆分
- 交互流程 (用户点击 -> 请求 -> 渲染)

## 6. 业务流程伪代码
用 5-10 行伪代码描述完整流程。
```

---

## 四、项目已有核心数据模型（可直接复用）

### 1) Learning Note
来源: `src/app/learning/edit/_components/types.ts`
```ts
export type LearningNote = {
  id: number
  title: string
  slug: string
  category: string
  summary: string
  tags: string[]
  coverImage?: string | null
  content: string
  orderIndex?: number | null
  updatedAt: string | null
  createdAt: string | null
}
```

### 2) Tools / Prompts / Posts（结构参考 `backend/prisma/schema.prisma`）
Spec 中需说明：
- `tools` / `prompts` / `posts` 的字段
- JSON 字段（如 `platforms`, `gallery`）
- 是否支持筛选（category/tag/featured 等）

---

## 五、项目 API 风格约定（可直接引用）

- 所有后端路由前缀 `/api/`
- 标准资源路由：GET / POST / PUT / DELETE
- Realtime 相关路由使用 Supabase 直连
- Learning Notes API 文档已存在：`LEARNING_NOTES_API.md`

---

## 六、示例：Learning Notes 模块 Spec（简化版）

```md
# Learning Notes Spec

## 1. 目标
为 AI 学习内容提供可编辑笔记库，支持分类与实时更新。

## 2. 数据模型
```ts
export type LearningNote = {
  id: number
  title: string
  slug: string
  category: string
  summary: string
  tags: string[]
  coverImage?: string | null
  content: string
  orderIndex?: number | null
  updatedAt: string | null
  createdAt: string | null
}
```

## 3. API
- GET /api/learning-notes
- GET /api/learning-notes/:id
- POST /api/learning-notes
- PUT /api/learning-notes/:id
- DELETE /api/learning-notes/:id

## 4. UI 结构
- 左侧分类/目录
- 右侧编辑器 (Markdown + Preview)
- 顶部操作区：保存/删除/预览

## 5. 业务流程伪代码
用户进入页面 -> 拉取 notes 列表 -> 选择 note -> 编辑 -> 保存 -> 更新列表
```

---

## 七、迭代规则（写在任何 Spec 的结尾）

1. 需求变更或 Bug 修复必须先改 Spec。
2. 改完 Spec 再让 AI 重写相关文件。
3. 禁止“先改代码、后补文档”。

---

## 八、推荐写法（提高 AI 执行质量）

- 明确字段名、类型、可空规则。
- 明确 UI 结构而不是“好看”。
- 明确数据来源优先级 (API -> Supabase -> Mock)。
- 明确组件拆分与文件路径。

---

## 九、如何开始

1. 在 `specs/` 下新建 `xxx_spec.md`。
2. 写完后在 AI 工具里 Add to Context。
3. 发送指令：
   > “基于 specs/xxx_spec.md 实现功能，遵守项目技术栈与数据流约定。”

完成后即可进入 AI 生成阶段。
