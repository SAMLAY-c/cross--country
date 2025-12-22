import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function ToolsDirectory() {
  const { data: tools } = await supabase
    .from("tools")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#f9f7f2] px-6 py-16 text-[#1a1a1a] sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#ff7a00]">
            Directorio IA
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl [font-family:var(--font-display)]">
            Directorio de Herramientas IA
          </h1>
          <p className="text-base text-[#5a5a5a] sm:text-lg">
            Encuentra herramientas listas para usar, con enlaces oficiales y de
            afiliado.
          </p>
        </header>

        {!tools?.length ? (
          <div className="rounded-2xl border border-dashed border-[#1a1a1a]/20 bg-white/60 p-10 text-center text-sm text-[#6a6a6a]">
            Aun no hay herramientas publicadas. Agrega la primera en Supabase.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6 shadow-[0_18px_35px_rgba(26,26,26,0.08)]"
              >
                <div className="mb-4 flex items-center gap-4">
                  {tool.image_url ? (
                    <img
                      src={tool.image_url}
                      alt={tool.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2efe8] text-xs font-semibold text-[#8a8a8a]">
                      IA
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">{tool.name}</h2>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#9b5de5]">
                      {tool.category || "AI Tool"}
                    </p>
                  </div>
                </div>
                <p className="mb-6 text-sm text-[#5a5a5a]">
                  {tool.description_es || "Descripcion pendiente."}
                </p>
                <a
                  href={tool.affiliate_link || tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full rounded-full bg-[#1a1a1a] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#303030]"
                >
                  Visitar Web
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
