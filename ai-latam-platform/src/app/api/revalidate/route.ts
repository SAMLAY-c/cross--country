import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const ALLOWED_PATHS = new Set([
  "/tools",
  "/prompts",
  "/blog",
  "/learning",
  "/papers",
]);

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { path?: string }
    | null;
  const path = typeof body?.path === "string" ? body.path : "";

  if (!ALLOWED_PATHS.has(path)) {
    return NextResponse.json(
      { ok: false, error: "Invalid path" },
      { status: 400 },
    );
  }

  revalidatePath(path);

  return NextResponse.json({
    ok: true,
    path,
    revalidatedAt: new Date().toISOString(),
  });
}
