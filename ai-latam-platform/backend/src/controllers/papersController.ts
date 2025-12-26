import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../config/database';

const formatPaperResponse = (paper: any) => ({
  id: paper.id,
  title: paper.title,
  arxiv_id: paper.arxivId,
  slug: paper.slug,
  authors: (paper.authors as unknown as string[]) || [],
  summary: paper.summary,
  abstract: paper.abstract,
  venue: paper.venue,
  year: paper.year,
  primary_category: paper.primaryCategory,
  tags: (paper.tags as unknown as string[]) || [],
  pdf_url: paper.pdfUrl,
  code_url: paper.codeUrl,
  project_url: paper.projectUrl,
  cover_image: paper.coverImage,
  published_at: paper.publishedAt ? paper.publishedAt.toISOString() : null,
  created_at: paper.createdAt ? paper.createdAt.toISOString() : new Date().toISOString(),
});

// GET /api/papers - 获取所有论文
export const getAllPapers = async (req: Request, res: Response): Promise<any> => {
  try {
    const { year, theme } = req.query;
    const where: Prisma.PaperWhereInput = {};

    if (year && typeof year === 'string') {
      const yearValue = Number(year);
      if (!Number.isNaN(yearValue)) {
        where.year = yearValue;
      }
    }

    if (theme && typeof theme === 'string') {
      where.tags = { array_contains: [theme] };
    }

    const papers = await prisma.paper.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        arxivId: true,
        slug: true,
        authors: true,
        summary: true,
        abstract: true,
        venue: true,
        year: true,
        primaryCategory: true,
        tags: true,
        pdfUrl: true,
        codeUrl: true,
        projectUrl: true,
        coverImage: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.json({ papers: papers.map(formatPaperResponse) });
  } catch (error) {
    console.error('Error fetching papers:', error);
    return res.status(500).json({ error: 'Failed to fetch papers' });
  }
};

// GET /api/papers/slug/:slug - 获取单篇论文详情
export const getPaperBySlug = async (req: Request, res: Response): Promise<any> => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }

    const paper = await prisma.paper.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        arxivId: true,
        slug: true,
        authors: true,
        summary: true,
        abstract: true,
        venue: true,
        year: true,
        primaryCategory: true,
        tags: true,
        pdfUrl: true,
        codeUrl: true,
        projectUrl: true,
        coverImage: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.json(formatPaperResponse(paper));
  } catch (error) {
    console.error('Error fetching paper by slug:', error);
    return res.status(500).json({ error: 'Failed to fetch paper' });
  }
};

// GET /api/papers/:id - 获取单篇论文详情
export const getPaperById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const paperId = Number(id);

    if (isNaN(paperId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
      select: {
        id: true,
        title: true,
        arxivId: true,
        slug: true,
        authors: true,
        summary: true,
        abstract: true,
        venue: true,
        year: true,
        primaryCategory: true,
        tags: true,
        pdfUrl: true,
        codeUrl: true,
        projectUrl: true,
        coverImage: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.json(formatPaperResponse(paper));
  } catch (error) {
    console.error('Error fetching paper:', error);
    return res.status(500).json({ error: 'Failed to fetch paper' });
  }
};

// POST /api/papers - 创建新论文
export const createPaper = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      title,
      arxivId,
      slug,
      authors,
      summary,
      abstract,
      venue,
      year,
      primaryCategory,
      tags,
      pdfUrl,
      codeUrl,
      projectUrl,
      coverImage,
    } = req.body;

    // 验证必填字段
    if (!title || !arxivId || !slug || !authors || !tags) {
      return res.status(400).json({ error: 'Missing required fields: title, arxivId, slug, authors, tags' });
    }

    // 检查 arxivId 是否已存在
    const existing = await prisma.paper.findUnique({
      where: { arxivId },
    });

    if (existing) {
      return res.status(409).json({ error: 'Paper with this arxivId already exists' });
    }

    const paper = await prisma.paper.create({
      data: {
        title,
        arxivId,
        slug,
        authors: authors as string[],
        summary: summary || null,
        abstract: abstract || null,
        venue: venue || null,
        year: year ? Number(year) : null,
        primaryCategory: primaryCategory || null,
        tags: tags as string[],
        pdfUrl: pdfUrl || null,
        codeUrl: codeUrl || null,
        projectUrl: projectUrl || null,
        coverImage: coverImage || null,
      },
    });

    return res.status(201).json(formatPaperResponse(paper));
  } catch (error) {
    console.error('Error creating paper:', error);
    return res.status(500).json({ error: 'Failed to create paper' });
  }
};
