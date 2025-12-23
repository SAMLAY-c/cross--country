# AI Latam Platform - Backend API

Node.js + Express + Prisma + PostgreSQL REST API

## 项目结构

```
backend/
├── prisma/
│   ├── schema.prisma      # Prisma Schema 定义
│   └── schema.sql         # SQL 表结构（含索引）
├── src/
│   ├── config/
│   │   └── database.ts    # Prisma 客户端配置
│   ├── controllers/       # 控制器层
│   │   ├── toolsController.ts
│   │   ├── promptsController.ts
│   │   └── postsController.ts
│   ├── routes/           # 路由层
│   │   ├── tools.ts
│   │   ├── prompts.ts
│   │   └── posts.ts
│   └── server.ts         # Express 服务器入口
├── .env.example          # 环境变量示例
├── package.json
└── tsconfig.json
```

## 安装步骤

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写你的 Supabase 数据库连接信息：

```bash
cp .env.example .env
```

编辑 `.env`：

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.avcgvhfleqvvvgiveawy.supabase.co:5432/postgres"
PORT=3001
```

> 获取 DATABASE_URL：Supabase Dashboard -> Settings -> Database -> Connection String (URI format)

### 3. 初始化数据库

选择以下方式之一：

#### 方式一：使用 Prisma Migrate（推荐）

```bash
# 生成 Prisma Client
npm run prisma:generate

# 创建数据库表
npm run prisma:migrate
```

#### 方式二：直接执行 SQL

在 Supabase SQL Editor 中执行 `prisma/schema.sql` 文件内容。

> 如果你选择直接在 Supabase 上改表结构（SQL Editor 或 Dashboard），必须先同步本地 Prisma Schema：
> 1. `npx prisma db pull`
> 2. `npx prisma generate`

### 4. 启动服务器

```bash
# 开发模式（热重载）
npm run dev

# 生产模式
npm run build
npm start
```

服务器将在 `http://localhost:3001` 启动。

## API 端点

### Tools API

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/tools` | 获取所有工具 |
| GET | `/api/tools/:id` | 获取单个工具详情 |
| POST | `/api/tools` | 创建新工具 |
| PUT | `/api/tools/:id` | 更新工具 |
| DELETE | `/api/tools/:id` | 删除工具 |

**查询参数：**
- `?tag=xxx` - 按标签筛选
- `?category=xxx` - 按分类筛选
- `?featured=true` - 只显示推荐工具

### Prompts API

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/prompts` | 获取所有提示词 |
| GET | `/api/prompts/:id` | 获取单个提示词详情 |
| POST | `/api/prompts` | 创建新提示词 |
| PUT | `/api/prompts/:id` | 更新提示词 |
| DELETE | `/api/prompts/:id` | 删除提示词 |

**查询参数：**
- `?category=xxx` - 按分类筛选

### Posts API

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/posts` | 获取所有文章 |
| GET | `/api/posts/:id` | 获取单个文章详情 |
| POST | `/api/posts` | 创建新文章 |
| PUT | `/api/posts/:id` | 更新文章 |
| DELETE | `/api/posts/:id` | 删除文章 |

**查询参数：**
- `?tag=xxx` - 按标签筛选

## 数据结构

### Tool

```typescript
{
  id: number;
  name: string;           // 必填
  tag: string;            // 必填
  category: string | null;
  description: string | null;
  price: string | null;
  url: string | null;
  affiliate_link: string | null;
  logo_url: string | null;
  image_url: string | null;
  is_featured: boolean;   // 默认: false
  created_at: string;     // ISO 8601
}
```

### Prompt

```typescript
{
  id: number;
  title: string;          // 必填
  category: string;       // 必填
  platforms: string[];    // 必填，JSON 数组
  preview: string | null;
  prompt: string;         // 必填
  created_at: string;     // ISO 8601
}
```

### Post

```typescript
{
  id: number;
  title: string;          // 必填
  excerpt: string | null;
  tag: string | null;
  read_time: string | null;
  published_at: string;   // 必填
  content: string | null;
  created_at: string;     // ISO 8601
}
```

## 请求示例

### 创建 Tool

```bash
curl -X POST http://localhost:3001/api/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ChatGPT",
    "tag": "AI工具",
    "category": "文本写作",
    "description": "OpenAI 的强大语言模型",
    "price": "免费/$20/月",
    "url": "https://chat.openai.com",
    "is_featured": true
  }'
```

### 获取 Tools（带筛选）

```bash
curl "http://localhost:3001/api/tools?tag=AI工具&featured=true"
```

### 创建 Prompt

```bash
curl -X POST http://localhost:3001/api/prompts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "博客文章写作助手",
    "category": "写作",
    "platforms": ["ChatGPT", "Claude"],
    "preview": "帮助你快速写出高质量博客文章",
    "prompt": "你是一位专业的博客写手..."
  }'
```

## 数据库索引

表已创建以下索引以优化查询性能：

### tools 表
- `idx_tools_tag` - tag 字段
- `idx_tools_category` - category 字段
- `idx_tools_is_featured` - is_featured 字段
- `idx_tools_created_at` - created_at 字段

### prompts 表
- `idx_prompts_category` - category 字段
- `idx_prompts_created_at` - created_at 字段
- `idx_prompts_platforms` - platforms 字段（GIN 索引，用于 JSON 查询）

### posts 表
- `idx_posts_tag` - tag 字段
- `idx_posts_published_at` - published_at 字段
- `idx_posts_created_at` - created_at 字段

## 字段可空性与默认值

### Tool
| 字段 | 可空 | 默认值 |
|------|------|--------|
| id | 否 | autoincrement |
| name | 否 | - |
| tag | 否 | - |
| category | 是 | NULL |
| description | 是 | NULL |
| price | 是 | NULL |
| url | 是 | NULL |
| affiliate_link | 是 | NULL |
| logo_url | 是 | NULL |
| image_url | 是 | NULL |
| is_featured | 否 | false |
| created_at | 否 | NOW() |

### Prompt
| 字段 | 可空 | 默认值 |
|------|------|--------|
| id | 否 | autoincrement |
| title | 否 | - |
| category | 否 | - |
| platforms | 否 | [] |
| preview | 是 | NULL |
| prompt | 否 | - |
| created_at | 否 | NOW() |

### Post
| 字段 | 可空 | 默认值 |
|------|------|--------|
| id | 否 | autoincrement |
| title | 否 | - |
| excerpt | 是 | NULL |
| tag | 是 | NULL |
| read_time | 是 | NULL |
| published_at | 否 | - |
| content | 是 | NULL |
| created_at | 否 | NOW() |

## 其他命令

```bash
# Prisma Studio - 可视化数据库管理
npm run prisma:studio

# 生成 Prisma Client
npm run prisma:generate

# 重置数据库（谨慎使用）
npx prisma migrate reset
```
