# 学习笔记 API 文档

## 基础信息

- **Base URL**: `http://localhost:3001/api/learning-notes`
- **Content-Type**: `application/json`

---

## API 端点

### 1. 获取所有学习笔记

```http
GET /api/learning-notes
```

**查询参数:**
- `category` (可选): 按分类筛选，如 `?category=提示词工程`
- `search` (可选): 搜索标题和内容，如 `?search=AI`
- `tag` (可选): 按标签筛选，如 `?tag=Few-shot`

**响应示例:**
```json
{
  "learning_notes": [
    {
      "id": 1,
      "title": "Prompt Engineering 基本功",
      "slug": "prompt-engineering-core",
      "category": "提示词工程",
      "summary": "整理 Few-shot、Chain-of-Thought 等关键策略",
      "tags": ["Few-shot", "CoT", "Self-Consistency"],
      "cover_image": "https://...",
      "content": "# Prompt Engineering\n\n这是一篇关于...",
      "order_index": 0,
      "updated_at": "2025-01-12T10:00:00.000Z",
      "created_at": "2025-01-12T10:00:00.000Z"
    }
  ]
}
```

---

### 2. 获取单个学习笔记

```http
GET /api/learning-notes/:id
```

**响应示例:**
```json
{
  "id": 1,
  "title": "Prompt Engineering 基本功",
  "slug": "prompt-engineering-core",
  "category": "提示词工程",
  "summary": "...",
  "tags": ["Few-shot", "CoT"],
  "cover_image": null,
  "content": "完整 Markdown 内容...",
  "order_index": 0,
  "updated_at": "2025-01-12T10:00:00.000Z",
  "created_at": "2025-01-12T10:00:00.000Z"
}
```

---

### 3. 创建新的学习笔记

```http
POST /api/learning-notes
```

**请求体:**
```json
{
  "title": "新笔记标题",
  "slug": "new-note-slug",
  "category": "提示词工程",
  "summary": "简短描述",
  "tags": ["标签1", "标签2"],
  "cover_image": "https://example.com/image.jpg",
  "content": "# 标题\n\n笔记内容...",
  "order_index": 0
}
```

**必填字段:**
- `title`: 标题
- `slug`: URL 友好的唯一标识符
- `category`: 分类
- `content`: Markdown 内容
- `tags`: 标签数组（至少一个）

**可选字段:**
- `summary`: 摘要
- `cover_image`: 封面图片 URL
- `order_index`: 排序索引

**使用 curl 示例:**
```bash
curl -X POST http://localhost:3001/api/learning-notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "我的新笔记",
    "slug": "my-new-note",
    "category": "提示词工程",
    "tags": ["AI", "LLM"],
    "content": "# 我的新笔记\n\n这是一篇关于 AI 的笔记。"
  }'
```

**响应:** 201 Created + 创建的笔记对象

---

### 4. 更新学习笔记

```http
PUT /api/learning-notes/:id
```

**请求体:**（所有字段都是可选的）
```json
{
  "title": "更新后的标题",
  "slug": "updated-slug",
  "category": "新分类",
  "summary": "新的摘要",
  "tags": ["新标签"],
  "cover_image": "https://example.com/new-image.jpg",
  "content": "更新后的内容...",
  "order_index": 1
}
```

**使用 curl 示例:**
```bash
curl -X PUT http://localhost:3001/api/learning-notes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新后的标题",
    "content": "# 更新后的标题\n\n新内容..."
  }'
```

**响应:** 200 OK + 更新后的笔记对象

---

### 5. 删除学习笔记

```http
DELETE /api/learning-notes/:id
```

**使用 curl 示例:**
```bash
curl -X DELETE http://localhost:3001/api/learning-notes/1
```

**响应:** 204 No Content

---

### 6. 批量操作

```http
PATCH /api/learning-notes/batch
```

#### 6.1 批量删除

**请求体:**
```json
{
  "action": "delete",
  "ids": [1, 2, 3]
}
```

**使用 curl:**
```bash
curl -X PATCH http://localhost:3001/api/learning-notes/batch \
  -H "Content-Type: application/json" \
  -d '{
    "action": "delete",
    "ids": [1, 2, 3]
  }'
```

**响应:** 204 No Content

---

#### 6.2 批量更新

**请求体:**
```json
{
  "action": "update",
  "ids": [1, 2, 3],
  "data": {
    "category": "新分类"
  }
}
```

**使用 curl:**
```bash
curl -X PATCH http://localhost:3001/api/learning-notes/batch \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update",
    "ids": [1, 2, 3],
    "data": {
      "category": "统一分类"
    }
  }'
```

**响应:**
```json
{
  "updated_count": 3
}
```

---

#### 6.3 批量重排序

**请求体:**
```json
{
  "action": "reorder",
  "data": [
    {"id": 1, "order_index": 0},
    {"id": 2, "order_index": 1},
    {"id": 3, "order_index": 2}
  ]
}
```

**使用 curl:**
```bash
curl -X PATCH http://localhost:3001/api/learning-notes/batch \
  -H "Content-Type: application/json" \
  -d '{
    "action": "reorder",
    "data": [
      {"id": 1, "order_index": 0},
      {"id": 2, "order_index": 1},
      {"id": 3, "order_index": 2}
    ]
  }'
```

**响应:**
```json
{
  "success": true
}
```

---

## 错误响应

所有错误都返回 JSON 格式：

```json
{
  "error": "错误信息"
}
```

**常见 HTTP 状态码:**
- `200`: 成功
- `201`: 创建成功
- `204`: 删除成功（无内容）
- `400`: 请求参数错误
- `404`: 资源未找到
- `409`: 唯一约束冲突（如标题或 slug 重复）
- `500`: 服务器内部错误

---

## 通过 API 创建笔记的完整示例

### 使用 curl

```bash
curl -X POST http://localhost:3001/api/learning-notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "RAG 检索优化技巧",
    "slug": "rag-retrieval-optimization",
    "category": "RAG",
    "summary": "总结混合检索、向量召回、重排与评估指标",
    "tags": ["RAG", "检索", "优化"],
    "content": "# RAG 检索优化技巧\n\n## 混合检索\n\n结合稠密向量和稀疏向量...\n\n## 重排序\n\n使用 Cross-Encoder 进行二次排序...",
    "order_index": 0
  }'
```

### 使用 JavaScript (fetch)

```javascript
const response = await fetch('http://localhost:3001/api/learning-notes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'RAG 检索优化技巧',
    slug: 'rag-retrieval-optimization',
    category: 'RAG',
    summary: '总结混合检索、向量召回、重排与评估指标',
    tags: ['RAG', '检索', '优化'],
    content: '# RAG 检索优化技巧\n\n## 混合检索\n\n结合稠密向量和稀疏向量...',
    order_index: 0
  })
});

const note = await response.json();
console.log('创建的笔记:', note);
```

### 使用 Python (requests)

```python
import requests
import json

url = 'http://localhost:3001/api/learning-notes'
data = {
    'title': 'RAG 检索优化技巧',
    'slug': 'rag-retrieval-optimization',
    'category': 'RAG',
    'summary': '总结混合检索、向量召回、重排与评估指标',
    'tags': ['RAG', '检索', '优化'],
    'content': '# RAG 检索优化技巧\n\n## 混合检索\n\n结合稠密向量和稀疏向量...',
    'order_index': 0
}

response = requests.post(url, json=data)
note = response.json()
print('创建的笔记:', note)
```

---

## 从 Markdown 文件上传笔记

### 方法 1: 使用 cat + curl (Linux/Mac)

```bash
# 读取 Markdown 文件内容
CONTENT=$(cat my-note.md)

# 创建笔记
curl -X POST http://localhost:3001/api/learning-notes \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"我的笔记\",
    \"slug\": \"my-note\",
    \"category\": \"AI\",
    \"tags\": [\"笔记\"],
    \"content\": $(echo "$CONTENT" | jq -Rs .)
  }"
```

### 方法 2: 使用 Node.js 脚本

创建 `upload-note.js`:

```javascript
import fs from 'fs';

const NOTE_CONTENT = fs.readFileSync('./my-note.md', 'utf-8');

const response = await fetch('http://localhost:3001/api/learning-notes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: '我的笔记标题',
    slug: 'my-note',
    category: 'AI',
    tags: ['笔记', 'AI'],
    content: NOTE_CONTENT
  })
});

const result = await response.json();
console.log('上传成功:', result);
```

运行：
```bash
node upload-note.js
```

### 方法 3: 使用 Python 脚本

创建 `upload_note.py`:

```python
import requests
import json

# 读取 Markdown 文件
with open('my-note.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 上传笔记
url = 'http://localhost:3001/api/learning-notes'
data = {
    'title': '我的笔记标题',
    'slug': 'my-note',
    'category': 'AI',
    'tags': ['笔记', 'AI'],
    'content': content
}

response = requests.post(url, json=data)
result = response.json()
print('上传成功:', result)
```

运行：
```bash
python upload_note.py
```

---

## 注意事项

1. **Slug 唯一性**: `slug` 必须唯一，如果重复会返回 409 错误
2. **Tags 格式**: `tags` 必须是数组，且至少包含一个元素
3. **Content 类型**: `content` 字段接收完整的 Markdown 字符串
4. **Order Index**: 如果不指定 `order_index`，笔记会按 `updated_at` 降序排列
5. **图片上传**: 图片应先上传到 Supabase Storage，然后将 URL 填入 `cover_image` 字段
