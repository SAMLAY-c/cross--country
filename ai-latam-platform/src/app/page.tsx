import Script from "next/script";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f6f2ea] text-[#1a1a1a]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffe9c7,_transparent_60%),radial-gradient(circle_at_30%_70%,_#d5f3ff,_transparent_55%)]" />
        <div className="absolute left-[-20%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[#ffb703]/30 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[380px] w-[380px] rounded-full bg-[#219ebc]/30 blur-[120px]" />
        <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-start gap-16 px-6 py-20 sm:px-10 lg:px-16">
          <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9b5de5]">
                AI Latam Platform
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl [font-family:var(--font-display)]">
                Las mejores herramientas de IA en espanol, sin perder tiempo.
              </h1>
              <p className="text-lg text-[#4a4a4a] sm:text-xl">
                Descubre recursos, cursos y playbooks para crear negocios digitales
                en Latinoamerica. Curado, claro y listo para monetizar.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
                <span className="rounded-full border border-[#1a1a1a]/20 bg-white/70 px-4 py-2">
                  Directorio con links afiliados
                </span>
                <span className="rounded-full border border-[#1a1a1a]/20 bg-white/70 px-4 py-2">
                  Recursos descargables
                </span>
                <span className="rounded-full border border-[#1a1a1a]/20 bg-white/70 px-4 py-2">
                  Cursos y guias
                </span>
              </div>
            </div>
            <div className="w-full max-w-lg rounded-3xl border border-[#1a1a1a]/10 bg-white/80 p-6 shadow-[0_30px_60px_rgba(26,26,26,0.15)] backdrop-blur">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#219ebc]">
                  Recibe la guia gratis
                </p>
                <h2 className="text-2xl font-semibold [font-family:var(--font-display)]">
                  Suscribete y descarga el playbook de IA para Latam.
                </h2>
                <div className="rounded-2xl border border-dashed border-[#1a1a1a]/15 bg-[#fdf7ee] p-4">
                  <iframe
                    data-tally-src="https://tally.so/embed/ODlo4a?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                    width="100%"
                    height="200"
                    frameBorder="0"
                    title="Suscribirse"
                  />
                </div>
                <p className="text-xs text-[#5f5f5f]">
                  Al enviar el formulario, recibes acceso inmediato al PDF.
                </p>
              </div>
            </div>
          </div>
          <section className="grid w-full gap-6 md:grid-cols-3">
            {[
              {
                title: "Explora herramientas",
                text: "Directorio vivo con filtros rapidos y enlaces de afiliado listos.",
              },
              {
                title: "Aprende a vender",
                text: "Casos de uso y guias para cerrar ventas en mercados Latam.",
              },
              {
                title: "Automatiza ya",
                text: "Plantillas y prompts accionables para equipos y freelancers.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#1a1a1a]/10 bg-white/70 p-6 shadow-[0_15px_30px_rgba(26,26,26,0.08)]"
              >
                <h3 className="text-xl font-semibold [font-family:var(--font-display)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-[#4a4a4a]">{item.text}</p>
              </div>
            ))}
          </section>
        </main>
      </div>
      <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
    </div>
  );
}
