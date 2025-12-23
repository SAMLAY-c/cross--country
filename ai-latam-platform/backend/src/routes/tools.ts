import express from 'express';
import {
  getAllTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
} from '../controllers/toolsController';

const router = express.Router();

// GET /api/tools - 获取所有工具 (支持查询: ?tag=xxx&category=xxx&featured=true)
router.get('/', getAllTools);

// GET /api/tools/:id - 获取单个工具详情
router.get('/:id', getToolById);

// POST /api/tools - 创建新工具
router.post('/', createTool);

// PUT /api/tools/:id - 更新工具
router.put('/:id', updateTool);

// DELETE /api/tools/:id - 删除工具
router.delete('/:id', deleteTool);

export default router;
