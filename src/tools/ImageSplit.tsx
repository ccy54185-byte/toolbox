"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { splitImage } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImageSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [parts, setParts] = useState<{ blob: Blob; name: string }[]>([]);

  async function run() {
    if (!file) return;
    setBusy(true); setError(""); setParts([]);
    try {
      const result = await splitImage(file, cols, rows);
      setParts(result.map((p) => ({ blob: p.blob, name: p.name })));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" onFiles={(f) => { setFile(f[0]); setParts([]); }} />
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="cols">列数</label>
          <input id="cols" className="input" type="number" min={1} max={20} value={cols} onChange={(e) => setCols(Math.max(1, Number(e.target.value) || 1))} />
        </div>
        <div>
          <label className="label" htmlFor="rows">行数</label>
          <input id="rows" className="input" type="number" min={1} max={20} value={rows} onChange={(e) => setRows(Math.max(1, Number(e.target.value) || 1))} />
        </div>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "分割中…" : "分割"}</button>
        {parts.length > 0 && (
          <button className="btn btn-secondary" onClick={() => {
            parts.forEach((p, i) => setTimeout(() => downloadBlob(p.blob, `${safeFileName(file!.name.replace(/\.[^.]+$/, ""))}-${p.name}`), i * 150));
          }}>下载全部</button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {parts.length > 0 && (
        <div style={{ marginTop: 12, color: "var(--text-muted)" }}>已生成 {parts.length} 张切片 · 合计约 {formatBytes(parts.reduce((s, p) => s + p.blob.size, 0))}</div>
      )}
    </div>
  );
}
