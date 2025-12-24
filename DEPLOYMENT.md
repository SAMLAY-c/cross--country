# 部署指南 - AI Latam Platform

本文档介绍如何将项目部署到生产环境。

## 架构概览

- **前端**: Vercel (Next.js 16)
- **后端**: Render (Express + Prisma)
- **数据库**: Supabase PostgreSQL

## 前置准备

### 1. 准备 Supabase 数据库

确保你的 Supabase 项目已创建，并且：
- 已运行数据库迁移 (`npx prisma migrate deploy`)
- 数据库表已创建

### 2. 准备 GitHub 仓库

将代码推送到 GitHub（Vercel 和 Render 都支持从 GitHub 自动部署）。

---

## 第一步：部署后端到 Render

### 1. 注册 Render

访问 [render.com](https://render.com) 并注册账号（推荐使用 GitHub 登录）。

### 2. 创建新的 Web Service

1. 点击 Dashboard → **New** → **Web Service**
2. 连接你的 GitHub 仓库
3. 选择 `ai-latam-platform/backend` 目录
4. 配置如下：

| 配置项 | 值 |
|--------|-----|
| **Name** | `ai-latam-backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build && npx prisma generate` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (免费版) |

### 3. 配置环境变量

在 Render 控制台的 **Environment** 部分添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | 你的 Supabase Database URL | Supavisor 模式 (6543端口) |
| `DIRECT_URL` | 你的 Supabase Direct URL | 直接连接 URL |
| `PORT` | `3001` | 应用端口 |
| `FRONTEND_URL` | 你的 Vercel 前端 URL | CORS 白名单 |

**重要**: DATABASE_URL 格式示例：
```
postgresql://postgres.xxx:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&pool_timeout=0&sslmode=require
```

### 4. 部署

点击 **Create Web Service**，Render 将自动部署。

### 5. 获取后端 URL

部署完成后，Render 会分配一个 URL，例如：
```
https://ai-latam-backend.onrender.com
```

记录这个 URL，下一步需要用到。

### 6. 运行数据库迁移

部署成功后，需要在 Render 上运行 Prisma 迁移：

**方法 A: 使用 Render Shell**
1. 在 Render 控制台进入你的 Service
2. 点击 **Shell** 标签
3. 执行：`npx prisma migrate deploy`

**方法 B: 在本地远程执行**
```bash
# 设置远程数据库连接
DATABASE_URL="你的Supabase连接字符串" npx prisma migrate deploy
```

---

## 第二步：部署前端到 Vercel

### 1. 注册 Vercel

访问 [vercel.com](https://vercel.com) 并注册账号（推荐使用 GitHub 登录）。

### 2. 导入项目

1. 点击 **Add New** → **Project**
2. 从 GitHub 导入 `ai-latam-platform` 仓库
3. Vercel 会自动检测这是 Next.js 项目

### 3. 配置项目

| 配置项 | 值 |
|--------|-----|
| **Framework Preset** | `Next.js` |
| **Root Directory** | `./` (项目根目录) |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |

### 4. 配置环境变量

在 Vercel 控制台的 **Environment Variables** 部分添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase URL | 如 `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase Anon Key | 公开密钥 |
| `NEXT_PUBLIC_API_BASE_URL` | 你的 Render 后端 URL | 如 `https://ai-latam-backend.onrender.com` |

**示例**:
```
NEXT_PUBLIC_API_BASE_URL=https://ai-latam-backend.onrender.com
```

### 5. 部署

点击 **Deploy**，Vercel 会自动构建和部署。

### 6. 获取前端 URL

部署完成后，Vercel 会分配一个 URL：
```
https://ai-latam-platform.vercel.app
```

---

## 第三步：更新 Render 环境变量

回到 Render 控制台，添加 `FRONTEND_URL` 环境变量：

| 变量名 | 值 |
|--------|-----|
| `FRONTEND_URL` | `https://ai-latam-platform.vercel.app` |

这样后端会接受来自你 Vercel 前端的请求。

---

## 第四步：验证部署

### 1. 测试后端 API

访问你的后端健康检查：
```bash
curl https://ai-latam-backend.onrender.com/health
```

应该返回：
```json
{"status":"ok","timestamp":"2025-01-15T..."}
```

### 2. 测试前端

访问你的 Vercel 前端 URL，确认：
- 首页正常加载
- Tools 页面显示数据
- Prompts 页面显示数据
- Blog 页面显示数据

### 3. 检查浏览器控制台

打开浏览器开发者工具，确保没有 CORS 错误或 API 调用失败。

---

## 常见问题

### Q: Render 免费版会休眠怎么办？

Render 免费版会在 15 分钟无活动后休眠。首次唤醒可能需要 30-60 秒。

**解决方案**：
- 使用付费版 ($7/月) 避免休眠
- 或者使用外部 ping 服务保持活跃

### Q: 如何设置自定义域名？

**Vercel**:
1. 进入项目 Settings → Domains
2. 添加你的域名
3. 按照提示配置 DNS

**Render**:
1. 进入 Service Settings → Custom Domains
2. 添加域名并配置 DNS

### Q: 数据库迁移失败了怎么办？

确保你的 `DATABASE_URL` 使用了 Supavisor 模式（端口 6543），并添加了 `?pgbouncer=true` 参数。

### Q: 如何更新部署？

- **Vercel**: 推送到 GitHub 主分支会自动触发部署
- **Render**: 推送到 GitHub 会自动触发部署

---

## 环境变量参考

### 前端 (.env.local 或 Vercel)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001  # 本地开发
# NEXT_PUBLIC_API_BASE_URL=https://ai-latam-backend.onrender.com  # 生产环境
```

### 后端 (backend/.env 或 Render)

```bash
# Database
DATABASE_URL=postgresql://postgres.xxx:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&pool_timeout=0&sslmode=require
DIRECT_URL=postgresql://postgres.xxx:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require

# Server
PORT=3001

# CORS (可选)
FRONTEND_URL=https://ai-latam-platform.vercel.app
```

---

## 费用估算

### 免费方案

| 服务 | 免费额度 | 限制 |
|------|---------|------|
| **Vercel** | 100GB 带宽/月 | 无限请求 |
| **Render** | 750 小时/月 | 15分钟无活动后休眠 |
| **Supabase** | 500MB 数据库 | 50,000 月活用户 |

### 付费升级（可选）

| 服务 | 最低付费 | 适合场景 |
|------|---------|---------|
| **Vercel Pro** | $20/月 | 生产环境，更高限额 |
| **Render Starter** | $7/月 | 避免休眠 |
| **Supabase Pro** | $25/月 | 更多存储和用户 |

---

## 下一步

部署完成后，你可以考虑：

1. **添加监控**: 设置 Sentry 或 LogRocket
2. **添加分析**: 集成 Google Analytics 或 Vercel Analytics
3. **SEO 优化**: 添加 metadata 和 sitemap
4. **性能优化**: 启用图片优化和缓存
5. **安全加固**: 添加 rate limiting 和认证

---

## 需要帮助？

- **Vercel 文档**: https://vercel.com/docs
- **Render 文档**: https://render.com/docs
- **Supabase 文档**: https://supabase.com/docs
