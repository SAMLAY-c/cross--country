import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../config/database';

// GET /api/prompts - 获取所有提示词
export const getAllPrompts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const where: any = {};
    if (category) where.category = String(category);

    const prompts = await prisma.prompt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const response = {
      prompts: prompts.map((prompt) => ({
        id: prompt.id,
        title: prompt.title,
        category: prompt.category,
        platforms: prompt.platforms as unknown as string[],
        preview: prompt.preview,
        prompt: prompt.prompt,
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

    const prompt = await prisma.prompt.findUnique({
      where: { id: Number(id) },
    });

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    res.json({
      id: prompt.id,
      title: prompt.title,
      category: prompt.category,
      platforms: prompt.platforms as unknown as string[],
      preview: prompt.preview,
      prompt: prompt.prompt,
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
    const { title, category, platforms, preview, prompt } = req.body;

    if (!title || !category || !prompt) {
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
        preview,
        prompt,
      },
    });

    res.status(201).json({
      id: newPrompt.id,
      title: newPrompt.title,
      category: newPrompt.category,
      platforms: newPrompt.platforms as unknown as string[],
      preview: newPrompt.preview,
      prompt: newPrompt.prompt,
      created_at: newPrompt.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error creating prompt:', error);
    res.status(500).json({ error: 'Failed to create prompt' });
  }
};

// PUT /api/prompts/:id - 更新提示词
export const updatePrompt = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, category, platforms, preview, prompt } = req.body;

  if (platforms && !Array.isArray(platforms)) {
    return res.status(400).json({ error: 'Platforms must be an array of strings' });
  }

  try {
    const updateData: any = {};
    if (title) updateData.title = title;
    if (category) updateData.category = category;
    if (platforms) updateData.platforms = platforms;
    if (preview !== undefined) updateData.preview = preview;
    if (prompt) updateData.prompt = prompt;

    const updatedPrompt = await prisma.prompt.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.json({
      id: updatedPrompt.id,
      title: updatedPrompt.title,
      category: updatedPrompt.category,
      platforms: updatedPrompt.platforms as unknown as string[],
      preview: updatedPrompt.preview,
      prompt: updatedPrompt.prompt,
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

    await prisma.prompt.delete({
      where: { id: Number(id) },
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
