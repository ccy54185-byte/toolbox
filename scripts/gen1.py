from pathlib import Path

ROOT = Path(r"C:\Users\16600\toolbox")

def w(rel: str, content: str):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content.lstrip("\n") if content.startswith("\n") else content, encoding="utf-8")
    print("wrote", rel, len(content))

# ---------- CSS (copy if missing later; ensure exists) ----------
css = r'''@import "tailwindcss";

:root {
  --bg: #0a0e14;
  --bg-elevated: #0f141c;
  --surface: #141b24;
  --surface-2: #1a2330;
  --border: #243041;
  --border-strong: #334155;
  --text: #e8eef7;
  --text-muted: #8b9aaf;
  --text-dim: #5c6b80;
  --accent: #00e5ff;
  --accent-dim: #00b8d4;
  --accent-soft: rgba(0, 229, 255, 0.12);
  --success: #34d399;
  --warning: #fbbf24;
  --error: #f87171;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, "SF Mono", "Cascadia Code", "Segoe UI Mono",
    Consolas, "Liberation Mono", Menlo, monospace;
}

* { box-sizing: border-box; }
html { color-scheme: dark; scroll-behavior: smooth; }
body {
  margin: 0; min-height: 100vh; background: var(--bg); color: var(--text);
  font-family: var(--font-sans); line-height: 1.6; -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
button, input, textarea, select { font: inherit; color: inherit; }
::selection { background: var(--accent-soft); color: var(--text); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 999px; border: 2px solid var(--bg); }

.container-app { width: min(1120px, calc(100% - 2rem)); margin-inline: auto; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
.card-hover { transition: border-color .15s ease, transform .15s ease, box-shadow .15s ease; }
.card-hover:hover { border-color: var(--accent-dim); transform: translateY(-1px); box-shadow: 0 0 0 1px rgba(0,229,255,.08), var(--shadow); }

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
  min-height: 44px; padding: .55rem 1.1rem; border-radius: var(--radius-sm);
  border: 1px solid transparent; cursor: pointer; font-weight: 560;
  transition: background .15s ease, border-color .15s ease, color .15s ease, opacity .15s ease;
  user-select: none;
}
.btn:disabled { opacity: .45; cursor: not-allowed; }
.btn-primary {
  background: linear-gradient(180deg, #00e5ff 0%, #00c4e0 100%);
  color: #04212a; border-color: rgba(0,229,255,.4);
  box-shadow: 0 0 20px rgba(0,229,255,.18);
}
.btn-primary:hover:not(:disabled) { filter: brightness(1.05); }
.btn-secondary { background: var(--surface-2); border-color: var(--border); color: var(--text); }
.btn-secondary:hover:not(:disabled) { border-color: var(--accent-dim); background: #1e2a3a; }
.btn-ghost { background: transparent; border-color: transparent; color: var(--text-muted); }
.btn-ghost:hover:not(:disabled) { color: var(--text); background: rgba(255,255,255,.04); }

.input, .textarea, .select {
  width: 100%; min-height: 44px; padding: .55rem .8rem; border-radius: var(--radius-sm);
  border: 1px solid var(--border); background: var(--bg-elevated); color: var(--text);
  transition: border-color .15s ease, box-shadow .15s ease;
}
.input:focus, .textarea:focus, .select:focus {
  border-color: var(--accent-dim); outline: none; box-shadow: 0 0 0 3px var(--accent-soft);
}
.textarea {
  min-height: 160px; resize: vertical; font-family: var(--font-mono); font-size: .9rem; line-height: 1.5;
}
.label { display: block; font-size: .85rem; color: var(--text-muted); margin-bottom: .4rem; }

.badge {
  display: inline-flex; align-items: center; gap: .35rem; padding: .15rem .55rem;
  border-radius: 999px; font-size: .75rem; font-weight: 600; border: 1px solid var(--border);
  color: var(--text-muted); background: rgba(255,255,255,.02);
}
.badge-accent { color: var(--accent); border-color: rgba(0,229,255,.35); background: var(--accent-soft); }

.privacy-banner {
  display: flex; align-items: flex-start; gap: .65rem; padding: .75rem .9rem;
  border-radius: var(--radius-sm); border: 1px solid rgba(0,229,255,.22);
  background: linear-gradient(135deg, rgba(0,229,255,.08), rgba(0,229,255,.02));
  color: var(--text-muted); font-size: .875rem;
}
.privacy-banner strong { color: var(--accent); font-weight: 600; }

.dropzone {
  border: 1.5px dashed var(--border-strong); border-radius: var(--radius);
  background: rgba(255,255,255,.015); transition: border-color .15s ease, background .15s ease;
  cursor: pointer;
}
.dropzone:hover, .dropzone:focus-visible, .dropzone.dragging {
  border-color: var(--accent); background: var(--accent-soft);
}

.prose-tool h2 { font-size: 1.15rem; font-weight: 650; margin: 1.75rem 0 .75rem; color: var(--text); }
.prose-tool p, .prose-tool li { color: var(--text-muted); }
.prose-tool ol, .prose-tool ul { margin: 0 0 .75rem; padding-left: 1.25rem; }
.prose-tool li { margin-bottom: .35rem; }

.mono { font-family: var(--font-mono); }

.ad-slot {
  display: flex; align-items: center; justify-content: center; min-height: 90px;
  border: 1px dashed var(--border); border-radius: var(--radius-sm);
  color: var(--text-dim); font-size: .75rem; letter-spacing: .04em; text-transform: uppercase;
  background: repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,.015) 8px, rgba(255,255,255,.015) 16px);
}

.range { width: 100%; accent-color: var(--accent); }

.grid-tools {
  display: grid; gap: .85rem;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important; animation-iteration-count: 1 !important;
    transition-duration: .01ms !important; scroll-behavior: auto !important;
  }
}
'''
w("src/app/globals.css", css)

# ---------- components ----------
w("src/components/AdSlot.tsx", '''"use client";

type Variant = "top" | "sidebar" | "bottom" | "content";

const labels: Record<Variant, string> = {
  top: "广告位 · Top Banner",
  sidebar: "广告位 · Sidebar",
  bottom: "广告位 · Bottom Banner",
  content: "广告位 · In Content",
};

/**
 * Ad placeholder. Replace internals with real AdSense later.
 * Must never cover tools or interfere with file drop zones.
 */
export default function AdSlot({
  variant = "content",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  return (
    <div
      className={`ad-slot ${className}`}
      data-ad-slot={variant}
      aria-hidden
      role="presentation"
    >
      {labels[variant]}
    </div>
  );
}
''')

w("src/components/PrivacyBanner.tsx", '''export default function PrivacyBanner({
  note,
}: {
  note?: string;
}) {
  return (
    <div className="privacy-banner" role="note">
      <span aria-hidden style={{ color: "var(--accent)", fontSize: "1rem", lineHeight: 1.2 }}>
        ⛨
      </span>
      <div>
        <strong>本地处理</strong>
        <div>{note || "文件仅在您的设备上处理，不会上传到服务器。"}</div>
      </div>
    </div>
  );
}
''')

w("src/components/CopyButton.tsx", '''"use client";

import { useState } from "react";
import { copyText } from "@/lib/utils";

export default function CopyButton({
  value,
  label = "复制",
  className = "btn btn-secondary",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={className}
      disabled={!value}
      onClick={async () => {
        const ok = await copyText(value);
        if (ok) {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        }
      }}
    >
      {done ? "已复制" : label}
    </button>
  );
}
''')

w("src/components/SiteHeader.tsx", '''import Link from "next/link";
import { SITE } from "@/lib/categories";

export default function SiteHeader() {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(10,14,20,.85)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        className="container-app"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 60, gap: 16 }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
          <span
            aria-hidden
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--accent-soft)",
              color: "var(--accent)",
              border: "1px solid rgba(0,229,255,.35)",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            T
          </span>
          <span>{SITE.name}</span>
          <span className="badge badge-accent" style={{ marginLeft: 4 }}>
            本地处理
          </span>
        </Link>
        <nav style={{ display: "flex", gap: 8, flexWrap: "wrap" }} aria-label="主导航">
          <Link className="btn btn-ghost" href="/tools/image/" style={{ minHeight: 36, padding: "0 .7rem" }}>图片</Link>
          <Link className="btn btn-ghost" href="/tools/developer/" style={{ minHeight: 36, padding: "0 .7rem" }}>开发者</Link>
          <Link className="btn btn-ghost" href="/tools/generator/" style={{ minHeight: 36, padding: "0 .7rem" }}>生成器</Link>
          <Link className="btn btn-ghost" href="/privacy/" style={{ minHeight: 36, padding: "0 .7rem" }}>隐私</Link>
        </nav>
      </div>
    </header>
  );
}
''')

w("src/components/SiteFooter.tsx", '''import Link from "next/link";
import { SITE } from "@/lib/categories";

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", marginTop: 64, padding: "2rem 0 2.5rem" }}>
      <div className="container-app" style={{ color: "var(--text-dim)", fontSize: ".875rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <strong style={{ color: "var(--text-muted)" }}>{SITE.name}</strong>
            <div>{SITE.tagline}</div>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/privacy/">隐私说明</Link>
            <Link href="/tools/image/">图片工具</Link>
            <Link href="/tools/developer/">开发者</Link>
            <Link href="/sitemap.xml">站点地图</Link>
          </div>
        </div>
        <div>© {new Date().getFullYear()} {SITE.name} · 免费使用 · 文件不上传</div>
      </div>
    </footer>
  );
}
''')

w("src/components/SearchBox.tsx", '''"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ToolMeta } from "@/lib/categories";

export default function SearchBox({ tools }: { tools: ToolMeta[] }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return [];
    return tools
      .filter(
        (t) =>
          t.name.toLowerCase().includes(key) ||
          t.slug.includes(key) ||
          t.description.toLowerCase().includes(key) ||
          t.keywords.some((k) => k.toLowerCase().includes(key))
      )
      .slice(0, 8);
  }, [q, tools]);

  return (
    <div style={{ position: "relative" }}>
      <label className="label" htmlFor="tool-search">搜索工具</label>
      <input
        id="tool-search"
        className="input"
        placeholder="搜索：压缩、JSON、密码、二维码…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
      />
      {results.length > 0 && (
        <div
          className="card"
          style={{
            position: "absolute",
            insetInline: 0,
            top: "100%",
            marginTop: 8,
            zIndex: 20,
            overflow: "hidden",
            boxShadow: "var(--shadow)",
          }}
        >
          {results.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}/`}
              style={{
                display: "block",
                padding: ".75rem .9rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div style={{ fontWeight: 600 }}>{t.name}</div>
              <div style={{ fontSize: ".85rem", color: "var(--text-dim)" }}>{t.description}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
''')

w("src/components/ToolShell.tsx", '''import type { ReactNode } from "react";
import Link from "next/link";
import type { ToolMeta } from "@/lib/categories";
import PrivacyBanner from "@/components/PrivacyBanner";
import AdSlot from "@/components/AdSlot";
import { CATEGORIES } from "@/lib/categories";

export default function ToolShell({
  tool,
  children,
}: {
  tool: ToolMeta;
  children: ReactNode;
}) {
  const cat = CATEGORIES.find((c) => c.id === tool.category);
  return (
    <div className="container-app" style={{ padding: "1.5rem 0 3rem" }}>
      <nav aria-label="面包屑" style={{ fontSize: ".85rem", color: "var(--text-dim)", marginBottom: 12 }}>
        <Link href="/">首页</Link>
        <span aria-hidden> / </span>
        <Link href={`/tools/${tool.category}/`}>{cat?.name || tool.category}</Link>
        <span aria-hidden> / </span>
        <span style={{ color: "var(--text-muted)" }}>{tool.name}</span>
      </nav>

      <header style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 8 }}>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700 }}>{tool.name}</h1>
          {tool.status === "beta" && <span className="badge">Beta</span>}
          {tool.privacyNote && <span className="badge badge-accent">本地处理</span>}
        </div>
        <p style={{ margin: 0, color: "var(--text-muted)", maxWidth: 720 }}>{tool.description}</p>
      </header>

      <AdSlot variant="top" className="mb-4" />

      {(tool.privacyNote || true) && (
        <div style={{ marginBottom: 16 }}>
          <PrivacyBanner note={tool.privacyNote} />
        </div>
      )}

      <div className="card" style={{ padding: "1.1rem", marginBottom: 20 }}>{children}</div>

      <AdSlot variant="bottom" className="mb-6" />

      <div className="prose-tool" style={{ maxWidth: 760 }}>
        <h2>使用方法</h2>
        <ol>
          {tool.howTo.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {tool.longDescription && (
          <>
            <h2>关于本工具</h2>
            <p>{tool.longDescription}</p>
          </>
        )}
        {tool.faq?.length ? (
          <>
            <h2>常见问题</h2>
            {tool.faq.map((item) => (
              <div key={item.q} style={{ marginBottom: 12 }}>
                <p style={{ color: "var(--text)", fontWeight: 600, marginBottom: 4 }}>{item.q}</p>
                <p style={{ margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </>
        ) : null}
        <h2>隐私</h2>
        <p>
          本工具默认在浏览器本地完成处理。文件不会上传到服务器，也不会发送给第三方。
          如需了解网站整体数据处理方式，请查看{" "}
          <Link href="/privacy/" style={{ color: "var(--accent)" }}>隐私说明</Link>。
        </p>
      </div>
    </div>
  );
}
''')

print("components done")
