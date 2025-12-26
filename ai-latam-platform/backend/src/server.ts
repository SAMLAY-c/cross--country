import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import toolsRouter from './routes/tools';
import promptsRouter from './routes/prompts';
import postsRouter from './routes/posts';
import papersRouter from './routes/papers';
import learningNotesRouter from './routes/learningNotes';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
// CORS 配置：生产环境应该限制具体的前端域名
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:7240',
  'http://localhost:7240',
];

app.use(cors({
  origin: (origin, callback) => {
    // 允许没有 origin 的请求（如移动应用、Postman等）
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((_req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${_req.method} ${_req.path}`);
  next();
});

// 健康检查
app.get('/health', (_req: Request, res: Response) => {
  void _req;
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 根路径
app.get('/api', (_req: Request, res: Response) => {
  void _req;
  res.json({
    message: 'AI Latam Platform API',
    version: '1.0.0',
    endpoints: {
      tools: '/api/tools',
      prompts: '/api/prompts',
      posts: '/api/posts',
      papers: '/api/papers',
      learningNotes: '/api/learning-notes',
    },
  });
});

// 路由
app.use('/api/tools', toolsRouter);
app.use('/api/prompts', promptsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/papers', papersRouter);
app.use('/api/learning-notes', learningNotesRouter);

// 404 处理
app.use((_req: Request, res: Response) => {
  void _req;
  res.status(404).json({ error: 'Not found' });
});

// 错误处理中间件
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  void _req;
  void _next;
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
});
