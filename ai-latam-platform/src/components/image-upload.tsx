"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ImageUploadProps = {
  label: string;
  value?: string | null;
  onChange: (url: string) => void;
};

export default function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value ?? null);

  useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${
        fileExt ? `.${fileExt}` : ""
      }`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("uploads").getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      setPreview(publicUrl);
      onChange(publicUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "上传失败";
      alert(`上传失败: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-[0.3em] text-white/45">
        {label}
      </label>
      <div className="flex items-start gap-4">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-[#333333] bg-white/[0.03]">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={`${label} preview`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-white/30">无图片</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <label
            className={`inline-flex cursor-pointer items-center rounded-md border border-[#333333] bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 transition hover:border-white/30 ${
              uploading ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            {uploading ? "上传中..." : "选择图片"}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              disabled={uploading}
              onChange={handleUpload}
            />
          </label>
          <p className="text-xs text-white/40">支持 JPG/PNG/WEBP</p>
        </div>
      </div>
    </div>
  );
}
