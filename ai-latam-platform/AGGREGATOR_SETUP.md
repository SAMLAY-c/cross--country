# 自动化内容聚合系统配置指南

## 概述

本系统通过 GitHub Actions 每小时自动抓取以下内容并写入数据库:
- 🛠️ **AI 工具** (从 Product Hunt 等源)
- 📝 **技术博客** (从 Medium、Dev.to 等平台)
- 💬 **Prompt 模板** (从社区抓取)

前端会在下次用户访问时自动展示新内容,无需重新部署。

---

## 步骤 1: 获取 Supabase Service Role Key

**重要**: 必须使用 `service_role` key,不能使用 `anon` key!

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **API**
4. 找到 **Project API keys** 部分
5. 复制 `service_role` 密钥 (以 `eyJ` 开头的 JWT token)

**为什么需要 Service Role Key?**
- `anon` key 只有读取权限
- GitHub Actions 需要写入数据库
- `service_role` key 拥有绕过 RLS 的管理员权限

---

## 步骤 2: 配置 GitHub Secrets

在你的 GitHub 仓库中配置以下 Secrets:

### 路径
`GitHub Repository` → `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### 需要添加的 Secrets

| Secret 名称 | 值来源 | 说明 |
|------------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 从 `.env.local` 复制 | 你的 Supabase 项目 URL |
| `SUPABASE_SERVICE_ROLE_KEY` | 从 Supabase Dashboard 复制 | service_role key (不是 anon key!) |

**示例**:
```
NEXT_PUBLIC_SUPABASE_URL = https://avcgvhfleqvvvgiveawy.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 步骤 3: 确保 Supabase 表存在

确保你的 Supabase 数据库中有以下表 (如果没有,需要先创建):

### tools 表
```sql
CREATE TABLE IF NOT EXISTS tools (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  price VARCHAR(50),
  url TEXT,
  affiliate_link TEXT,
  logo_url TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### posts 表
```sql
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  tag VARCHAR(100),
  read_time INTEGER,
  content TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### prompts 表
```sql
CREATE TABLE IF NOT EXISTS prompts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  prompt TEXT NOT NULL,
  platforms JSONB NOT NULL,
  preview TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 步骤 4: 配置 Row Level Security (RLS)

如果启用了 RLS,需要确保表允许读取:

```sql
-- 允许所有人读取
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON tools
  FOR SELECT USING (true);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON posts
  FOR SELECT USING (true);

ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON prompts
  FOR SELECT USING (true);
```

**注意**: Service Role key 会自动绕过 RLS,所以无需为它配置写入策略。

---

## 步骤 5: 启用 GitHub Actions

1. 提交代码到 GitHub:
   ```bash
   git add .github/workflows/content-aggregator.yml scripts/
   git commit -m "feat: 添加自动化内容聚合系统"
   git push
   ```

2. 在 GitHub 上查看 Actions:
   - 进入仓库的 `Actions` 标签
   - 你应该看到 `Content Aggregator` workflow
   - 可以点击 `Run workflow` 手动测试

3. 查看运行日志:
   - 点击具体的 workflow run
   - 展开每个步骤查看日志
   - 成功时应该看到 `✅ 新增工具/文章/Prompt` 等日志

---

## 步骤 6: 验证前端自动更新

1. 等待 GitHub Actions 完成运行
2. 刷新你的前端页面 (`http://localhost:7240/tools`)
3. 新抓取的内容应该**自动显示**在页面上

**原理**:
- 前端使用 `export const dynamic = "force-dynamic"`
- 每次访问都会重新从数据库获取数据
- 无需重新部署前端代码

---

## 自定义抓取源

当前脚本提供的是模拟数据,要启用真实抓取:

### fetch-ai-tools.ts

替换 `fetchFromProductHunt()` 函数:

```typescript
import Parser from 'rss-parser';

async function fetchFromProductHunt(): Promise<ProductHuntItem[]> {
  const parser = new Parser();
  const feed = await parser.parseURL('https://www.producthunt.com/feed');

  return feed.items.map(item => ({
    title: item.title!,
    url: item.link!,
    description: item.contentSnippet || '',
    votes: 0, // Product Hunt RSS 不包含投票数,需要 API
  }));
}
```

安装依赖:
```bash
npm install rss-parser
npm install -D @types/rss-parser
```

### fetch-blog-posts.ts

使用真实的 RSS 解析:

```typescript
import Parser from 'rss-parser';

async function fetchFromMedium() {
  const parser = new Parser();
  const feed = await parser.parseURL('https://medium.com/feed/tag-artificial-intelligence');

  return feed.items.map(item => ({
    title: item.title!,
    url: item.link!,
    excerpt: item.contentSnippet || '',
    author: item.creator || 'Unknown',
    publishedAt: item.pubDate || new Date().toISOString(),
    tags: item.categories || [],
  }));
}
```

---

## 修改运行频率

编辑 `.github/workflows/content-aggregator.yml`:

```yaml
on:
  schedule:
    # 每天运行 (UTC 0点)
    - cron: '0 0 * * *'

    # 每 6 小时运行
    # - cron: '0 */6 * * *'

    # 每周运行 (周一 0点)
    # - cron: '0 0 * * 1'
```

**Cron 表达式格式**: `分 时 日 月 周`

---

## 故障排查

### GitHub Actions 失败

1. **检查 Secrets 是否正确配置**
   - 确保 `SUPABASE_SERVICE_ROLE_KEY` 是完整的 JWT token
   - 不要使用 `sb_publishable_` 开头的 key

2. **查看日志**
   - Actions → 选择失败的 run → 展开步骤查看错误信息
   - 常见错误: `Missing Supabase credentials`

3. **测试脚本本地运行**
   ```bash
   # 在项目根目录
   export NEXT_PUBLIC_SUPABASE_URL="your_url"
   export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
   npx tsx scripts/fetch-ai-tools.ts
   ```

### 前端没有显示新数据

1. **检查数据库是否真的有数据**
   - 进入 Supabase Dashboard → Table Editor
   - 查看 `tools` / `posts` / `prompts` 表

2. **检查 Backend API 是否正常**
   ```bash
   curl http://localhost:3001/api/tools
   ```

3. **检查前端是否在使用 Backend API**
   - 查看 `src/app/tools/page.tsx` 的 `getTools()` 函数
   - 确认 `API_BASE` 指向正确的后端地址

---

## 数据去重逻辑

脚本已实现自动去重:

- **tools**: 根据 `url` 去重 (同一工具不会重复添加)
- **posts**: 根据 `title` 去重
- **prompts**: 根据 `title` 去重

已存在的条目会显示 `⏭️ 跳过已存在`,这是正常行为。

---

## 下一步优化建议

1. **添加更多数据源**:
   - Twitter/X API 抓取 AI 大佬推文
   - Reddit API 抓取 r/MachineLearning
   - Hacker News API 抓取 AI 相关文章

2. **数据质量提升**:
   - 添加 AI 内容过滤 (避免低质量内容)
   - 实现智能分类 (用 GPT API 自动分类)
   - 添加内容评分系统

3. **监控和告警**:
   - 添加 Slack/Discord 通知 (新内容入库时)
   - 失败时发送邮件告警
   - 数据量统计 Dashboard

---

## 架构图

```
┌─────────────────┐
│  GitHub Actions │
│  (每小时运行)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  抓取脚本 (scripts/)         │
│  ├─ fetch-ai-tools.ts       │
│  ├─ fetch-blog-posts.ts     │
│  └─ fetch-prompts.ts        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────┐
│   Supabase DB   │
│  (写入新数据)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │
│  (/api/tools)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Next.js 前端   │
│  (自动展示)      │
└─────────────────┘
```

---

需要帮助? 请查看 [CLAUDE.md](./CLAUDE.md) 了解项目架构。
