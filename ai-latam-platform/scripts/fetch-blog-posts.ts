/**
 * Blog Posts Aggregator
 * 从 Medium/Dev.to 等平台抓取 AI 相关技术文章
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface BlogPost {
  title: string;
  url: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
}

/**
 * 从 Medium RSS 抓取 AI 文章 (示例)
 * TODO: 替换为真实的 RSS 解析器 (如 rss-parser)
 */
async function fetchFromMedium(): Promise<BlogPost[]> {
  // 模拟数据
  return [
    {
      title: 'Introduction to Large Language Models',
      url: 'https://medium.com/example/llm-intro',
      excerpt: 'Learn about the fundamentals of LLMs and how they work...',
      author: 'John Doe',
      publishedAt: new Date().toISOString(),
      tags: ['AI', 'Machine Learning', 'LLM'],
    },
  ];
}

/**
 * 从 Dev.to 抓取 AI 文章 (示例)
 */
async function fetchFromDevTo(): Promise<BlogPost[]> {
  // 模拟数据
  return [
    {
      title: 'Building AI Applications with Next.js',
      url: 'https://dev.to/example/nextjs-ai',
      excerpt: 'A practical guide to integrating AI into your web apps...',
      author: 'Jane Smith',
      publishedAt: new Date().toISOString(),
      tags: ['JavaScript', 'AI', 'Web Development'],
    },
  ];
}

/**
 * 判断是否为 AI 相关文章
 */
function isAIArticle(title: string, tags: string[]): boolean {
  const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'llm', 'gpt'];
  const text = title.toLowerCase() + tags.join(' ').toLowerCase();
  return aiKeywords.some(keyword => text.includes(keyword));
}

/**
 * 计算阅读时间 (基于字数)
 */
function calculateReadingTime(excerpt: string): number {
  const wordsPerMinute = 200;
  const wordCount = excerpt.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * 保存文章到数据库
 */
async function savePost(post: BlogPost) {
  // 检查是否已存在
  const { data: existing } = await supabase
    .from('posts')
    .select('id')
    .eq('title', post.title)
    .single();

  if (existing) {
    console.log(`⏭️  跳过已存在: ${post.title}`);
    return;
  }

  // 插入新文章
  const { error } = await supabase
    .from('posts')
    .insert({
      title: post.title,
      excerpt: post.excerpt,
      tag: post.tags[0] || 'AI',
      read_time: calculateReadingTime(post.excerpt),
      content: `文章来源: ${post.url}\n作者: ${post.author}`, // 简化内容
      published_at: post.publishedAt,
    });

  if (error) {
    console.error(`❌ 插入失败: ${post.title}`, error.message);
  } else {
    console.log(`✅ 新增文章: ${post.title}`);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始抓取技术博客...');
  console.log(`⏰ 时间: ${new Date().toISOString()}`);

  try {
    const [mediumPosts, devPosts] = await Promise.all([
      fetchFromMedium(),
      fetchFromDevTo(),
    ]);

    const allPosts = [...mediumPosts, ...devPosts];
    console.log(`📦 获取到 ${allPosts.length} 篇文章`);

    let addedCount = 0;
    for (const post of allPosts) {
      if (isAIArticle(post.title, post.tags)) {
        await savePost(post);
        addedCount++;
      }
    }

    console.log(`\n✨ 完成! 新增 ${addedCount} 篇 AI 文章`);
  } catch (error) {
    console.error('❌ 抓取失败:', error);
    process.exit(1);
  }
}

main();
