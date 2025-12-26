"use client";

import { useEffect, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import PromptGrid, { type PromptItem } from "./prompt-grid";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

async function getPrompts(): Promise<PromptItem[]> {
  try {
    const response = await fetch(`${API_BASE}/api/prompts`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch prompts");
    }
    const data = (await response.json()) as { prompts?: PromptItem[] };
    if (!data.prompts?.length) {
      return [];
    }
    return data.prompts.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      platforms: Array.isArray(row.platforms) ? row.platforms : [],
      preview: row.preview || row.prompt?.slice(0, 120) || "",
      prompt: row.prompt,
      coverImage: (row as { cover_image?: string | null }).cover_image ?? null,
    }));
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return [];
  }
}

export default function RealtimePromptsGrid({
  initialPrompts,
}: {
  initialPrompts: PromptItem[];
}) {
  const [prompts, setPrompts] = useState<PromptItem[]>(initialPrompts);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    let mounted = true;

    const channelName = "public:prompts";
    const channels = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "prompts",
        },
        async () => {
          try {
            const updatedPrompts = await getPrompts();
            if (mounted) {
              setPrompts(updatedPrompts);
            }
          } catch (error) {
            console.error("Error refetching prompts:", error);
          }
        }
      )
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to prompts realtime updates");
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn(
            "⚠️ Realtime subscription unavailable (this is okay - page will still work)"
          );
          if (err) {
            console.debug("Realtime error details:", err.message);
          }
        }
      });

    setChannel(channels);

    return () => {
      mounted = false;
      if (channels) {
        supabase.removeChannel(channels);
      }
    };
  }, []);

  return <PromptGrid prompts={prompts} />;
}
