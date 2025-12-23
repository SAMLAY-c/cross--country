import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../config/database';

// GET /api/posts - 获取所有文章
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { tag } = req.query;

    const where: any = {};
    if (tag) where.tag = String(tag);

    const posts = await prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    });

    const response = {
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        tag: post.tag,
        read_time: post.readTime,
        published_at: post.publishedAt,
        content: post.content,
        created_at: post.createdAt.toISOString(),
      })),
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// GET /api/posts/:id - 获取单个文章详情
export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      tag: post.tag,
      read_time: post.readTime,
      published_at: post.publishedAt,
      content: post.content,
      created_at: post.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// POST /api/posts - 创建新文章
export const createPost = async (req: Request, res: Response) => {
  try {
    const {
      title,
      excerpt,
      tag,
      read_time,
      published_at,
      content,
    } = req.body;

    if (!title || !published_at) {
      return res.status(400).json({ error: 'title and published_at are required' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        excerpt,
        tag,
        readTime: read_time,
        publishedAt: published_at,
        content,
      },
    });

    res.status(201).json({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      tag: post.tag,
      read_time: post.readTime,
      published_at: post.publishedAt,
      content: post.content,
      created_at: post.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// PUT /api/posts/:id - 更新文章
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      tag,
      read_time,
      published_at,
      content,
    } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (tag !== undefined) updateData.tag = tag;
    if (read_time !== undefined) updateData.readTime = read_time;
    if (published_at) updateData.publishedAt = published_at;
    if (content !== undefined) updateData.content = content;

    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.json({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      tag: post.tag,
      read_time: post.readTime,
      published_at: post.publishedAt,
      content: post.content,
      created_at: post.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error updating post:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Post not found' });
      }
    }
    res.status(500).json({ error: 'Failed to update post' });
  }
};

// DELETE /api/posts/:id - 删除文章
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.post.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting post:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Post not found' });
      }
    }
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
