import { supabase } from "@/lib/supabase";
import { DUMMY_LEARNING_NOTES } from "@/lib/mock-data";
import LearningNotesEditor from "./_components/learning-notes-editor";

export const dynamic = "force-dynamic";

/**
 * 获取学习笔记列表
 * 使用 fallback 模式：API → Supabase → Mock 数据
 */
async function getLearningNotes() {
  try {
    // 尝试从后端 API 获取
    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"}/api/learning-notes`,
      { cache: "no-store" }
    );

    if (apiRes.ok) {
      const data = await apiRes.json();
      return data.learning_notes || [];
    }
  } catch (apiError) {
    console.warn("API 请求失败，尝试直接查询 Supabase", apiError);
  }

  try {
    // Fallback: 直接查询 Supabase
    const { data, error } = await supabase
      .from("learning_notes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;
    if (data?.length) {
      return data.map((row: any) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        category: row.category || "未分类",
        summary: row.summary || "",
        tags: Array.isArray(row.tags) ? row.tags : [],
        coverImage: row.cover_image || null,
        content: row.content || "",
        orderIndex: row.order_index || null,
        updatedAt: row.updated_at || null,
        createdAt: row.created_at || null,
      }));
    }
  } catch (supabaseError) {
    console.warn("Supabase 查询失败，使用虚拟数据", supabaseError);
  }

  // Final fallback: 使用虚拟数据
  return DUMMY_LEARNING_NOTES.map((note) => ({
    ...note,
    content: note.content || "",
  }));
}

export default async function LearningEditPage() {
  const notes = await getLearningNotes();

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-[#a1a1aa]"
      style={
        {
          "--accent": "#d4ff00",
          "--accent-glow": "rgba(212,255,0,0.35)",
          "--accent-contrast": "#0a0a0a",
        } as React.CSSProperties
      }
    >
      <div className="relative overflow-hidden">
        {/* 背景渐变效果 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,255,0,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,10,10,0.2),rgba(0,0,0,0.7))]" />

        <main className="relative min-h-screen">
          <LearningNotesEditor initialNotes={notes} />
        </main>
      </div>
    </div>
  );
}
