import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../config/database';

// ------------------------------------------------------------------
// 辅助函数：统一返回格式（数据库驼峰 -> API下划线）
// ------------------------------------------------------------------
const formatLearningNoteResponse = (note: any) => ({
  id: note.id,
  title: note.title,
  slug: note.slug,
  category: note.category,
  summary: note.summary,
  tags: note.tags, // JSON 数组
  cover_image: note.coverImage,
  content: note.content, // 完整的 Markdown 内容
  order_index: note.orderIndex || null,
  updated_at: note.updatedAt ? note.updatedAt.toISOString() : null,
  created_at: note.createdAt ? note.createdAt.toISOString() : new Date().toISOString(),
});

// ------------------------------------------------------------------
// GET /api/learning-notes - 获取所有学习笔记（支持筛选）
// ------------------------------------------------------------------
export const getAllLearningNotes = async (req: Request, res: Response): Promise<any> => {
  try {
    const { category, search, tag } = req.query;

    // 使用 Prisma 提供的类型定义 where
    const where: Prisma.LearningNoteWhereInput = {};

    // 分类筛选
    if (category) where.category = String(category);

    // 标签筛选（在 JSON 数组中搜索）
    if (tag) where.tags = { has: String(tag) };

    // 搜索功能（标题、内容、摘要）
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { content: { contains: String(search), mode: 'insensitive' } },
        { summary: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const notes = await prisma.learningNote.findMany({
      where,
      orderBy: [
        { orderIndex: 'asc' }, // 手动排序优先
        { updatedAt: 'desc' }, // 然后按更新时间降序
      ],
    });

    const response = {
      learning_notes: notes.map(formatLearningNoteResponse),
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching learning notes:', error);
    return res.status(500).json({ error: 'Failed to fetch learning notes' });
  }
};

// ------------------------------------------------------------------
// GET /api/learning-notes/:id - 获取单个学习笔记详情
// ------------------------------------------------------------------
export const getLearningNoteById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const noteId = Number(id);

    // 校验 ID 是否为有效数字
    if (isNaN(noteId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const note = await prisma.learningNote.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      return res.status(404).json({ error: 'Learning note not found' });
    }

    return res.json(formatLearningNoteResponse(note));
  } catch (error) {
    console.error('Error fetching learning note:', error);
    return res.status(500).json({ error: 'Failed to fetch learning note' });
  }
};

// ------------------------------------------------------------------
// POST /api/learning-notes - 创建新的学习笔记
// ------------------------------------------------------------------
export const createLearningNote = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      title,
      slug,
      category,
      summary,
      tags,
      cover_image,
      content,
      order_index,
    } = req.body;

    // 基本校验
    if (!title || !slug || !category || !content) {
      return res.status(400).json({ error: 'title, slug, category, and content are required' });
    }

    // 验证 tags 是非空数组
    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ error: 'tags must be a non-empty array' });
    }

    // Prisma 写入（API下划线 -> DB驼峰）
    // 将 tags 显式转换为 Prisma.JsonValue
    const note = await prisma.learningNote.create({
      data: {
        title,
        slug,
        category,
        summary,
        tags: tags as Prisma.JsonValue,
        coverImage: cover_image,
        content,
        orderIndex: order_index,
      },
    });

    return res.status(201).json(formatLearningNoteResponse(note));
  } catch (error) {
    console.error('Error creating learning note:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: 唯一约束冲突
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Note with this title or slug already exists' });
      }
    }
    return res.status(500).json({ error: 'Failed to create learning note' });
  }
};

// ------------------------------------------------------------------
// PUT /api/learning-notes/:id - 更新学习笔记
// ------------------------------------------------------------------
export const updateLearningNote = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const noteId = Number(id);

    // 校验 ID
    if (isNaN(noteId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const {
      title,
      slug,
      category,
      summary,
      tags,
      cover_image,
      content,
      order_index,
    } = req.body;

    const note = await prisma.learningNote.update({
      where: { id: noteId },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(category && { category }),
        ...(summary !== undefined && { summary }),
        ...(tags && { tags }),
        ...(cover_image !== undefined && { coverImage: cover_image }),
        ...(content !== undefined && { content }),
        ...(order_index !== undefined && { orderIndex: order_index }),
      },
    });

    return res.json(formatLearningNoteResponse(note));
  } catch (error) {
    console.error('Error updating learning note:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025: 记录未找到
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Learning note not found' });
      }
      // P2002: 唯一约束冲突
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Note with this title or slug already exists' });
      }
    }
    return res.status(500).json({ error: 'Failed to update learning note' });
  }
};

// ------------------------------------------------------------------
// DELETE /api/learning-notes/:id - 删除学习笔记
// ------------------------------------------------------------------
export const deleteLearningNote = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const noteId = Number(id);

    if (isNaN(noteId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    await prisma.learningNote.delete({
      where: { id: noteId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting learning note:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Learning note not found' });
      }
    }
    return res.status(500).json({ error: 'Failed to delete learning note' });
  }
};

// ------------------------------------------------------------------
// PATCH /api/learning-notes/batch - 批量操作（删除、更新、重排序）
// ------------------------------------------------------------------
export const batchUpdateLearningNotes = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids, action, data } = req.body;

    // 基本校验
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'ids must be a non-empty array' });
    }

    // 批量删除
    if (action === 'delete') {
      await prisma.learningNote.deleteMany({
        where: { id: { in: ids.map(Number) } },
      });
      return res.status(204).send();
    }

    // 批量更新（如修改分类）
    if (action === 'update') {
      const result = await prisma.learningNote.updateMany({
        where: { id: { in: ids.map(Number) } },
        data,
      });
      return res.json({ updated_count: result.count });
    }

    // 批量重排序
    if (action === 'reorder') {
      // data 格式: [{ id: 1, order_index: 0 }, { id: 2, order_index: 1 }, ...]
      if (!Array.isArray(data)) {
        return res.status(400).json({ error: 'reorder data must be an array' });
      }

      const updatePromises = data.map(({ id, order_index }: { id: number; order_index: number }) =>
        prisma.learningNote.update({
          where: { id: Number(id) },
          data: { orderIndex: order_index },
        })
      );

      await Promise.all(updatePromises);
      return res.json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid batch action' });
  } catch (error) {
    console.error('Error in batch operation:', error);
    return res.status(500).json({ error: 'Failed to perform batch operation' });
  }
};
