# Scripts - 自动化内容聚合脚本

## 本地测试

在本地测试脚本前,需要设置环境变量:

```bash
# 在项目根目录
export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# 测试单个脚本
npx tsx scripts/fetch-prompts.ts
npx tsx scripts/fetch-ai-tools.ts
npx tsx scripts/fetch-blog-posts.ts
```

## 脚本说明

### fetch-ai-tools.ts
- **功能**: 抓取 AI 工具信息
- **数据源**: Product Hunt (可扩展)
- **去重**: 根据 URL 去重
- **分类**: 自动识别 AI 工具并打标签

### fetch-blog-posts.ts
- **功能**: 抓取技术博客文章
- **数据源**: Medium, Dev.to (可扩展)
- **去重**: 根据标题去重
- **自动计算**: 阅读时间

### fetch-prompts.ts
- **功能**: 抓取 Prompt 模板
- **数据源**: 社区分享 (当前为模拟数据)
- **去重**: 根据标题去重

## 扩展新数据源

每个脚本都遵循相同的模式:

1. 定义数据接口 (interface)
2. 实现 `fetchFromXXX()` 函数返回数据数组
3. 实现去重逻辑 (检查数据库是否已存在)
4. 插入新数据

示例 - 添加新的抓取源:

```typescript
// 在 fetch-ai-tools.ts 中添加
async function fetchFromHackerNews(): Promise<ProductHuntItem[]> {
  const response = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json');
  const ids = await response.json();

  const items = await Promise.all(
    ids.slice(0, 10).map(id =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .then(res => res.json())
    )
  );

  return items
    .filter(item => item && isAITool(item.title, ''))
    .map(item => ({
      title: item.title,
      url: item.url,
      description: '',
      votes: item.score,
    }));
}

// 在 main() 函数中调用
const tools = [
  ...await fetchFromProductHunt(),
  ...await fetchFromHackerNews(),
];
```

## 故障排查

### 错误: Missing Supabase credentials
**原因**: 环境变量未设置

**解决**:
```bash
export NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

### 错误: Column does not exist
**原因**: 数据库表结构与代码不匹配

**解决**: 检查 Supabase 表结构,确保字段名正确

### 警告: 跳过已存在
**原因**: 数据已存在于数据库 (正常行为,不是错误)

**解决**: 无需处理,去重逻辑正常工作

## 性能优化建议

1. **批量插入**: 当前逐条插入,可以改为批量:
   ```typescript
   await supabase.from('tools').insert(tools);
   ```

2. **并发限制**: 避免同时请求过多 API:
   ```typescript   import PQueue from 'p-queue';
   const queue = new PQueue({ concurrency: 5 });
   ```

3. **缓存**: 使用 Redis 缓存已抓取的 URL,减少数据库查询

## 安全建议

- ✅ 永远不要将 `SUPABASE_SERVICE_ROLE_KEY` 提交到 Git
- ✅ 使用 GitHub Secrets 存储敏感信息
- ✅ 为不同环境使用不同的 Supabase 项目
- ❌ 不要在客户端代码中使用 Service Role Key
