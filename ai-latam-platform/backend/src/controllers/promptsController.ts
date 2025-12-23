import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../config/database'; // 假设这是你的 prisma 实例路径

// 定义 Request Body 接口，以获得更好的类型提示（可选，但推荐）
interface CreatePromptBody {
  title: string;
  category: string;
  platforms: string[];
  preview?: string;
  prompt: string;
  cover_image?: string;
}

// GET /api/prompts - 获取所有提示词
export const getAllPrompts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const where: { category?: string } = {};
    
    // 修复：确保 category 确实存在且是字符串，避免 String(undefined) 或数组转换问题
    if (category && typeof category === 'string') {
      where.category = category;
    }

    const prompts = await prisma.prompt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const response = {
      prompts: prompts.map((prompt) => ({
        id: prompt.id,
        title: prompt.title,
        category: prompt.category,
        // 修复：Prisma JSON 类型需断言，建议使用 unknown 先转一下
        platforms: prompt.platforms as unknown as string[],
        preview: prompt.preview,
        prompt: prompt.prompt,
        cover_image: prompt.coverImage,
        created_at: prompt.createdAt.toISOString(),
      })),
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
};

// GET /api/prompts/:id - 获取单个提示词详情
export const getPromptById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const promptId = Number(id);

    // 修复：增加 NaN 检查，防止数据库查询抛出异常
    if (isNaN(promptId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) {
      // 修复：加上 return 确保函数执行结束
      return res.status(404).json({ error: 'Prompt not found' });
    }

    res.json({
      id: prompt.id,
      title: prompt.title,
      category: prompt.category,
      platforms: prompt.platforms as unknown as string[],
      preview: prompt.preview,
      prompt: prompt.prompt,
      cover_image: prompt.coverImage,
      created_at: prompt.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching prompt:', error);
    res.status(500).json({ error: 'Failed to fetch prompt' });
  }
};

// POST /api/prompts - 创建新提示词
export const createPrompt = async (req: Request, res: Response) => {
  try {
    // 显式解构并重命名 body 中的 prompt 字段，避免变量名混淆
    const {
      title,
      category,
      platforms,
      preview,
      prompt: promptContent,
      cover_image,
    } = req.body as CreatePromptBody & { cover_image?: string };

    if (!title || !category || !promptContent) {
      return res.status(400).json({ error: 'title, category and prompt are required' });
    }

    if (!Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ error: 'platforms must be a non-empty array' });
    }

    const newPrompt = await prisma.prompt.create({
      data: {
        title,
        category,
        platforms,
        preview: preview || '', // 处理可能为 undefined 的情况
        prompt: promptContent,
        coverImage: cover_image,
      },
    });

    res.status(201).json({
      id: newPrompt.id,
      title: newPrompt.title,
      category: newPrompt.category,
      platforms: newPrompt.platforms as unknown as string[],
      preview: newPrompt.preview,
      prompt: newPrompt.prompt,
      cover_image: newPrompt.coverImage,
      created_at: newPrompt.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error creating prompt:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Prompt already exists' });
      }
    }
    res.status(500).json({ error: 'Failed to create prompt' });
  }
};

// PUT /api/prompts/:id - 更新提示词
export const updatePrompt = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, category, platforms, preview, prompt: promptContent, cover_image } = req.body;
  const promptId = Number(id);

  if (isNaN(promptId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  if (platforms && !Array.isArray(platforms)) {
    return res.status(400).json({ error: 'Platforms must be an array of strings' });
  }

  try {
    const updateData: Record<string, unknown> = {};
    
    if (title) updateData.title = title;
    if (category) updateData.category = category;
    if (platforms) updateData.platforms = platforms;
    if (preview !== undefined) updateData.preview = preview;
    if (promptContent) updateData.prompt = promptContent;
    if (cover_image !== undefined) updateData.coverImage = cover_image;

    const updatedPrompt = await prisma.prompt.update({
      where: { id: promptId },
      data: updateData,
    });

    res.json({
      id: updatedPrompt.id,
      title: updatedPrompt.title,
      category: updatedPrompt.category,
      platforms: updatedPrompt.platforms as unknown as string[],
      preview: updatedPrompt.preview,
      prompt: updatedPrompt.prompt,
      cover_image: updatedPrompt.coverImage,
      created_at: updatedPrompt.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error updating prompt:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Prompt not found' });
      }
    }
    res.status(500).json({ error: 'Failed to update prompt' });
  }
};

// DELETE /api/prompts/:id - 删除提示词
export const deletePrompt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const promptId = Number(id);

    if (isNaN(promptId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    await prisma.prompt.delete({
      where: { id: promptId },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting prompt:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Prompt not found' });
      }
    }
    res.status(500).json({ error: 'Failed to delete prompt' });
  }
};
