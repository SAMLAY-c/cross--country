# Supabase Realtime 实时同步配置指南

本文档介绍如何配置 Supabase Realtime 功能，使数据库变更能实时同步到前端页面。

## 功能说明

当你在 Supabase 中修改数据（增删改）时，前端页面会自动更新，无需手动刷新。

## 配置步骤

### 1. 在 Supabase 中启用 Realtime

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Database** → **Replication**
4. 找到 **Realtime** 部分
5. 为需要实时同步的表启用 Realtime：
   - `tools`
   - `prompts`
   - `posts`

点击表的开关，将其状态改为 **Enabled**。

### 2. 配置表的 Realtime 设置

对于每个表，你可以选择监听特定操作：

- **INSERT**: 新增数据时触发
- **UPDATE**: 更新数据时触发
- **DELETE**: 删除数据时触发
- **ALL**: 监听所有操作（推荐）

建议选择 **ALL** 以获得完整的实时同步功能。

### 3. 验证 Realtime 是否工作

#### 方法 1: 检查浏览器控制台

1. 打开你的网站（例如 `/tools` 页面）
2. 打开浏览器开发者工具（F12）
3. 查看 Console 标签
4. 你应该看到类似这样的消息：
   ```
   ✅ Successfully subscribed to tools realtime updates
   ```

#### 方法 2: 测试实时更新

1. 在浏览器中打开你的网站（例如 `/tools` 页面）
2. 在 Supabase Dashboard 的 **Table Editor** 中修改 `tools` 表的数据
3. 浏览器控制台应该显示：
   ```
   Realtime update received: {eventType: 'UPDATE', ...}
   ```
4. 页面上的数据应该自动更新

## 已实现的实时同步页面

目前以下页面支持 Realtime 实时同步：

- ✅ `/tools` - AI 工具目录
- 🔄 `/prompts` - 提示词库（待添加）
- 🔄 `/blog` - 博客文章（待添加）

## 工作原理

### 技术架构

```
Supabase Database (修改数据)
    ↓
Supabase Realtime Server (推送事件)
    ↓
前端页面（通过 WebSocket 接收）
    ↓
自动重新获取数据并更新 UI
```

### 代码实现

1. **服务端组件** (`page.tsx`):
   - 初始加载时从服务器获取数据
   - 传递给客户端组件

2. **客户端组件** (`realtime-tools-list.tsx`):
   - 订阅 Supabase Realtime 事件
   - 当收到更新事件时，重新获取数据
   - 更新 React 状态，触发 UI 重渲染

3. **Realtime Hook** (`lib/realtime.ts`):
   - 可重用的实时订阅逻辑
   - 自动处理订阅和取消订阅
   - 错误处理和清理

## 常见问题

### Q: 页面没有自动更新？

**可能原因：**

1. **Realtime 未在 Supabase 中启用**
   - 解决方案：按照上面的步骤在 Dashboard 中启用

2. **Supabase 客户端配置错误**
   - 检查 `.env.local` 中的 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **网络问题**
   - 检查浏览器控制台是否有错误信息
   - 确保 Supabase URL 可访问

### Q: 如何为其他页面添加 Realtime？

使用 `lib/realtime.ts` 中的 Hook：

```tsx
"use client";

import { useRealtimeSubscription } from "@/lib/realtime";
import { supabase } from "@/lib/supabase";

async function fetchData() {
  // 你的数据获取逻辑
  return await fetch('/api/data').then(r => r.json());
}

export default function MyComponent() {
  const { data } = useRealtimeSubscription(
    { table: 'your_table_name' },
    fetchData
  );

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Q: Realtime 会影响性能吗？

Realtime 使用 WebSocket 连接，性能影响很小：

- 每个表只需要一个订阅连接
- 只在数据变更时触发更新
- 自动处理连接清理

## 高级配置

### 过滤特定记录

你可以只监听表中特定记录的变更：

```ts
// 只监听特定分类的工具
const { data } = useRealtimeSubscription(
  {
    table: 'tools',
    filter: 'category=eq.video' // 只监听 video 分类
  },
  fetchData
);
```

### 监听特定事件

```ts
// 只监听新增事件
channel.on('postgres_changes', {
  event: 'INSERT', // 或 'UPDATE', 'DELETE'
  schema: 'public',
  table: 'tools'
}, handler)
```

## 相关文件

- `src/lib/supabase.ts` - Supabase 客户端配置
- `src/lib/realtime.ts` - Realtime 订阅工具函数
- `src/components/realtime-tools-list.tsx` - Tools 页面实时组件
- `src/components/tool-card.tsx` - 工具卡片组件

## 参考资料

- [Supabase Realtime 文档](https://supabase.com/docs/guides/realtime)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/reference/react/use-server)
