export default function PapersLoading() {
  return (
    <div
      className="min-h-screen bg-[#07080f] text-[#cbd5f5] [font-family:var(--font-eco)]"
      style={{
        ["--accent" as unknown as string]: "#ffb347",
        ["--accent-glow" as unknown as string]: "rgba(255,179,71,0.35)",
        ["--accent-contrast" as unknown as string]: "#07080f",
      }}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,179,71,0.12),transparent_55%),radial-gradient(circle_at_85%_0%,rgba(76,180,255,0.12),transparent_55%),radial-gradient(circle_at_60%_80%,rgba(48,255,209,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,8,15,0.2),rgba(5,7,18,0.9))]" />
        <div className="absolute inset-0 opacity-30 bg-[url('/eco-hero.svg')] bg-cover bg-center grayscale" />
        <main className="relative w-full flex min-h-screen flex-col gap-16 px-8 pb-20 pt-10 sm:px-12 lg:px-20">
          <div className="h-10 w-40 rounded-full bg-white/5 skeleton-shimmer" />

          <section className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="h-3 w-24 rounded-full bg-white/10 skeleton-shimmer" />
              <div className="space-y-3">
                <div className="h-10 w-72 rounded-xl bg-white/10 skeleton-shimmer" />
                <div className="h-10 w-56 rounded-xl bg-white/10 skeleton-shimmer" />
              </div>
              <div className="h-4 w-full max-w-md rounded-full bg-white/10 skeleton-shimmer" />
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`tag-${index}`}
                    className="h-6 w-16 rounded-full bg-white/5 skeleton-shimmer"
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={`stat-${index}`}
                    className="h-20 rounded-2xl border border-white/10 bg-white/5 skeleton-shimmer"
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur">
                <div className="space-y-4">
                  <div className="h-3 w-32 rounded-full bg-white/10 skeleton-shimmer" />
                  <div className="h-8 w-3/4 rounded-xl bg-white/10 skeleton-shimmer" />
                  <div className="h-4 w-40 rounded-full bg-white/10 skeleton-shimmer" />
                  <div className="h-4 w-56 rounded-full bg-white/10 skeleton-shimmer" />
                  <div className="h-24 w-full rounded-2xl bg-white/5 skeleton-shimmer" />
                  <div className="h-36 w-full rounded-2xl bg-white/5 skeleton-shimmer" />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="h-12 w-full rounded-2xl bg-white/5 skeleton-shimmer" />
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-3">
                <div className="h-3 w-32 rounded-full bg-white/10 skeleton-shimmer" />
                <div className="h-8 w-44 rounded-xl bg-white/10 skeleton-shimmer" />
              </div>
              <div className="h-8 w-28 rounded-full bg-white/10 skeleton-shimmer" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`card-${index}`}
                  className="h-72 rounded-2xl border border-white/10 bg-white/[0.03] skeleton-shimmer"
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
