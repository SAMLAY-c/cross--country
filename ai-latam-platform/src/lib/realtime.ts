"use client";

import { useEffect, useState } from "react";
import { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export interface RealtimeSubscriptionOptions {
  table: string;
  filter?: string;
  onError?: (error: Error) => void;
}

/**
 * 订阅 Supabase Realtime 更新的 Hook
 * 当数据库中的数据发生变化时，自动重新获取数据
 */
export function useRealtimeSubscription<T>(
  options: RealtimeSubscriptionOptions,
  fetchData: () => Promise<T[]>
) {
  const [data, setData] = useState<T[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    let mounted = true;
    let currentChannel: RealtimeChannel | null = null;

    // 初始数据加载
    const loadData = async () => {
      try {
        const result = await fetchData();
        if (mounted) {
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (options.onError) {
          options.onError(error as Error);
        }
      }
    };

    loadData();

    // 设置 Realtime 订阅
    const channelName = `public:${options.table}`;
    currentChannel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*", // 监听所有事件：INSERT, UPDATE, DELETE
          schema: "public",
          table: options.table,
          filter: options.filter,
        },
        async (payload) => {
          console.log(`Realtime update received for ${options.table}:`, payload);
          // 当数据变化时，重新获取所有数据
          const result = await fetchData();
          if (mounted) {
            setData(result);
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`Successfully subscribed to ${options.table} realtime updates`);
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error(`Failed to subscribe to ${options.table} realtime updates`);
          if (options.onError) {
            options.onError(new Error(`Subscription failed for ${options.table}`));
          }
        }
      });

    setChannel(currentChannel);

    // 清理函数
    return () => {
      mounted = false;
      if (currentChannel) {
        supabase.removeChannel(currentChannel);
      }
    };
  }, [options.table, options.filter]);

  return { data, channel };
}

/**
 * 手动订阅 Realtime 更新的工具函数
 * 用于在非 React 环境中使用
 */
export function subscribeToRealtime(
  supabaseClient: SupabaseClient,
  options: RealtimeSubscriptionOptions,
  onDataChange: () => void
): RealtimeChannel {
  const channelName = `public:${options.table}`;

  const channel = supabaseClient
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: options.table,
        filter: options.filter,
      },
      (payload) => {
        console.log(`Realtime update received for ${options.table}:`, payload);
        onDataChange();
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log(`Successfully subscribed to ${options.table} realtime updates`);
      }
    });

  return channel;
}

/**
 * 取消 Realtime 订阅
 */
export function unsubscribeFromRealtime(
  supabaseClient: SupabaseClient,
  channel: RealtimeChannel
): void {
  supabaseClient.removeChannel(channel);
}
