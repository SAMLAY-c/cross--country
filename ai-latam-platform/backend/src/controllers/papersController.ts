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
    });

    return res.json({ papers: papers.map(formatPaperResponse) });
  } catch (error) {
    console.error('Error fetching papers:', error);
    return res.status(500).json({ error: 'Failed to fetch papers' });
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
    });

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    return res.json(formatPaperResponse(paper));
  } catch (error) {
    console.error('Error fetching paper:', error);
    return res.status(500).json({ error: 'Failed to fetch paper' });
  }
};
