"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { convertImageBlob, extensionForFormat, type OutputFormat } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputFormat>("image/webp");
  const [quality, setQuality] = useState(0.92);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<{ blob: Blob; width: number; height: number } | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const result = await convertImageBlob(file, format, quality);
      setOut(result);
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" onFiles={(f) => setFile(f[0])} />
      {file && (
        <div style={{ marginTop: 10, fontSize: ".875rem", color: "var(--text-dim)" }}>
          {file.name} · {formatBytes(file.size)} · {file.type || "未知格式"}
        </div>
      )}
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="fmt">目标格式</label>
          <select id="fmt" className="select" value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)}>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
        {format !== "image/png" && (
          <div>
            <label className="label" htmlFor="q">质量 {(quality * 100).toFixed(0)}%</label>
            <input id="q" className="range" type="range" min={0.3} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
          </div>
        )}
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "转换中…" : "转换"}</button>
        {out && file && (
          <button
            className="btn btn-secondary"
            onClick={() => downloadBlob(out.blob, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}.${extensionForFormat(format)}`)}
          >
            下载结果
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {out && (
        <div style={{ marginTop: 12, color: "var(--text-muted)", fontSize: ".9rem" }}>
          已生成：{formatBytes(out.blob.size)} · {out.width}×{out.height}
        </div>
      )}
    </div>
  );
}
