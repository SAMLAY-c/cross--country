import express from 'express';
import { getAllPapers, getPaperById } from '../controllers/papersController';

const router = express.Router();

// GET /api/papers - 获取所有论文 (支持查询: ?year=2024)
router.get('/', getAllPapers);

// GET /api/papers/:id - 获取单篇论文详情
router.get('/:id', getPaperById);

export default router;
