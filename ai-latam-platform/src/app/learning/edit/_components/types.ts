/**
 * 学习笔记类型定义
 */
export type LearningNote = {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  tags: string[];
  coverImage?: string | null;
  content: string;
  orderIndex?: number | null;
  updatedAt: string | null;
  createdAt: string | null;
};

/**
 * 表单数据类型
 */
export type NoteForm = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  tags: string;
  cover_image: string;
  content: string;
};

/**
 * 编辑器视图模式
 */
export type ViewMode = "edit" | "preview" | "split";
