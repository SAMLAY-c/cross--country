import { ExternalLink } from "lucide-react";
import clsx from "clsx";

const priceBadgeStyles: Record<string, string> = {
  "免费试用": "bg-[#d4ff00]/90 text-black",
  "免费增值": "bg-[#d4ff00]/90 text-black",
  "付费": "bg-white/80 text-slate-900",
};

export default function ToolCard({
  name,
  tag,
  description,
  price,
  url,
  imageUrl,
  gallery,
}: {
  name: string;
  tag: string;
  description: string;
  price: string;
  url?: string | null;
  imageUrl?: string | null;
  gallery?: string[] | null;
}) {
  return (
    <article className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-[10px] transition duration-300 hover:-translate-y-1 hover:bg-white/[0.06]">
      {imageUrl ? (
        <div className="mb-6 overflow-hidden rounded-xl border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={name}
            className="h-40 w-full object-cover"
          />
        </div>
      ) : null}
      <div className="flex items-start gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/[0.03] shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
          <span className="text-xl font-semibold text-white/70">
            {name.slice(0, 1)}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <span className="inline-flex items-center rounded-md bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
            {tag}
          </span>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm text-white/60 leading-relaxed">
        {description}
      </p>
      {gallery?.length ? (
        <div className="mt-4 flex gap-2">
          {gallery.slice(0, 4).map((item) => (
            <div
              key={item}
              className="h-12 w-12 overflow-hidden rounded-lg border border-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item} alt={name} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}
      <div className="mt-6 flex items-center justify-between">
        <span
          className={clsx(
            "rounded-md px-3 py-1 text-xs font-semibold",
            priceBadgeStyles[price] || priceBadgeStyles["付费"]
          )}
        >
          {price}
        </span>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)] transition hover:brightness-110 hover:shadow-[0_12px_30px_var(--accent-glow)]"
          >
            访问网站 -&gt;
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white/60">
            暂无链接
          </span>
        )}
      </div>
    </article>
  );
}
