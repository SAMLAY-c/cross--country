import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../config/database';

// GET /api/tools - 获取所有工具
export const getAllTools = async (req: Request, res: Response) => {
  try {
    const { tag, category, featured } = req.query;

    const where: any = {};

    if (tag) where.tag = String(tag);
    if (category) where.category = String(category);
    if (featured === 'true') where.isFeatured = true;

    const tools = await prisma.tool.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const response = {
      tools: tools.map((tool) => ({
        id: tool.id,
        name: tool.name,
        tag: tool.tag,
        category: tool.category,
        description: tool.description,
        price: tool.price,
        url: tool.url,
        affiliate_link: tool.affiliateLink,
        logo_url: tool.logoUrl,
        image_url: tool.imageUrl,
        is_featured: tool.isFeatured,
        created_at: tool.createdAt.toISOString(),
      })),
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ error: 'Failed to fetch tools' });
  }
};

// GET /api/tools/:id - 获取单个工具详情
export const getToolById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tool = await prisma.tool.findUnique({
      where: { id: Number(id) },
    });

    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    res.json({
      id: tool.id,
      name: tool.name,
      tag: tool.tag,
      category: tool.category,
      description: tool.description,
      price: tool.price,
      url: tool.url,
      affiliate_link: tool.affiliateLink,
      logo_url: tool.logoUrl,
      image_url: tool.imageUrl,
      is_featured: tool.isFeatured,
      created_at: tool.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching tool:', error);
    res.status(500).json({ error: 'Failed to fetch tool' });
  }
};

// POST /api/tools - 创建新工具
export const createTool = async (req: Request, res: Response) => {
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
      is_featured,
    } = req.body;

    if (!name || !tag) {
      return res.status(400).json({ error: 'name and tag are required' });
    }

    const tool = await prisma.tool.create({
      data: {
        name,
        tag,
        category,
        description,
        price,
        url,
        affiliateLink: affiliate_link,
        logoUrl: logo_url,
        imageUrl: image_url,
        isFeatured: is_featured || false,
      },
    });

    res.status(201).json({
      id: tool.id,
      name: tool.name,
      tag: tool.tag,
      category: tool.category,
      description: tool.description,
      price: tool.price,
      url: tool.url,
      affiliate_link: tool.affiliateLink,
      logo_url: tool.logoUrl,
      image_url: tool.imageUrl,
      is_featured: tool.isFeatured,
      created_at: tool.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error creating tool:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Tool already exists' });
      }
    }
    res.status(500).json({ error: 'Failed to create tool' });
  }
};

// PUT /api/tools/:id - 更新工具
export const updateTool = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
      is_featured,
    } = req.body;

    const tool = await prisma.tool.update({
      where: { id: Number(id) },
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
        ...(is_featured !== undefined && { isFeatured: is_featured }),
      },
    });

    res.json({
      id: tool.id,
      name: tool.name,
      tag: tool.tag,
      category: tool.category,
      description: tool.description,
      price: tool.price,
      url: tool.url,
      affiliate_link: tool.affiliateLink,
      logo_url: tool.logoUrl,
      image_url: tool.imageUrl,
      is_featured: tool.isFeatured,
      created_at: tool.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error updating tool:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Tool not found' });
      }
    }
    res.status(500).json({ error: 'Failed to update tool' });
  }
};

// DELETE /api/tools/:id - 删除工具
export const deleteTool = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.tool.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting tool:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Tool not found' });
      }
    }
    res.status(500).json({ error: 'Failed to delete tool' });
  }
};
