import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postsController';

const router = express.Router();

// GET /api/posts - 获取所有文章 (支持查询: ?tag=xxx)
router.get('/', getAllPosts);

// GET /api/posts/:id - 获取单个文章详情
router.get('/:id', getPostById);

// POST /api/posts - 创建新文章
router.post('/', createPost);

// PUT /api/posts/:id - 更新文章
router.put('/:id', updatePost);

// DELETE /api/posts/:id - 删除文章
router.delete('/:id', deletePost);

export default router;
