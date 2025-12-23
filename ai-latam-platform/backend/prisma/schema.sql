-- ============================================
-- AI Latam Platform - Database Schema
-- 数据库: Supabase PostgreSQL
-- ============================================

-- ============================================
-- Tools 表
-- ============================================
CREATE TABLE IF NOT EXISTS tools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  tag VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  price VARCHAR(100),
  url VARCHAR(500),
  affiliate_link VARCHAR(500),
  logo_url VARCHAR(500),
  image_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tools 表索引
CREATE INDEX IF NOT EXISTS idx_tools_tag ON tools(tag);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_is_featured ON tools(is_featured);
CREATE INDEX IF NOT EXISTS idx_tools_created_at ON tools(created_at);

-- ============================================
-- Prompts 表
-- ============================================
CREATE TABLE IF NOT EXISTS prompts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  platforms JSONB NOT NULL DEFAULT '[]'::jsonb,
  preview TEXT,
  prompt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prompts 表索引
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at);
CREATE INDEX IF NOT EXISTS idx_prompts_platforms ON prompts USING GIN(platforms);

-- ============================================
-- Posts 表
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  tag VARCHAR(100),
  read_time VARCHAR(50),
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts 表索引
CREATE INDEX IF NOT EXISTS idx_posts_tag ON posts(tag);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);

-- ============================================
-- 初始测试数据 (可选)
-- ============================================

-- 插入测试 Tools
INSERT INTO tools (name, tag, category, description, price, url, is_featured) VALUES
  ('ChatGPT', 'AI工具', '文本写作', 'OpenAI 的强大语言模型', '免费/$20/月', 'https://chat.openai.com', true),
  ('Midjourney', 'AI工具', '图像生成', '高质量 AI 图像生成工具', '$10/月起', 'https://midjourney.com', true),
  ('Claude', 'AI工具', '文本写作', 'Anthropic 的 AI 助手', '免费/Pro版', 'https://claude.ai', false)
ON CONFLICT (name) DO NOTHING;

-- 插入测试 Prompts
INSERT INTO prompts (title, category, platforms, preview, prompt) VALUES
  ('博客文章写作助手', '写作', '["ChatGPT", "Claude"]', '帮助你快速写出高质量博客文章', '你是一位专业的博客写手，请根据以下主题写一篇1000字的博客文章...'),
  ('代码审查专家', '编程', '["ChatGPT", "Claude"]', '审查代码并提供优化建议', '请审查以下代码，指出潜在问题并提供优化建议...'),
  ('产品描述生成器', '营销', '["ChatGPT"]', '生成吸引人的产品描述', '根据以下产品信息，生成一段吸引人的产品描述...')
ON CONFLICT (title) DO NOTHING;

-- 插入测试 Posts
INSERT INTO posts (title, excerpt, tag, read_time, published_at, content) VALUES
  ('Midjourney V6 提示词工程全面指南', '从光影控制到材质渲染，拆解 V6 版本的核心逻辑与实战技巧。', '深度测评', '8 Min Read', '2025-12-23 00:00:00+00', '# Midjourney V6 指南\n\n详细内容...'),
  ('Claude 做客户调研的高效流程', '用结构化提示词建立用户洞察框架，提高调研质量与效率。', '增长实验', '6 Min Read', '2025-12-19 00:00:00+00', '# Claude 客户调研\n\n详细内容...'),
  ('GPT-4o 视频脚本黄金模板', '一套可复用的短视频脚本框架，适用于带货与品牌传播。', '提示词拆解', '5 Min Read', '2025-12-12 00:00:00+00', '# GPT-4o 视频脚本\n\n详细内容...')
ON CONFLICT DO NOTHING;
