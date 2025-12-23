import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import toolsRouter from './routes/tools';
import promptsRouter from './routes/prompts';
import postsRouter from './routes/posts';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 健康检查
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 根路径
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'AI Latam Platform API',
    version: '1.0.0',
    endpoints: {
      tools: '/api/tools',
      prompts: '/api/prompts',
      posts: '/api/posts',
    },
  });
});

// 路由
app.use('/api/tools', toolsRouter);
app.use('/api/prompts', promptsRouter);
app.use('/api/posts', postsRouter);

// 404 处理
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
});
