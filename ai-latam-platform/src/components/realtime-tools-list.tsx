"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import ToolCard from "./tool-card";

type Tool = {
  id: number;
  name: string;
  tag: string;
  description: string;
  price: string;
  url?: string | null;
  logoUrl?: string | null;
  imageUrl?: string | null;
  gallery?: string[] | null;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

async function getTools(): Promise<Tool[]> {
  try {
    const response = await fetch(`${API_BASE}/api/tools`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch tools");
    }
    const data = (await response.json()) as { tools?: Tool[] };
    if (!data.tools?.length) {
      return [];
    }
    return data.tools.map((row) => ({
      id: row.id,
      name: row.name,
      tag: row.tag || (row as { category?: string | null }).category || "工具",
      description: row.description || "暂无描述。",
      price: row.price || "付费",
      url: (row as { url?: string | null }).url ?? null,
      logoUrl: (row as { logo_url?: string | null }).logo_url ?? null,
      imageUrl: (row as { image_url?: string | null }).image_url ?? null,
      gallery: (row as { gallery?: string[] | null }).gallery ?? null,
    }));
  } catch (error) {
    console.error("Error fetching tools:", error);
    return [];
  }
}

export default function RealtimeToolsList({
  initialTools,
}: {
  initialTools: Tool[];
}) {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    let mounted = true;

    // 订阅 Supabase Realtime
    const channelName = "public:tools";
    const channels = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*", // 监听所有事件：INSERT, UPDATE, DELETE
          schema: "public",
          table: "tools",
        },
        async (payload) => {
          console.log("Realtime update received:", payload);

          // 当数据变化时，重新获取所有数据
          try {
            const updatedTools = await getTools();
            if (mounted) {
              setTools(updatedTools);
            }
          } catch (error) {
            console.error("Error refetching tools:", error);
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to tools realtime updates");
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("❌ Failed to subscribe to tools realtime updates");
        }
      });

    setChannel(channels);

    // 清理函数
    return () => {
      mounted = false;
      if (channels) {
        supabase.removeChannel(channels);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard key={tool.id} {...tool} />
      ))}
    </div>
  );
}
