# API 认证指南

## 概述

后端 API 已启用写入操作的认证保护。所有写入操作（POST、PUT、DELETE、PATCH）都需要提供 `x-api-secret` header。

## 环境变量配置

在 `.env` 文件中配置：

```bash
API_ROUTE_SECRET=Zhiailqx322@
```

**⚠️ 重要提示**：
- 不要将 `API_ROUTE_SECRET` 提交到公共仓库
- 前端应该通过环境变量 `NEXT_PUBLIC_API_ROUTE_SECRET` 访问（仅用于开发）
- 生产环境应该使用服务器端代理或 GitHub Actions 来执行写入操作

## API 认证规则

| HTTP 方法 | 需要认证 | 说明 |
|-----------|---------|------|
| GET       | ❌ 否    | 公开读取，无需认证 |
| POST      | ✅ 是    | 创建资源，需要认证 |
| PUT       | ✅ 是    | 更新资源，需要认证 |
| DELETE    | ✅ 是    | 删除资源，需要认证 |
| PATCH     | ✅ 是    | 部分更新，需要认证 |

## 使用示例

### 1. 创建文章 (POST)

```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -H "x-api-secret: Zhiailqx322@" \
  -d '{
    "title": "如何使用 Claude API",
    "published_at": "2025-12-25T00:00:00.000Z",
    "excerpt": "Claude API 的详细使用指南",
    "tag": "AI 教程",
    "read_time": "10 分钟",
    "content": "# Claude API 使用指南\n\n这是文章内容..."
  }'
```

**成功响应**：`201 Created`
```json
{
  "id": 930,
  "title": "如何使用 Claude API",
  "excerpt": "Claude API 的详细使用指南",
  "tag": "AI 教程",
  "read_time": "10 分钟",
  "published_at": "2025-12-25T00:00:00.000Z",
  "cover_image": null,
  "gallery": null,
  "content": "# Claude API 使用指南\n\n这是文章内容...",
  "created_at": "2025-12-25T06:00:00.000Z"
}
```

**失败响应**：`401 Unauthorized`
```json
{
  "error": "Unauthorized"
}
```

### 2. 更新文章 (PUT)

```bash
curl -X PUT http://localhost:3001/api/posts/930 \
  -H "Content-Type: application/json" \
  -H "x-api-secret: Zhiailqx322@" \
  -d '{
    "title": "已更新的标题",
    "published_at": "2025-12-25T00:00:00.000Z",
    "content": "更新后的内容"
  }'
```

### 3. 删除文章 (DELETE)

```bash
curl -X DELETE http://localhost:3001/api/posts/930 \
  -H "x-api-secret: Zhiailqx322@"
```

**成功响应**：`204 No Content`

### 4. 读取文章 (GET - 无需认证)

```bash
# 获取所有文章
curl http://localhost:3001/api/posts

# 获取单篇文章
curl http://localhost:3001/api/posts/930
```

## 其他 API 端点

所有写入端点都使用相同的认证方式：

### Tools

```bash
# 创建 Tool
curl -X POST http://localhost:3001/api/tools \
  -H "Content-Type: application/json" \
  -H "x-api-secret: Zhiailqx322@" \
  -d '{
    "name": "ChatGPT",
    "tag": "AI 聊天",
    "category": "文本生成",
    "description": "OpenAI 的 AI 聊天机器人"
  }'

# 更新 Tool
curl -X PUT http://localhost:3001/api/tools/1 \
  -H "Content-Type: application/json" \
  -H "x-api-secret: Zhiailqx322@" \
  -d '{"name": "更新后的名称"}'

# 删除 Tool
curl -X DELETE http://localhost:3001/api/tools/1 \
  -H "x-api-secret: Zhiailqx322@"
```

### Prompts

```bash
# 创建 Prompt
curl -X POST http://localhost:3001/api/prompts \
  -H "Content-Type: application/json" \
  -H "x-api-secret: Zhiailqx322@" \
  -d '{
    "title": "代码优化提示词",
    "category": "编程",
    "platforms": ["ChatGPT", "Claude"],
    "prompt": "请优化以下代码..."
  }'

# 更新 Prompt
curl -X PUT http://localhost:3001/api/prompts/1 \
  -H "Content-Type: application/json" \
  -H "x-api-secret: Zhiailqx322@" \
  -d '{"title": "更新后的标题"}'

# 删除 Prompt
curl -X DELETE http://localhost:3001/api/prompts/1 \
  -H "x-api-secret: Zhiailqx322@"
```

### Learning Notes

```bash
# 创建学习笔记
curl -X POST http://localhost:3001/api/learning-notes \
  -H "Content-Type: application/json" \
  -H "x-api-secret: Zhiailqx322@" \
  -d '{
    "title": "学习笔记标题",
    "slug": "learning-note-title",
    "category": "AI 技术",
    "summary": "简要说明",
    "tags": ["AI", "Machine Learning"],
    "content": "# 学习内容\n\n详细内容..."
  }'

# 更新学习笔记
curl -X PUT http://localhost:3001/api/learning-notes/1 \
  -H "Content-Type: application/json" \
  -H "x-api-secret: Zhiailqx322@" \
  -d '{"title": "更新后的标题"}'

# 删除学习笔记
curl -X DELETE http://localhost:3001/api/learning-notes/1 \
  -H "x-api-secret: Zhiailqx322@"
```

## JavaScript/TypeScript 示例

### 使用 fetch

```typescript
const API_BASE = 'http://localhost:3001';
const API_SECRET = 'Zhiailqx322@';

// 创建文章
async function createPost(postData: any) {
  const response = await fetch(`${API_BASE}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-secret': API_SECRET,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error(`Failed: ${response.status}`);
  }

  return response.json();
}

// 使用示例
createPost({
  title: '新文章',
  published_at: new Date().toISOString(),
  content: '文章内容'
})
  .then(data => console.log('Created:', data))
  .catch(error => console.error('Error:', error));
```

### 使用 axios

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:3001';
const API_SECRET = 'Zhiailqx322@';

const api = axios.create({
  baseURL: API_BASE,
});

// 创建文章
async function createPost(postData: any) {
  try {
    const response = await api.post('/api/posts', postData, {
      headers: {
        'x-api-secret': API_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

## 安全建议

### 开发环境

1. **本地环境变量**：在 `.env.local` 中设置 `NEXT_PUBLIC_API_ROUTE_SECRET`
2. **仅在开发环境使用**：不要在前端生产代码中暴露 secret

```typescript
// .env.local (开发环境)
NEXT_PUBLIC_API_ROUTE_SECRET=Zhiailqx322@
```

### 生产环境

1. **使用服务器端 API 路由**：创建 Next.js API 路由作为代理

```typescript
// app/api/admin/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const API_SECRET = process.env.API_ROUTE_SECRET;
  const BACKEND_URL = process.env.BACKEND_URL;

  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-secret': API_SECRET!, // 服务器端环境变量
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

2. **使用 GitHub Actions**：自动化内容导入脚本

```yaml
# .github/workflows/seed-content.yml
name: Seed Content

on:
  workflow_dispatch:

jobs:
  seed:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd ai-latam-platform/backend
          npm install

      - name: Run seed script
        env:
          API_BASE_URL: ${{ secrets.BACKEND_URL }}
          API_ROUTE_SECRET: ${{ secrets.API_ROUTE_SECRET }}
        run: |
          cd ai-latam-platform/backend
          npx tsx scripts/seed-learning-notes-from-mock.ts
```

## 测试检查清单

- [ ] 无 secret 的 POST 请求返回 `401 Unauthorized`
- [ ] 带 secret 的 POST 请求返回 `201 Created`
- [ ] 带 secret 的 PUT 请求返回 `200 OK`
- [ ] 带 secret 的 DELETE 请求返回 `204 No Content`
- [ ] GET 请求无需 secret，正常返回数据
- [ ] 错误的 secret 返回 `401 Unauthorized`

## 故障排查

### 问题：所有写入请求都返回 401

**解决方案**：
1. 检查 `.env` 文件中 `API_ROUTE_SECRET` 是否设置
2. 确认后端服务已重启并加载了新的环境变量
3. 验证请求 header 中 `x-api-secret` 的值是否正确

### 问题：前端无法发送带有 secret 的请求

**解决方案**：
1. 检查是否设置了 `NEXT_PUBLIC_API_ROUTE_SECRET` 环境变量
2. 确认前端开发服务器已重启
3. 使用浏览器开发工具检查请求是否包含 `x-api-secret` header

### 问题：GitHub Actions 中的认证失败

**解决方案**：
1. 检查 GitHub Secrets 中是否正确配置了 `API_ROUTE_SECRET`
2. 验证 `BACKEND_URL` 是否指向正确的后端地址
3. 查看 Actions 日志确认环境变量是否正确加载

## 相关文件

- 后端认证中间件：`backend/src/middleware/auth.ts`（如果存在）
- Admin 页面：`src/app/admin/page.tsx`
- 种子脚本：`backend/scripts/seed-learning-notes-from-mock.ts`
- 环境变量示例：`backend/.env.example`
