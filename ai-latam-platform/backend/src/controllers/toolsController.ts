import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../config/database';

// ------------------------------------------------------------------
// 辅助函数：统一返回格式
// ------------------------------------------------------------------
const formatToolResponse = (tool: any) => ({
  id: tool.id,
  name: tool.name,
  tag: tool.tag,
  category: tool.category,
  description: tool.description,
  price: tool.price,
  url: tool.url,
  affiliate_link: tool.affiliateLink, // 数据库驼峰 -> API下划线
  logo_url: tool.logoUrl,
  image_url: tool.imageUrl,
  gallery: tool.gallery,
  is_featured: tool.isFeatured,
  created_at: tool.createdAt ? tool.createdAt.toISOString() : new Date().toISOString(),
});

// ------------------------------------------------------------------
// GET /api/tools - 获取所有工具
// ------------------------------------------------------------------
export const getAllTools = async (req: Request, res: Response): Promise<any> => {
  try {
    const { tag, category, featured } = req.query;

    // 使用 Prisma 提供的类型定义 where，而不是 any
    const where: Prisma.ToolWhereInput = {};

    if (tag) where.tag = String(tag);
    if (category) where.category = String(category);
    
    // 处理 featured 字符串转布尔值
    if (featured === 'true') where.isFeatured = true;

    const tools = await prisma.tool.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const response = {
      tools: tools.map(formatToolResponse),
    };

    res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.json(response);
  } catch (error) {
    console.error('Error fetching tools:', error);
    return res.status(500).json({ error: 'Failed to fetch tools' });
  }
};

// ------------------------------------------------------------------
// GET /api/tools/:id - 获取单个工具详情
// ------------------------------------------------------------------
export const getToolById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const toolId = Number(id);

    // 修复：校验 ID 是否为有效数字
    if (isNaN(toolId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const tool = await prisma.tool.findUnique({
      where: { id: toolId },
    });

    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.json(formatToolResponse(tool));
  } catch (error) {
    console.error('Error fetching tool:', error);
    return res.status(500).json({ error: 'Failed to fetch tool' });
  }
};

// ------------------------------------------------------------------
// POST /api/tools - 创建新工具
// ------------------------------------------------------------------
export const createTool = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      name,
      tag,
      category,
      description,
      price,
      url,
      affiliate_link,
      logo_url,
      image_url,
      gallery,
      is_featured,
    } = req.body;

    // 基本校验
    if (!name || !tag) {
      return res.status(400).json({ error: 'name and tag are required' });
    }

    // Prisma 写入
    const tool = await prisma.tool.create({
      data: {
        name,
        tag,
        category,
        description,
        price,
        url,
        // 映射：API(下划线) -> DB(驼峰)
        affiliateLink: affiliate_link,
        logoUrl: logo_url,
        imageUrl: image_url,
        // 如果 gallery 是 JSON 类型，Prisma 通常接受数组或对象，
        // 这里显式断言为 any 或者是 Prisma.InputJsonValue 可以避免 TS 类型报错
        gallery: gallery ?? [], 
        isFeatured: Boolean(is_featured), // 确保是布尔值
      },
    });

    return res.status(201).json(formatToolResponse(tool));
  } catch (error) {
    console.error('Error creating tool:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 是唯一约束冲突 (Unique constraint failed)
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Tool with this unique field already exists' });
      }
    }
    return res.status(500).json({ error: 'Failed to create tool' });
  }
};

// ------------------------------------------------------------------
// PUT /api/tools/:id - 更新工具
// ------------------------------------------------------------------
export const updateTool = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const toolId = Number(id);

    // 修复：校验 ID
    if (isNaN(toolId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const {
      name,
      tag,
      category,
      description,
      price,
      url,
      affiliate_link,
      logo_url,
      image_url,
      gallery,
      is_featured,
    } = req.body;

    const tool = await prisma.tool.update({
      where: { id: toolId },
      data: {
        ...(name && { name }),
        ...(tag && { tag }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(url !== undefined && { url }),
        ...(affiliate_link !== undefined && { affiliateLink: affiliate_link }),
        ...(logo_url !== undefined && { logoUrl: logo_url }),
        ...(image_url !== undefined && { imageUrl: image_url }),
        ...(gallery !== undefined && { gallery }),
        ...(is_featured !== undefined && { isFeatured: Boolean(is_featured) }),
      },
    });

    return res.json(formatToolResponse(tool));
  } catch (error) {
    console.error('Error updating tool:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025 记录未找到 (Record to update not found)
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Tool not found' });
      }
    }
    return res.status(500).json({ error: 'Failed to update tool' });
  }
};

// ------------------------------------------------------------------
// DELETE /api/tools/:id - 删除工具
// ------------------------------------------------------------------
export const deleteTool = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const toolId = Number(id);

    if (isNaN(toolId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    await prisma.tool.delete({
      where: { id: toolId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting tool:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Tool not found' });
      }
    }
    return res.status(500).json({ error: 'Failed to delete tool' });
  }
};
