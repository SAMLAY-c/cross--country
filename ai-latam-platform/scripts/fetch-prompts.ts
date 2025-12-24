/**
 * Prompts Aggregator
 * 从社区抓取分享的 Prompt 模板
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface PromptTemplate {
  title: string;
  prompt: string;
  category: string;
  platforms: string[];
  preview?: string;
}

/**
 * 从 Prompt 社区抓取 (示例)
 * TODO: 可以从以下源抓取:
 * - Reddit r/ChatGPT
 * - FlowGPT
 * - SnackPrompt
 * - OpenPrompt
 */
async function fetchFromCommunities(): Promise<PromptTemplate[]> {
  // 模拟数据
  return [
    {
      title: '代码审查助手',
      prompt: '你是一位经验丰富的软件工程师。请仔细审查以下代码，重点关注:\n1. 潜在的 bug\n2. 性能优化机会\n3. 代码可读性\n4. 最佳实践建议\n\n代码:\n{code}',
      category: '编程开发',
      platforms: ['ChatGPT', 'Claude', 'Copilot'],
      preview: '帮助审查代码质量的专业助手',
    },
    {
      title: '营销文案生成器',
      prompt: '你是一位专业的营销文案撰稿人。请为以下产品创作一段吸引人的营销文案:\n\n产品名称: {product_name}\n核心功能: {features}\n目标用户: {target_audience}\n\n要求:\n- 突出产品独特卖点\n- 使用具有说服力的语言\n- 长度控制在 200 字以内',
      category: '营销',
      platforms: ['ChatGPT', 'Claude'],
      preview: '快速生成高质量营销文案',
    },
    {
      title: '学习计划制定',
      prompt: '你是一位资深的教育规划专家。请为我想学习 {skill} 制定一个详细的学习计划。\n\n当前水平: {current_level}\n可用时间: {time_per_day}\n学习目标: {goal}\n\n请提供:\n1. 分阶段的学习路径\n2. 推荐的学习资源\n3. 实践项目建议\n4. 进度检查点',
      category: '教育',
      platforms: ['ChatGPT', 'Claude'],
      preview: '个性化学习计划生成工具',
    },
  ];
}

/**
 * 保存 Prompt 到数据库
 */
async function savePrompt(prompt: PromptTemplate) {
  // 检查是否已存在
  const { data: existing } = await supabase
    .from('prompts')
    .select('id')
    .eq('title', prompt.title)
    .single();

  if (existing) {
    console.log(`⏭️  跳过已存在: ${prompt.title}`);
    return;
  }

  // 插入新 Prompt
  const { error } = await supabase
    .from('prompts')
    .insert({
      title: prompt.title,
      category: prompt.category,
      prompt: prompt.prompt,
      platforms: prompt.platforms,
      preview: prompt.preview || null,
    });

  if (error) {
    console.error(`❌ 插入失败: ${prompt.title}`, error.message);
  } else {
    console.log(`✅ 新增 Prompt: ${prompt.title}`);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始抓取 Prompt 模板...');
  console.log(`⏰ 时间: ${new Date().toISOString()}`);

  try {
    const prompts = await fetchFromCommunities();
    console.log(`📦 获取到 ${prompts.length} 个 Prompt`);

    let addedCount = 0;
    for (const prompt of prompts) {
      await savePrompt(prompt);
      addedCount++;
    }

    console.log(`\n✨ 完成! 新增 ${addedCount} 个 Prompt 模板`);
  } catch (error) {
    console.error('❌ 抓取失败:', error);
    process.exit(1);
  }
}

main();
