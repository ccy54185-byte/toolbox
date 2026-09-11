"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import CopyButton from "@/components/CopyButton";
import { extractPalette } from "@/lib/image";
import { humanError } from "@/lib/utils";

export default function ImageColors() {
  const [file, setFile] = useState<File | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(f: File) {
    setBusy(true); setError("");
    try {
      const palette = await extractPalette(f, 8);
      setColors(palette);
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" onFiles={(f) => { setFile(f[0]); if (f[0]) run(f[0]); }} />
      {busy && <div style={{ marginTop: 12, color: "var(--text-dim)" }}>提取颜色中…</div>}
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {colors.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))" }}>
            {colors.map((c) => (
              <div key={c} className="card" style={{ overflow: "hidden" }}>
                <div style={{ height: 64, background: c }} />
                <div style={{ padding: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                  <span className="mono" style={{ fontSize: ".85rem" }}>{c.toUpperCase()}</span>
                  <CopyButton value={c.toUpperCase()} label="复制" className="btn btn-ghost" />
                </div>
              </div>
            ))}
          </div>
          {file && <div style={{ marginTop: 10, color: "var(--text-dim)", fontSize: ".85rem" }}>来自：{file.name}</div>}
        </div>
      )}
    </div>
  );
}
