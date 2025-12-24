"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

export type Post = {
  id: number;
  title: string;
  excerpt: string;
  tag: string;
  readTime: string;
  publishedAt: string;
  sourceUrl?: string | null;
  coverImage?: string | null;
  gallery?: string[] | null;
};

type PostsContextValue = {
  posts: Post[];
};

const PostsContext = createContext<PostsContextValue | null>(null);

function formatPublishedAt(value?: string | null): string {
  if (!value) {
    return "2025.12.23";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "2025.12.23";
  }

  return date
    .toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, ".");
}

function normalizePost(row: Record<string, unknown>): Post {
  const galleryValue = row.gallery;
  const gallery =
    Array.isArray(galleryValue) && galleryValue.length
      ? (galleryValue as string[])
      : null;

  return {
    id: Number(row.id),
    title: String(row.title ?? "未命名"),
    excerpt: String(row.excerpt ?? "暂无摘要。"),
    tag: String(row.tag ?? "深度测评"),
    readTime: String(row.read_time ?? "5 Min Read"),
    publishedAt: formatPublishedAt(row.published_at as string | null),
    sourceUrl: (row.source_url as string | null) ?? null,
    coverImage: (row.cover_image as string | null) ?? null,
    gallery,
  };
}

async function getPosts(): Promise<Post[] | null> {
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id,title,excerpt,tag,read_time,published_at,cover_image,gallery,source_url"
    )
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return null;
  }

  if (!data?.length) {
    return [];
  }

  return data.map((row) => normalizePost(row as Record<string, unknown>));
}

export function RealtimePostsProvider({
  initialPosts,
  children,
}: {
  initialPosts: Post[];
  children: React.ReactNode;
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    let mounted = true;

    const refreshPosts = async () => {
      const latest = await getPosts();
      if (!mounted || latest === null) return;
      setPosts(latest);
    };

    void refreshPosts();

    // 尝试订阅 Realtime，如果失败则静默降级（不显示错误）
    const channelName = "public:posts";
    const channels = supabase
      .channel(channelName, {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
        },
        async (payload) => {
          console.log("📬 New post received:", payload);
          await refreshPosts();
        }
      )
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to posts realtime updates");
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          // 静默处理 Realtime 订阅失败 - 页面仍然可以正常工作，只是没有实时更新
          console.warn("⚠️ Realtime subscription unavailable (this is okay - page will still work)");
          if (err) {
            console.debug("Realtime error details:", err.message);
          }
        }
      });

    setChannel(channels);

    return () => {
      mounted = false;
      if (channels) {
        void supabase.removeChannel(channels);
      }
    };
  }, []);

  const value = useMemo(() => ({ posts }), [posts]);

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function useRealtimePosts(): PostsContextValue {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("useRealtimePosts must be used within RealtimePostsProvider");
  }
  return context;
}
