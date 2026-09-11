import Link from "next/link";
import type { ToolMeta } from "@/lib/categories";

const icons: Record<string, React.ReactNode> = {
  compress: (
    <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
  ),
  convert: (
    <path d="M7 7h10l-3-3M17 17H7l3 3M4 12h16" strokeLinecap="round" strokeLinejoin="round" />
  ),
  resize: (
    <path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  crop: (
    <path d="M6 2v14a2 2 0 002 2h14M2 6h14a2 2 0 012 2v14" strokeLinecap="round" strokeLinejoin="round" />
  ),
  rotate: (
    <path d="M21 12a9 9 0 11-3-6.7M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  join: (
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
  ),
  split: (
    <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" strokeLinejoin="round" />
  ),
  watermark: (
    <path d="M4 4h16v16H4zM8 16l3-4 2 2 3-5 4 7" strokeLinecap="round" strokeLinejoin="round" />
  ),
  shield: (
    <path d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3z" strokeLinejoin="round" />
  ),
  palette: (
    <path d="M12 3a9 9 0 000 18h1.5a2.5 2.5 0 000-5H12a2 2 0 010-4h3a6 6 0 000-12h-3z" strokeLinejoin="round" />
  ),
  base64: (
    <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" strokeLinecap="round" strokeLinejoin="round" />
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
    </>
  ),
  json: (
    <path d="M8 4c-2 0-3 1-3 3v2c0 2-1 3-3 3 2 0 3 1 3 3v2c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2c0 2 1 3 3 3-2 0-3 1-3 3v2c0 2-1 3-3 3" strokeLinecap="round" />
  ),
  escape: (
    <path d="M4 12h10M10 6l6 6-6 6M18 4v16" strokeLinecap="round" strokeLinejoin="round" />
  ),
  link: (
    <path d="M10 13a5 5 0 007.5.5l2-2a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7.5-.5l-2 2a5 5 0 007 7l1-1" strokeLinecap="round" />
  ),
  hash: (
    <path d="M5 9h14M5 15h14M10 3l-2 18M16 3l-2 18" strokeLinecap="round" />
  ),
  key: (
    <path d="M14 7a4 4 0 11-3 6.7L8 17l-3 1 1-3 3.3-3.3A4 4 0 0114 7z" strokeLinejoin="round" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </>
  ),
  text: (
    <path d="M4 7h16M4 12h10M4 17h14" strokeLinecap="round" />
  ),
  markdown: (
    <path d="M4 6h16v12H4zM7 15V9l2.5 3L12 9v6M15 12h3m0 0l-1.5-1.5M18 12l-1.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  diff: (
    <path d="M7 4v12M4 7h6M17 4v4c0 2-1 3-3 3h-1M13 17H7M17 17v-4" strokeLinecap="round" />
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" />
    </>
  ),
  dice: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
      <circle cx="15" cy="15" r="1" fill="currentColor" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />
    </>
  ),
  qr: (
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" strokeLinejoin="round" />
  ),
  note: (
    <path d="M6 3h9l5 5v13H6zM15 3v5h5M9 13h6M9 17h4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  volume: (
    <path d="M4 10v4h3l4 4V6L7 10H4zM16 9a4 4 0 010 6M18.5 7a7 7 0 010 10" strokeLinecap="round" strokeLinejoin="round" />
  ),
  wave: (
    <path d="M3 12h2l2-6 3 12 3-9 2 5 2-3h4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  audio: (
    <path d="M9 18V6l10-2v12M9 18a3 3 0 11-6 0 3 3 0 016 0zM19 16a3 3 0 11-6 0 3 3 0 016 0z" strokeLinejoin="round" />
  ),
  image: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M21 16l-5-5-4 4-2-2-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  code: (
    <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" strokeLinecap="round" strokeLinejoin="round" />
  ),
  spark: (
    <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3zM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15z" strokeLinejoin="round" />
  ),
  wrench: (
    <path d="M14.7 6.3a4 4 0 00-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 005.4-5.4L14.5 12l-2.5-2.5 2.7-3.2z" strokeLinejoin="round" />
  ),
  pdf: (
    <path d="M7 3h7l5 5v13H7zM14 3v5h5M10 14h4M10 17h4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="M16 10l5-3v10l-5-3" strokeLinejoin="round" />
    </>
  ),
};

export function ToolIcon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden
    >
      {icons[name] || icons.wrench}
    </svg>
  );
}

export default function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      href={`/tools/${tool.slug}/`}
      className="card card-hover block p-4"
      style={{ minHeight: 132 }}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          <ToolIcon name={tool.icon} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">{tool.name}</h3>
            {tool.status === "beta" && (
              <span className="badge" style={{ color: "var(--warning)", borderColor: "rgba(251,191,36,.35)" }}>
                Beta
              </span>
            )}
          </div>
          <p className="mt-1 text-sm leading-snug" style={{ color: "var(--text-muted)" }}>
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
