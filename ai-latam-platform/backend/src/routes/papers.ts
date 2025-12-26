import express from 'express';
import { getAllPapers, getPaperById, getPaperBySlug, createPaper } from '../controllers/papersController';

const router = express.Router();

// GET /api/papers - 获取所有论文 (支持查询: ?year=2024&theme=RAG)
router.get('/', getAllPapers);

// GET /api/papers/slug/:slug - 获取单篇论文详情
router.get('/slug/:slug', getPaperBySlug);

// GET /api/papers/:id - 获取单篇论文详情
router.get('/:id', getPaperById);

// POST /api/papers - 创建新论文
router.post('/', createPaper);

export default router;
