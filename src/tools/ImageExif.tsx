"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { stripExifViaReencode } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImageExif() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<{ name: string; before: number; blob: Blob }[]>([]);

  async function run() {
    if (!files.length) return;
    setBusy(true); setError(""); setResults([]);
    try {
      const out = [];
      for (const f of files) {
        const blob = await stripExifViaReencode(f);
        out.push({ name: f.name, before: f.size, blob });
      }
      setResults(out);
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" multiple onFiles={(f) => setFiles((p) => [...p, ...f])} />
      {files.length > 0 && <div style={{ marginTop: 10, color: "var(--text-dim)", fontSize: ".875rem" }}>已选择 {files.length} 张图片</div>}
      <p style={{ color: "var(--text-muted)", fontSize: ".875rem", marginTop: 12 }}>
        通过重新编码图片移除 EXIF 等元数据（位置、设备型号等）。画质可能有轻微变化。
      </p>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!files.length || busy} onClick={run}>{busy ? "处理中…" : "去除元数据"}</button>
        <button className="btn btn-secondary" onClick={() => { setFiles([]); setResults([]); }}>清空</button>
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {results.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {results.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
              <span>{r.name} · {formatBytes(r.before)} → {formatBytes(r.blob.size)}</span>
              <button className="btn btn-secondary" style={{ minHeight: 36 }} onClick={() => downloadBlob(r.blob, `${safeFileName(r.name.replace(/\.[^.]+$/, ""))}-clean.jpg`)}>下载</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
