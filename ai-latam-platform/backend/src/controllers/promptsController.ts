import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../config/database';

// 定义 Request Body 接口
interface CreatePromptBody {
  title: string;
  category: string;
  platforms: string[];
  preview?: string;
  prompt: string;
  cover_image?: string | null;
}

// ------------------------------------------------------------------
// 辅助函数：统一返回格式
// 作用：统一将 DB 的驼峰命名转为 API 的下划线命名，且处理 JSON 类型断言
// ------------------------------------------------------------------
const formatPromptResponse = (prompt: any) => ({
  id: prompt.id,
  title: prompt.title,
  category: prompt.category,
  // Prisma 的 Json 类型通常需要断言，这里处理为空数组的情况
  platforms: (prompt.platforms as unknown as string[]) || [],
  preview: prompt.preview,
  prompt: prompt.prompt,
  cover_image: prompt.coverImage,
  created_at: prompt.createdAt ? prompt.createdAt.toISOString() : new Date().toISOString(),
});

// ------------------------------------------------------------------
// GET /api/prompts - 获取所有提示词
// ------------------------------------------------------------------
export const getAllPrompts = async (req: Request, res: Response): Promise<any> => {
  try {
    const { category } = req.query;

    // 使用 Prisma 提供的类型，而不是手写对象
    const where: Prisma.PromptWhereInput = {};
    
    // 确保 category 是字符串
    if (category && typeof category === 'string') {
      where.category = category;
    }

    const prompts = await prisma.prompt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const response = {
      prompts: prompts.map(formatPromptResponse),
    };

    res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.json(response);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return res.status(500).json({ error: 'Failed to fetch prompts' });
  }
};

// ------------------------------------------------------------------
// GET /api/prompts/:id - 获取单个提示词详情
// ------------------------------------------------------------------
export const getPromptById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const promptId = Number(id);

    if (isNaN(promptId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.json(formatPromptResponse(prompt));
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return res.status(500).json({ error: 'Failed to fetch prompt' });
  }
};

// ------------------------------------------------------------------
// POST /api/prompts - 创建新提示词
// ------------------------------------------------------------------
export const createPrompt = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      title,
      category,
      platforms,
      preview,
      prompt: promptContent,
      cover_image,
    } = req.body as CreatePromptBody;

    // 必填项校验
    if (!title || !category || !promptContent) {
      return res.status(400).json({ error: 'title, category and prompt are required' });
    }

    // 数组校验
    if (!Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ error: 'platforms must be a non-empty array' });
    }

    const newPrompt = await prisma.prompt.create({
      data: {
        title,
        category,
        platforms, // Prisma 会自动处理 string[] 到 Json 的转换
        preview: preview || '',
        prompt: promptContent,
        coverImage: cover_image || null, // API 下划线 -> DB 驼峰
      },
    });

    return res.status(201).json(formatPromptResponse(newPrompt));
  } catch (error) {
    console.error('Error creating prompt:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: Unique constraint failed
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Prompt already exists' });
      }
    }
    return res.status(500).json({ error: 'Failed to create prompt' });
  }
};

// ------------------------------------------------------------------
// PUT /api/prompts/:id - 更新提示词
// ------------------------------------------------------------------
export const updatePrompt = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const promptId = Number(id);

    // 类型断言为 Partial，因为更新时字段都是可选的
    const { 
      title, 
      category, 
      platforms, 
      preview, 
      prompt: promptContent, 
      cover_image 
    } = req.body as Partial<CreatePromptBody>;

    if (isNaN(promptId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // 如果传了 platforms，必须校验格式
    if (platforms !== undefined && (!Array.isArray(platforms) || platforms.length === 0)) {
      return res.status(400).json({ error: 'Platforms must be a non-empty array' });
    }

    // 优化：直接在 data 中构建，避免使用 Record<string, unknown> 导致的类型丢失
    const updatedPrompt = await prisma.prompt.update({
      where: { id: promptId },
      data: {
        ...(title && { title }),
        ...(category && { category }),
        ...(platforms && { platforms }), // 如果 platforms 存在，则更新
        ...(preview !== undefined && { preview }),
        ...(promptContent && { prompt: promptContent }),
        ...(cover_image !== undefined && { coverImage: cover_image }),
      },
    });

    return res.json(formatPromptResponse(updatedPrompt));
  } catch (error) {
    console.error('Error updating prompt:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025: Record to update not found
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Prompt not found' });
      }
    }
    return res.status(500).json({ error: 'Failed to update prompt' });
  }
};

// ------------------------------------------------------------------
// DELETE /api/prompts/:id - 删除提示词
// ------------------------------------------------------------------
export const deletePrompt = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const promptId = Number(id);

    if (isNaN(promptId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    await prisma.prompt.delete({
      where: { id: promptId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting prompt:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Prompt not found' });
      }
    }
    return res.status(500).json({ error: 'Failed to delete prompt' });
  }
};
