"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type LearningNote = {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  tags: string[];
  coverImage?: string | null;
  updatedAt: string | null;
};

type LearningNotesContextValue = {
  notes: LearningNote[];
};

const LearningNotesContext = createContext<LearningNotesContextValue | null>(
  null
);

function normalizeNote(row: Record<string, unknown>): LearningNote {
  return {
    id: Number(row.id),
    title: String(row.title ?? "未命名"),
    slug: String(row.slug ?? ""),
    category: String(row.category ?? "未分类"),
    summary: String(row.summary ?? "暂无摘要。"),
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    coverImage: (row.cover_image as string | null) ?? null,
    updatedAt: (row.updated_at as string | null) ?? null,
  };
}

async function getLearningNotes(): Promise<LearningNote[] | null> {
  const { data, error } = await supabase
    .from("learning_notes")
    .select("id,title,slug,category,summary,tags,cover_image,updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching learning notes:", error);
    return null;
  }

  if (!data?.length) {
    return [];
  }

  return data.map((row) => normalizeNote(row as Record<string, unknown>));
}

export function RealtimeLearningNotesProvider({
  initialNotes,
  fallbackNotes,
  children,
}: {
  initialNotes: LearningNote[];
  fallbackNotes: LearningNote[];
  children: React.ReactNode;
}) {
  const [notes, setNotes] = useState<LearningNote[]>(
    initialNotes.length ? initialNotes : fallbackNotes
  );
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    let mounted = true;

    const refreshNotes = async () => {
      const latest = await getLearningNotes();
      if (!mounted || latest === null) return;
      setNotes(latest.length ? latest : fallbackNotes);
    };

    void refreshNotes();

    const channelName = "public:learning_notes";
    const channels = supabase
      .channel(channelName, {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "learning_notes",
        },
        async () => {
          await refreshNotes();
        }
      )
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to learning_notes realtime updates");
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
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
  }, [fallbackNotes]);

  const value = useMemo(() => ({ notes }), [notes]);

  return (
    <LearningNotesContext.Provider value={value}>
      {children}
    </LearningNotesContext.Provider>
  );
}

export function useRealtimeLearningNotes(): LearningNotesContextValue {
  const context = useContext(LearningNotesContext);
  if (!context) {
    throw new Error(
      "useRealtimeLearningNotes must be used within RealtimeLearningNotesProvider"
    );
  }
  return context;
}
