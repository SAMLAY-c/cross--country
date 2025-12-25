import express from 'express';
import {
  getAllLearningNotes,
  getLearningNoteById,
  createLearningNote,
  updateLearningNote,
  deleteLearningNote,
  batchUpdateLearningNotes,
} from '../controllers/learningNotesController';

const router = express.Router();

// GET /api/learning-notes - 获取所有学习笔记（支持查询: ?category=xxx&search=xxx&tag=xxx）
router.get('/', getAllLearningNotes);

// GET /api/learning-notes/:id - 获取单个学习笔记详情
router.get('/:id', getLearningNoteById);

// POST /api/learning-notes - 创建新的学习笔记
router.post('/', createLearningNote);

// PUT /api/learning-notes/:id - 更新学习笔记
router.put('/:id', updateLearningNote);

// DELETE /api/learning-notes/:id - 删除学习笔记
router.delete('/:id', deleteLearningNote);

// PATCH /api/learning-notes/batch - 批量操作（删除、更新、重排序）
router.patch('/batch', batchUpdateLearningNotes);

export default router;
