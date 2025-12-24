"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ImageGalleryUploadProps = {
  label: string;
  value?: string[];
  onChange: (urls: string[]) => void;
};

export default function ImageGalleryUpload({
  label,
  value,
  onChange,
}: ImageGalleryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState<string[]>(value ?? []);

  useEffect(() => {
    setItems(value ?? []);
  }, [value]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const files = Array.from(event.target.files ?? []);
      if (!files.length) return;

      const uploadedUrls: string[] = [];
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}${fileExt ? `.${fileExt}` : ""}`;

        const { error } = await supabase.storage
          .from("uploads")
          .upload(fileName, file);
        if (error) throw error;

        const { data } = supabase.storage.from("uploads").getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      }

      const next = [...items, ...uploadedUrls];
      setItems(next);
      onChange(next);
    } catch (error) {
      const message = error instanceof Error ? error.message : "上传失败";
      alert(`上传失败: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (url: string) => {
    const next = items.filter((item) => item !== url);
    setItems(next);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs uppercase tracking-[0.3em] text-white/45">
        {label}
      </label>
      <div className="flex flex-wrap gap-3">
        {items.length ? (
          items.map((url) => (
            <div
              key={url}
              className="relative h-20 w-20 overflow-hidden rounded-lg border border-white/10 bg-white/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="gallery" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] uppercase text-white/70"
              >
                删除
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 px-4 py-6 text-xs text-white/40">
            暂无图片
          </div>
        )}
      </div>
      <label
        className={`inline-flex cursor-pointer items-center rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 transition hover:border-white/30 ${
          uploading ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        {uploading ? "上传中..." : "上传多张"}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={handleUpload}
        />
      </label>
    </div>
  );
}
