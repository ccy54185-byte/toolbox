"use client";

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
      <label className="label" htmlFor="tool-search">
        搜索工具
      </label>
      <input
        id="tool-search"
        className="input"
        placeholder="压缩、JSON、二维码…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
        style={{ borderRadius: "var(--radius-pill)", paddingLeft: "1.1rem" }}
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
            boxShadow: "var(--shadow-soft)",
          }}
        >
          {results.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}/`}
              style={{
                display: "block",
                padding: "0.85rem 1rem",
                borderBottom: "1px solid var(--border-soft)",
              }}
            >
              <div style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>{t.name}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-tertiary)" }}>{t.description}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
