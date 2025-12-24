/**
 * AI Tools Aggregator
 * 从 Product Hunt RSS 等源抓取最新 AI 工具
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ProductHuntItem {
  title: string;
  url: string;
  description: string;
  votes: number;
}

/**
 * 从 Product Hunt RSS 获取 AI 工具 (示例实现)
 * 实际使用时需要替换为真实的 RSS 解析或 API 调用
 */
async function fetchFromProductHunt(): Promise<ProductHuntItem[]> {
  // TODO: 实现真实的 Product Hunt API/RSS 抓取
  // 这里提供模拟数据结构
  return [
    {
      title: 'AI Tool Example',
      url: 'https://example.com',
      description: 'An amazing AI tool',
      votes: 100,
    },
  ];
}

/**
 * 判断是否为 AI 相关工具
 */
function isAITool(title: string, description: string): boolean {
  const aiKeywords = [
    'ai', 'artificial intelligence', 'machine learning', 'gpt', 'chatbot',
    '人工智能', '机器学习', '自动化', '智能助手', 'ai工具', 'copilot'
  ];

  const text = `${title} ${description}`.toLowerCase();
  return aiKeywords.some(keyword => text.includes(keyword));
}

/**
 * 从 URL 提取域名作为 tag
 */
function extractTag(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    return hostname.split('.')[0];
  } catch {
    return 'Tool';
  }
}

/**
 * 保存工具到数据库
 */
async function saveTool(tool: ProductHuntItem) {
  // 检查是否已存在 (根据 URL 去重)
  const { data: existing } = await supabase
    .from('tools')
    .select('id')
    .eq('url', tool.url)
    .single();

  if (existing) {
    console.log(`⏭️  跳过已存在: ${tool.title}`);
    return;
  }

  // 插入新工具
  const { error } = await supabase
    .from('tools')
    .insert({
      name: tool.title,
      tag: extractTag(tool.url),
      category: isAITool(tool.title, tool.description) ? 'AI工具' : '生产力',
      description: tool.description,
      price: '免费试用', // 默认价格,实际应从页面抓取
      url: tool.url,
      is_featured: tool.votes > 50, // 投票数 > 50 设为精选
    });

  if (error) {
    console.error(`❌ 插入失败: ${tool.title}`, error.message);
  } else {
    console.log(`✅ 新增工具: ${tool.title}`);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始抓取 AI 工具...');
  console.log(`⏰ 时间: ${new Date().toISOString()}`);

  try {
    const tools = await fetchFromProductHunt();
    console.log(`📦 获取到 ${tools.length} 个工具`);

    let addedCount = 0;
    for (const tool of tools) {
      if (isAITool(tool.title, tool.description)) {
        await saveTool(tool);
        addedCount++;
      }
    }

    console.log(`\n✨ 完成! 新增 ${addedCount} 个 AI 工具`);
  } catch (error) {
    console.error('❌ 抓取失败:', error);
    process.exit(1);
  }
}

main();
