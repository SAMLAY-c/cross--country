"use client";

import { useEffect, useMemo, useState } from "react";
import { DUMMY_POSTS, DUMMY_PROMPTS, DUMMY_TOOLS } from "@/lib/mock-data";
import ImageUpload from "@/components/image-upload";
import ImageGalleryUpload from "@/components/image-gallery-upload";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

type Tool = {
  id: number;
  name: string;
  tag: string;
  category: string | null;
  description: string | null;
  price: string | null;
  url: string | null;
  affiliate_link: string | null;
  logo_url: string | null;
  image_url: string | null;
  gallery: string[] | null;
  is_featured: boolean;
  created_at: string;
};

type Prompt = {
  id: number;
  title: string;
  category: string;
  platforms: string[];
  preview: string | null;
  prompt: string;
  cover_image: string | null;
  created_at: string;
};

type Post = {
  id: number;
  title: string;
  excerpt: string | null;
  tag: string | null;
  read_time: string | null;
  published_at: string;
  content: string | null;
  cover_image: string | null;
  gallery: string[] | null;
  created_at: string;
};

type ToolForm = {
  name: string;
  tag: string;
  category: string;
  description: string;
  price: string;
  url: string;
  affiliate_link: string;
  logo_url: string;
  image_url: string;
  gallery: string[];
  is_featured: boolean;
};

type PromptForm = {
  title: string;
  category: string;
  platforms: string;
  preview: string;
  prompt: string;
  cover_image: string;
};

type PostForm = {
  title: string;
  excerpt: string;
  tag: string;
  read_time: string;
  published_at: string;
  content: string;
  cover_image: string;
  gallery: string[];
};

const initialToolForm: ToolForm = {
  name: "",
  tag: "",
  category: "",
  description: "",
  price: "",
  url: "",
  affiliate_link: "",
  logo_url: "",
  image_url: "",
  gallery: [],
  is_featured: false,
};

const initialPromptForm: PromptForm = {
  title: "",
  category: "",
  platforms: "",
  preview: "",
  prompt: "",
  cover_image: "",
};

const initialPostForm: PostForm = {
  title: "",
  excerpt: "",
  tag: "",
  read_time: "",
  published_at: "",
  content: "",
  cover_image: "",
  gallery: [],
};

const MOCK_TOOLS: Tool[] = DUMMY_TOOLS.map((tool) => ({
  id: tool.id,
  name: tool.name,
  tag: tool.tag,
  category: null,
  description: tool.description,
  price: tool.price,
  url: tool.url ?? null,
  affiliate_link: null,
  logo_url: null,
  image_url: null,
  gallery: [],
  is_featured: false,
  created_at: new Date().toISOString(),
}));

const MOCK_PROMPTS: Prompt[] = DUMMY_PROMPTS.map((prompt) => ({
  ...prompt,
  cover_image: null,
  created_at: new Date().toISOString(),
}));

const parseDotDate = (value: string): string => {
  const parts = value.split(".");
  if (parts.length === 3) {
    const [year, month, day] = parts.map((part) => Number(part));
    if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
      return new Date(Date.UTC(year, month - 1, day)).toISOString();
    }
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
};

const MOCK_POSTS: Post[] = DUMMY_POSTS.map((post) => ({
  id: post.id,
  title: post.title,
  excerpt: post.excerpt ?? null,
  tag: post.tag ?? null,
  read_time: post.readTime ?? null,
  published_at: parseDotDate(post.publishedAt),
  content: null,
  cover_image: null,
  gallery: [],
  created_at: new Date().toISOString(),
}));

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return response.status === 204 ? ({} as T) : ((await response.json()) as T);
}

function toOptionalValue(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function toDateInputValue(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function toIsoDate(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return trimmed;
  return date.toISOString();
}

export default function AdminPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState({
    tools: false,
    prompts: false,
    posts: false,
  });

  const [toolForm, setToolForm] = useState<ToolForm>(initialToolForm);
  const [promptForm, setPromptForm] = useState<PromptForm>(initialPromptForm);
  const [postForm, setPostForm] = useState<PostForm>(initialPostForm);

  const [editingToolId, setEditingToolId] = useState<number | null>(null);
  const [editingPromptId, setEditingPromptId] = useState<number | null>(null);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  const promptPlatforms = useMemo(
    () =>
      promptForm.platforms
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [promptForm.platforms],
  );

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [toolData, promptData, postData] = await Promise.all([
        apiRequest<{ tools: Tool[] }>("/api/tools"),
        apiRequest<{ prompts: Prompt[] }>("/api/prompts"),
        apiRequest<{ posts: Post[] }>("/api/posts"),
      ]);
      const toolList = toolData.tools ?? [];
      const promptList = promptData.prompts ?? [];
      const postList = postData.posts ?? [];

      const useToolMock = toolList.length === 0;
      const usePromptMock = promptList.length === 0;
      const usePostMock = postList.length === 0;

      setTools(useToolMock ? MOCK_TOOLS : toolList);
      setPrompts(usePromptMock ? MOCK_PROMPTS : promptList);
      setPosts(usePostMock ? MOCK_POSTS : postList);
      setUsingMock({
        tools: useToolMock,
        prompts: usePromptMock,
        posts: usePostMock,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message}（已切换为前端虚拟数据）`
          : "加载失败，已切换为前端虚拟数据",
      );
      setTools(MOCK_TOOLS);
      setPrompts(MOCK_PROMPTS);
      setPosts(MOCK_POSTS);
      setUsingMock({ tools: true, prompts: true, posts: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const resetToolForm = () => {
      setToolForm(initialToolForm);
      setEditingToolId(null);
    };

  const resetPromptForm = () => {
    setPromptForm(initialPromptForm);
    setEditingPromptId(null);
  };

  const resetPostForm = () => {
      setPostForm(initialPostForm);
      setEditingPostId(null);
    };

  const handleSaveTool = async () => {
    setError(null);
    if (!toolForm.name.trim() || !toolForm.tag.trim()) {
      setError("Tool 必须填写 name 和 tag");
      return;
    }
    const payload = {
      name: toolForm.name.trim(),
      tag: toolForm.tag.trim(),
      category: toOptionalValue(toolForm.category),
      description: toOptionalValue(toolForm.description),
      price: toOptionalValue(toolForm.price),
      url: toOptionalValue(toolForm.url),
      affiliate_link: toOptionalValue(toolForm.affiliate_link),
      logo_url: toOptionalValue(toolForm.logo_url),
      image_url: toOptionalValue(toolForm.image_url),
      gallery: toolForm.gallery.length ? toolForm.gallery : null,
      is_featured: toolForm.is_featured,
    };

    try {
      if (editingToolId) {
        await apiRequest(`/api/tools/${editingToolId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/api/tools", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      resetToolForm();
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    }
  };

  const handleSavePrompt = async () => {
    setError(null);
    if (
      !promptForm.title.trim() ||
      !promptForm.category.trim() ||
      !promptForm.prompt.trim()
    ) {
      setError("Prompt 必须填写 title / category / prompt");
      return;
    }

    const payload = {
      title: promptForm.title.trim(),
      category: promptForm.category.trim(),
      platforms: promptPlatforms,
      preview: toOptionalValue(promptForm.preview),
      prompt: promptForm.prompt.trim(),
      cover_image: toOptionalValue(promptForm.cover_image),
    };

    if (payload.platforms.length === 0) {
      setError("Prompt platforms 不能为空");
      return;
    }

    try {
      if (editingPromptId) {
        await apiRequest(`/api/prompts/${editingPromptId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/api/prompts", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      resetPromptForm();
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    }
  };

  const handleSavePost = async () => {
    setError(null);
    if (!postForm.title.trim() || !postForm.published_at.trim()) {
      setError("Post 必须填写 title 和 published_at");
      return;
    }

    const payload = {
      title: postForm.title.trim(),
      excerpt: toOptionalValue(postForm.excerpt),
      tag: toOptionalValue(postForm.tag),
      read_time: toOptionalValue(postForm.read_time),
      published_at: toIsoDate(postForm.published_at),
      content: toOptionalValue(postForm.content),
      cover_image: toOptionalValue(postForm.cover_image),
      gallery: postForm.gallery.length ? postForm.gallery : null,
    };

    try {
      if (editingPostId) {
        await apiRequest(`/api/posts/${editingPostId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/api/posts", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      resetPostForm();
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    }
  };

  const handleDelete = async (path: string, label: string) => {
    setError(null);
    if (!confirm(`确认删除 ${label}？`)) return;
    try {
      await apiRequest(path, { method: "DELETE" });
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
    }
  };

  const handleSeedMockData = async () => {
    setError(null);
    setLoading(true);
    try {
      const [existingToolData, existingPromptData, existingPostData] =
        await Promise.all([
          apiRequest<{ tools: Tool[] }>("/api/tools"),
          apiRequest<{ prompts: Prompt[] }>("/api/prompts"),
          apiRequest<{ posts: Post[] }>("/api/posts"),
        ]);

      const toolNames = new Set(
        (existingToolData.tools ?? []).map((tool) => tool.name),
      );
      const promptTitles = new Set(
        (existingPromptData.prompts ?? []).map((prompt) => prompt.title),
      );
      const postTitles = new Set(
        (existingPostData.posts ?? []).map((post) => post.title),
      );

      const seedRequest = async (path: string, payload: Record<string, unknown>) => {
        const response = await fetch(`${API_BASE}${path}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.status === 409) {
          return;
        }

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || `Request failed: ${response.status}`);
        }
      };

      for (const tool of MOCK_TOOLS) {
        if (toolNames.has(tool.name)) continue;
        await seedRequest("/api/tools", {
          name: tool.name,
          tag: tool.tag,
          category: tool.category,
          description: tool.description,
          price: tool.price,
          url: tool.url,
          affiliate_link: tool.affiliate_link,
          logo_url: tool.logo_url,
          image_url: tool.image_url,
          gallery: tool.gallery,
          is_featured: tool.is_featured,
        });
      }

      for (const prompt of MOCK_PROMPTS) {
        if (promptTitles.has(prompt.title)) continue;
        await seedRequest("/api/prompts", {
          title: prompt.title,
          category: prompt.category,
          platforms: prompt.platforms,
          preview: prompt.preview,
          prompt: prompt.prompt,
        });
      }

      for (const post of MOCK_POSTS) {
        if (postTitles.has(post.title)) continue;
        await seedRequest("/api/posts", {
          title: post.title,
          excerpt: post.excerpt,
          tag: post.tag,
          read_time: post.read_time,
          published_at: post.published_at,
          content: post.content,
          gallery: post.gallery,
        });
      }
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "导入失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1110] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(88,120,110,0.35),transparent_55%),radial-gradient(circle_at_90%_15%,rgba(255,204,148,0.2),transparent_50%),radial-gradient(circle_at_50%_90%,rgba(135,210,170,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,12,11,0.92),rgba(14,18,17,0.6))]" />
        <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 pb-20 pt-12 sm:px-10">
          <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">
              Admin Console
            </p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  AI Latam 内容管理
                </h1>
                <p className="mt-2 max-w-xl text-sm text-white/60">
                  这里是最小可用的 CRUD 后台，用于管理 Tools、Prompts 与
                  Posts，直接操作后端 API。
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 transition hover:border-white/40 hover:text-white"
                  onClick={loadAll}
                >
                  刷新数据
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--accent-contrast)] transition hover:brightness-110"
                  onClick={handleSeedMockData}
                >
                  导入虚拟数据
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}
            {(usingMock.tools || usingMock.prompts || usingMock.posts) && (
              <div className="mt-4 rounded-2xl border border-amber-300/40 bg-amber-200/10 px-4 py-3 text-sm text-amber-100">
                数据库暂无数据或未连接，当前显示前端虚拟数据。
              </div>
            )}
            {loading && (
              <div className="mt-4 text-xs uppercase tracking-[0.3em] text-white/40">
                Loading...
              </div>
            )}
          </header>

          <section className="grid gap-8">
            <div className="rounded-3xl border border-white/10 bg-[#0f1916]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Tools</h2>
                  <p className="text-sm text-white/50">
                    推荐工具、官网、价格等信息
                  </p>
                </div>
                <button
                  className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40"
                  onClick={resetToolForm}
                >
                  新建
                </button>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
                <div className="space-y-4">
                  {tools.map((tool) => (
                    <div
                      key={tool.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                            {tool.tag}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold">
                            {tool.name}
                          </h3>
                          <p className="mt-1 text-xs text-white/50">
                            {tool.category || "未分类"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <button
                            className={`rounded-full border border-white/20 px-3 py-1 text-white/70 transition hover:border-white/40 ${usingMock.tools ? "cursor-not-allowed opacity-50" : ""}`}
                            disabled={usingMock.tools}
                            onClick={() => {
                              if (usingMock.tools) return;
                              setEditingToolId(tool.id);
                              setToolForm({
                                name: tool.name,
                                tag: tool.tag,
                                category: tool.category ?? "",
                                description: tool.description ?? "",
                                price: tool.price ?? "",
                                url: tool.url ?? "",
                                affiliate_link: tool.affiliate_link ?? "",
                                logo_url: tool.logo_url ?? "",
                                image_url: tool.image_url ?? "",
                                gallery: tool.gallery ?? [],
                                is_featured: tool.is_featured,
                              });
                            }}
                          >
                            编辑
                          </button>
                          <button
                            className={`rounded-full border border-red-400/40 px-3 py-1 text-red-100/80 transition hover:border-red-300 ${usingMock.tools ? "cursor-not-allowed opacity-50" : ""}`}
                            disabled={usingMock.tools}
                            onClick={() =>
                              usingMock.tools
                                ? undefined
                                : handleDelete(`/api/tools/${tool.id}`, tool.name)
                            }
                          >
                            删除
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-white/60">
                        {tool.description || "暂无描述"}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                    {editingToolId ? "编辑 Tool" : "新增 Tool"}
                  </p>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="name *"
                    value={toolForm.name}
                    onChange={(event) =>
                      setToolForm((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="tag *"
                    value={toolForm.tag}
                    onChange={(event) =>
                      setToolForm((prev) => ({
                        ...prev,
                        tag: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="category"
                    value={toolForm.category}
                    onChange={(event) =>
                      setToolForm((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="price"
                    value={toolForm.price}
                    onChange={(event) =>
                      setToolForm((prev) => ({
                        ...prev,
                        price: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="url"
                    value={toolForm.url}
                    onChange={(event) =>
                      setToolForm((prev) => ({
                        ...prev,
                        url: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="affiliate_link"
                    value={toolForm.affiliate_link}
                    onChange={(event) =>
                      setToolForm((prev) => ({
                        ...prev,
                        affiliate_link: event.target.value,
                      }))
                    }
                  />
                  <div className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                    <ImageUpload
                      label="Logo"
                      value={toolForm.logo_url}
                      onChange={(url) =>
                        setToolForm((prev) => ({
                          ...prev,
                          logo_url: url,
                        }))
                      }
                    />
                    <ImageUpload
                      label="Cover Image"
                      value={toolForm.image_url}
                      onChange={(url) =>
                        setToolForm((prev) => ({
                          ...prev,
                          image_url: url,
                        }))
                      }
                    />
                    <ImageGalleryUpload
                      label="Gallery"
                      value={toolForm.gallery}
                      onChange={(urls) =>
                        setToolForm((prev) => ({
                          ...prev,
                          gallery: urls,
                        }))
                      }
                    />
                  </div>
                  <textarea
                    className="min-h-[88px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="description"
                    value={toolForm.description}
                    onChange={(event) =>
                      setToolForm((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                  />
                  <label className="flex items-center gap-2 text-xs text-white/60">
                    <input
                      type="checkbox"
                      checked={toolForm.is_featured}
                      onChange={(event) =>
                        setToolForm((prev) => ({
                          ...prev,
                          is_featured: event.target.checked,
                        }))
                      }
                    />
                    推荐
                  </label>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#0b1110] transition hover:bg-white"
                      onClick={handleSaveTool}
                    >
                      保存
                    </button>
                    <button
                      className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60"
                      onClick={resetToolForm}
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#12131f]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Prompts</h2>
                  <p className="text-sm text-white/50">
                    提示词内容与平台适配
                  </p>
                </div>
                <button
                  className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40"
                  onClick={resetPromptForm}
                >
                  新建
                </button>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
                <div className="space-y-4">
                  {prompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                            {prompt.category}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold">
                            {prompt.title}
                          </h3>
                          <p className="mt-2 text-xs text-white/50">
                            {prompt.platforms?.join(" / ") || "无平台信息"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <button
                            className={`rounded-full border border-white/20 px-3 py-1 text-white/70 transition hover:border-white/40 ${usingMock.prompts ? "cursor-not-allowed opacity-50" : ""}`}
                            disabled={usingMock.prompts}
                            onClick={() => {
                              if (usingMock.prompts) return;
                              setEditingPromptId(prompt.id);
                              setPromptForm({
                                title: prompt.title,
                                category: prompt.category,
                                platforms: prompt.platforms.join(", "),
                                preview: prompt.preview ?? "",
                                prompt: prompt.prompt ?? "",
                                cover_image: prompt.cover_image ?? "",
                              });
                            }}
                          >
                            编辑
                          </button>
                          <button
                            className={`rounded-full border border-red-400/40 px-3 py-1 text-red-100/80 transition hover:border-red-300 ${usingMock.prompts ? "cursor-not-allowed opacity-50" : ""}`}
                            disabled={usingMock.prompts}
                            onClick={() =>
                              usingMock.prompts
                                ? undefined
                                : handleDelete(
                                    `/api/prompts/${prompt.id}`,
                                    prompt.title,
                                  )
                            }
                          >
                            删除
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-white/60 line-clamp-2">
                        {prompt.preview || prompt.prompt}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                    {editingPromptId ? "编辑 Prompt" : "新增 Prompt"}
                  </p>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="title *"
                    value={promptForm.title}
                    onChange={(event) =>
                      setPromptForm((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="category *"
                    value={promptForm.category}
                    onChange={(event) =>
                      setPromptForm((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="platforms (用逗号分隔) *"
                    value={promptForm.platforms}
                    onChange={(event) =>
                      setPromptForm((prev) => ({
                        ...prev,
                        platforms: event.target.value,
                      }))
                    }
                  />
                  <textarea
                    className="min-h-[88px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="preview"
                    value={promptForm.preview}
                    onChange={(event) =>
                      setPromptForm((prev) => ({
                        ...prev,
                        preview: event.target.value,
                      }))
                    }
                  />
                  <ImageUpload
                    label="Cover Image"
                    value={promptForm.cover_image}
                    onChange={(url) =>
                      setPromptForm((prev) => ({
                        ...prev,
                        cover_image: url,
                      }))
                    }
                  />
                  <textarea
                    className="min-h-[120px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="prompt *"
                    value={promptForm.prompt}
                    onChange={(event) =>
                      setPromptForm((prev) => ({
                        ...prev,
                        prompt: event.target.value,
                      }))
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      className="flex-1 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#0b1110] transition hover:bg-white"
                      onClick={handleSavePrompt}
                    >
                      保存
                    </button>
                    <button
                      className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60"
                      onClick={resetPromptForm}
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#17131b]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Posts</h2>
                  <p className="text-sm text-white/50">
                    文章内容与发布时间
                  </p>
                </div>
                <button
                  className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40"
                  onClick={resetPostForm}
                >
                  新建
                </button>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                            {post.tag || "未设置标签"}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold">
                            {post.title}
                          </h3>
                          <p className="mt-2 text-xs text-white/50">
                            {post.read_time || "阅读时间未设置"} ·{" "}
                            {toDateInputValue(post.published_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <button
                            className={`rounded-full border border-white/20 px-3 py-1 text-white/70 transition hover:border-white/40 ${usingMock.posts ? "cursor-not-allowed opacity-50" : ""}`}
                            disabled={usingMock.posts}
                            onClick={() => {
                              if (usingMock.posts) return;
                              setEditingPostId(post.id);
                              setPostForm({
                                title: post.title,
                                excerpt: post.excerpt ?? "",
                                tag: post.tag ?? "",
                                read_time: post.read_time ?? "",
                                published_at: toDateInputValue(
                                  post.published_at,
                                ),
                                content: post.content ?? "",
                                cover_image: post.cover_image ?? "",
                                gallery: post.gallery ?? [],
                              });
                            }}
                          >
                            编辑
                          </button>
                          <button
                            className={`rounded-full border border-red-400/40 px-3 py-1 text-red-100/80 transition hover:border-red-300 ${usingMock.posts ? "cursor-not-allowed opacity-50" : ""}`}
                            disabled={usingMock.posts}
                            onClick={() =>
                              usingMock.posts
                                ? undefined
                                : handleDelete(`/api/posts/${post.id}`, post.title)
                            }
                          >
                            删除
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-white/60 line-clamp-2">
                        {post.excerpt || "暂无摘要"}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                    {editingPostId ? "编辑 Post" : "新增 Post"}
                  </p>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="title *"
                    value={postForm.title}
                    onChange={(event) =>
                      setPostForm((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="tag"
                    value={postForm.tag}
                    onChange={(event) =>
                      setPostForm((prev) => ({
                        ...prev,
                        tag: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="read_time"
                    value={postForm.read_time}
                    onChange={(event) =>
                      setPostForm((prev) => ({
                        ...prev,
                        read_time: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    type="date"
                    value={postForm.published_at}
                    onChange={(event) =>
                      setPostForm((prev) => ({
                        ...prev,
                        published_at: event.target.value,
                      }))
                    }
                  />
                  <ImageUpload
                    label="Cover Image"
                    value={postForm.cover_image}
                    onChange={(url) =>
                      setPostForm((prev) => ({
                        ...prev,
                        cover_image: url,
                      }))
                    }
                  />
                  <ImageGalleryUpload
                    label="Gallery"
                    value={postForm.gallery}
                    onChange={(urls) =>
                      setPostForm((prev) => ({
                        ...prev,
                        gallery: urls,
                      }))
                    }
                  />
                  <textarea
                    className="min-h-[88px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="excerpt"
                    value={postForm.excerpt}
                    onChange={(event) =>
                      setPostForm((prev) => ({
                        ...prev,
                        excerpt: event.target.value,
                      }))
                    }
                  />
                  <textarea
                    className="min-h-[120px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    placeholder="content"
                    value={postForm.content}
                    onChange={(event) =>
                      setPostForm((prev) => ({
                        ...prev,
                        content: event.target.value,
                      }))
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      className="flex-1 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#0b1110] transition hover:bg-white"
                      onClick={handleSavePost}
                    >
                      保存
                    </button>
                    <button
                      className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60"
                      onClick={resetPostForm}
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
