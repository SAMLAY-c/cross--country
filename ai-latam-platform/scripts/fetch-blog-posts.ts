/**
 * Blog Posts Aggregator
 * 从指定 RSS 源抓取文章并保存全文
 */

import { createClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'ai-latam-platform-bot/1.0',
  },
});

type FeedSource = {
  name: string;
  rssUrl: string;
  tag: string;
};

const FEEDS: FeedSource[] = [
  { name: 'OpenAI', rssUrl: 'https://openai.com/news/rss.xml', tag: 'OpenAI' },
  { name: 'DeepMind', rssUrl: 'https://deepmind.google/discover/blog/rss.xml', tag: 'DeepMind' },
  { name: 'Google Research', rssUrl: 'https://research.google/blog/rss', tag: 'Google Research' },
  { name: 'Google AI Blog', rssUrl: 'http://googleaiblog.blogspot.com/atom.xml', tag: 'Google AI Blog' },
  { name: 'Microsoft Research', rssUrl: 'https://www.microsoft.com/en-us/research/feed/', tag: 'Microsoft Research' },
  { name: 'AWS ML Blog', rssUrl: 'https://aws.amazon.com/blogs/machine-learning/feed/', tag: 'AWS ML Blog' },
  { name: 'Hugging Face', rssUrl: 'https://huggingface.co/blog/feed.xml', tag: 'Hugging Face' },
  { name: 'Papers with Code', rssUrl: 'https://paperswithcode.com/rss/trending', tag: 'Papers with Code' },
  { name: 'The Gradient', rssUrl: 'https://thegradient.pub/rss/', tag: 'The Gradient' },
  { name: 'Andrej Karpathy', rssUrl: 'http://karpathy.github.io/feed.xml', tag: 'Andrej Karpathy' },
  { name: 'Jay Alammar', rssUrl: 'http://jalammar.github.io/feed.xml', tag: 'Jay Alammar' },
  { name: 'Sebastian Raschka', rssUrl: 'https://magazine.sebastianraschka.com/feed', tag: 'Sebastian Raschka' },
  { name: 'Lil\'Log', rssUrl: 'https://lilianweng.github.io/index.xml', tag: 'Lil\'Log' },
  { name: 'MIT Technology Review', rssUrl: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', tag: 'MIT Technology Review' },
  { name: 'Ars Technica AI', rssUrl: 'https://arstechnica.com/tag/ai/feed/', tag: 'Ars Technica' },
];

const MAX_FEEDS = Number(process.env.RSS_MAX_FEEDS ?? 0);
const MAX_ITEMS_PER_FEED = Number(process.env.RSS_MAX_ITEMS ?? 0);

type BlogPost = {
  title: string;
  url: string;
  excerpt: string;
  publishedAt: string;
  tag: string;
  readTime: string;
  content: string;
  coverImage?: string | null;
};

const KEYWORD_RULES: Array<{ label: string; keywords: string[] }> = [
  { label: 'LLM', keywords: ['llm', 'large language model', 'gpt', 'chatgpt', 'gemini', 'claude'] },
  { label: 'Agent', keywords: ['agent', 'multi-agent', 'tool use', 'planning'] },
  { label: 'RAG', keywords: ['retrieval', 'rag', 'vector database'] },
  { label: 'Multimodal', keywords: ['multimodal', 'vision-language', 'image-text'] },
  { label: 'Diffusion', keywords: ['diffusion', 'stable diffusion', 'image generation'] },
  { label: 'Robotics', keywords: ['robot', 'robotics', 'embodied'] },
  { label: 'Safety', keywords: ['safety', 'alignment', 'red team', 'security'] },
  { label: 'Reasoning', keywords: ['reasoning', 'chain-of-thought', 'cot'] },
  { label: 'Optimization', keywords: ['training', 'fine-tuning', 'finetuning', 'distillation', 'quantization'] },
  { label: 'MLOps', keywords: ['mlops', 'deployment', 'serving', 'inference'] },
  { label: 'Benchmark', keywords: ['benchmark', 'evaluation', 'leaderboard'] },
  { label: 'Policy', keywords: ['policy', 'regulation', 'governance'] },
];

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

function extractKeywords(text: string): string[] {
  const normalized = text.toLowerCase();
  return KEYWORD_RULES.filter(rule =>
    rule.keywords.some(keyword => normalized.includes(keyword))
  ).map(rule => rule.label);
}

function buildTag(sourceTag: string, keywords: string[]): string {
  const unique = Array.from(new Set([sourceTag, ...keywords]));
  return unique.join(' / ');
}

function calculateReadingTime(text: string): string {
  const wordMatches = text.match(/\b\w+\b/g) ?? [];
  const cjkMatches = text.match(/[\u4e00-\u9fff]/g) ?? [];
  const wordCount = wordMatches.length + Math.ceil(cjkMatches.length / 2);
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} Min Read`;
}

type ArticleResult = {
  content: string;
  coverImage?: string | null;
};

function resolveImageUrl(rawUrl: string | null | undefined, baseUrl: string): string | null {
  if (!rawUrl) return null;
  try {
    return new URL(rawUrl, baseUrl).toString();
  } catch {
    return null;
  }
}

function extractCoverImage(document: Document, url: string): string | null {
  const metaOg = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
  const metaTwitter = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement | null;
  const metaItem = document.querySelector('meta[itemprop="image"]') as HTMLMetaElement | null;
  const metaImage =
    resolveImageUrl(metaOg?.content, url) ||
    resolveImageUrl(metaTwitter?.content, url) ||
    resolveImageUrl(metaItem?.content, url);
  if (metaImage) return metaImage;

  const firstImage = document.querySelector('article img, main img, img') as HTMLImageElement | null;
  return resolveImageUrl(firstImage?.src, url);
}

async function fetchArticleContent(url: string): Promise<ArticleResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'ai-latam-platform-bot/1.0' },
    });
    if (!response.ok) {
      return { content: '' };
    }
    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    const coverImage = extractCoverImage(dom.window.document, url);
    if (!article?.textContent) {
      return { content: '', coverImage };
    }
    return { content: article.textContent.trim(), coverImage };
  } catch {
    return { content: '' };
  } finally {
    clearTimeout(timeout);
  }
}

async function savePost(post: BlogPost) {
  const { data: existing } = await supabase
    .from('posts')
    .select('id')
    .eq('title', post.title)
    .single();

  if (existing) {
    console.log(`⏭️  跳过已存在: ${post.title}`);
    return;
  }

  const { error } = await supabase
    .from('posts')
    .insert({
      title: post.title,
      excerpt: post.excerpt,
      tag: post.tag,
      read_time: post.readTime,
      content: post.content,
      published_at: post.publishedAt,
      source_url: post.url,
      cover_image: post.coverImage ?? null,
    });

  if (error) {
    console.error(`❌ 插入失败: ${post.title}`, error.message);
  } else {
    console.log(`✅ 新增文章: ${post.title}`);
  }
}

async function fetchFromFeed(feed: FeedSource): Promise<BlogPost[]> {
  let parsed: Parser.Output<Parser.Item>;
  try {
    parsed = await parser.parseURL(feed.rssUrl);
  } catch (error) {
    console.error(`⚠️  RSS 获取失败: ${feed.name}`, error);
    return [];
  }
  if (!parsed.items?.length) return [];

  const posts: BlogPost[] = [];
  const items = MAX_ITEMS_PER_FEED > 0 ? parsed.items.slice(0, MAX_ITEMS_PER_FEED) : parsed.items;
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const title = item.title?.trim();
    if (!title) continue;
    const link = item.link || item.guid;
    if (!link) continue;

    const publishedAt = item.isoDate || item.pubDate || new Date().toISOString();
    const rawExcerpt = item.contentSnippet || stripHtml(item.content || '');
    const excerpt = truncate(rawExcerpt || title, 220);
    console.log(`   ↳ ${index + 1}/${items.length}: ${title}`);
    const article = await fetchArticleContent(link);
    const content = article.content || stripHtml(item.content || rawExcerpt || title);
    const keywords = extractKeywords(`${title} ${excerpt} ${content}`);
    const tag = buildTag(feed.tag, keywords);
    const coverImage =
      article.coverImage ||
      item.enclosure?.url ||
      (item as { itunes?: { image?: string } }).itunes?.image ||
      null;

    posts.push({
      title,
      url: link,
      excerpt,
      publishedAt,
      tag,
      readTime: calculateReadingTime(content),
      content,
      coverImage,
    });
  }

  return posts;
}

async function main() {
  console.log('🚀 开始抓取技术博客...');
  console.log(`⏰ 时间: ${new Date().toISOString()}`);

  try {
    const allPosts: BlogPost[] = [];
    const feedsToFetch = MAX_FEEDS > 0 ? FEEDS.slice(0, MAX_FEEDS) : FEEDS;
    for (const feed of feedsToFetch) {
      console.log(`🔎 抓取: ${feed.name}`);
      const posts = await fetchFromFeed(feed);
      if (!posts.length) {
        continue;
      }
      allPosts.push(...posts);
    }

    console.log(`📦 获取到 ${allPosts.length} 篇文章`);

    let addedCount = 0;
    for (const post of allPosts) {
      await savePost(post);
      addedCount++;
    }

    console.log(`\n✨ 完成! 新增 ${addedCount} 篇文章`);
  } catch (error) {
    console.error('❌ 抓取失败:', error);
    process.exit(1);
  }
}

main();
