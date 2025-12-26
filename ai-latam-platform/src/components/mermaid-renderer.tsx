"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type MermaidRendererProps = {
  chart: string;
  className?: string;
};

type MermaidModule = {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, chart: string) => Promise<{ svg: string }>;
};

declare global {
  interface Window {
    mermaid?: MermaidModule;
  }
}

let mermaidLoader: Promise<MermaidModule> | null = null;

function loadMermaid(): Promise<MermaidModule> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Mermaid requires the browser"));
  }
  if (window.mermaid) {
    return Promise.resolve(window.mermaid);
  }
  if (!mermaidLoader) {
    mermaidLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
      script.async = true;
      script.onload = () => {
        if (window.mermaid) {
          resolve(window.mermaid);
        } else {
          reject(new Error("Mermaid failed to load"));
        }
      };
      script.onerror = () => reject(new Error("Mermaid script error"));
      document.head.appendChild(script);
    });
  }
  return mermaidLoader;
}

export default function MermaidRenderer({ chart, className }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const chartId = useMemo(
    () => `mermaid-${Math.random().toString(36).slice(2)}`,
    []
  );

  useEffect(() => {
    let active = true;
    setFailed(false);

    loadMermaid()
      .then((mermaid) => {
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#121826",
            primaryTextColor: "#e2e8f0",
            primaryBorderColor: "rgba(255,255,255,0.2)",
            lineColor: "rgba(255,255,255,0.5)",
            secondaryColor: "#0b0f1e",
            tertiaryColor: "#0f172a",
          },
        });
        return mermaid.render(chartId, chart);
      })
      .then((result) => {
        if (!active || !containerRef.current) return;
        containerRef.current.innerHTML = result.svg;
      })
      .catch(() => {
        if (active) {
          setFailed(true);
        }
      });

    return () => {
      active = false;
    };
  }, [chart, chartId]);

  if (failed) {
    return (
      <pre
        className={`whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-white/70 ${
          className ?? ""
        }`}
      >
        {chart}
      </pre>
    );
  }

  return <div ref={containerRef} className={className} />;
}
