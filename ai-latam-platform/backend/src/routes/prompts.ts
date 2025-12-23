import express from 'express';
import {
  getAllPrompts,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
} from '../controllers/promptsController';

const router = express.Router();

// GET /api/prompts - 获取所有提示词 (支持查询: ?category=xxx)
router.get('/', getAllPrompts);

// GET /api/prompts/:id - 获取单个提示词详情
router.get('/:id', getPromptById);

// POST /api/prompts - 创建新提示词
router.post('/', createPrompt);

// PUT /api/prompts/:id - 更新提示词
router.put('/:id', updatePrompt);

// DELETE /api/prompts/:id - 删除提示词
router.delete('/:id', deletePrompt);

export default router;
