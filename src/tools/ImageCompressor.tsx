"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { convertImageBlob, extensionForFormat, type OutputFormat } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

type Row = {
  name: string;
  originalSize: number;
  blob: Blob;
  width: number;
  height: number;
};

export default function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [maxWidth, setMaxWidth] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Row[]>([]);

  async function run() {
    if (!files.length) return;
    setBusy(true);
    setError("");
    setRows([]);
    try {
      const out: Row[] = [];
      for (const file of files) {
        let source: File | Blob = file;
        if (maxWidth > 0) {
          const { resizeImageBlob } = await import("@/lib/image");
          const resized = await resizeImageBlob(file, {
            width: maxWidth,
            keepRatio: true,
            format,
            quality,
          });
          source = resized.blob;
        }
        const srcFile =
          source instanceof File
            ? source
            : new File([source], file.name, { type: file.type });
        const result = await convertImageBlob(srcFile, format, quality);
        out.push({
          name: file.name,
          originalSize: file.size,
          blob: result.blob,
          width: result.width,
          height: result.height,
        });
      }
      setRows(out);
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop
        accept="image/*"
        multiple
        onFiles={(f) => setFiles((prev) => [...prev, ...f])}
        hint="拖拽或点击上传图片（可多选）"
      />
      {files.length > 0 && (
        <div style={{ marginTop: 12, color: "var(--text-dim)", fontSize: ".875rem" }}>
          已选择 {files.length} 个文件
        </div>
      )}

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="q">质量 {(quality * 100).toFixed(0)}%</label>
          <input id="q" className="range" type="range" min={0.3} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
        </div>
        <div>
          <label className="label" htmlFor="fmt">输出格式</label>
          <select id="fmt" className="select" value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)}>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
            <option value="image/png">PNG</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="mw">最大宽度（0=不缩放）</label>
          <input id="mw" className="input" type="number" min={0} value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value) || 0)} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!files.length || busy} onClick={run}>
          {busy ? "处理中…" : "开始压缩"}
        </button>
        <button className="btn btn-secondary" onClick={() => { setFiles([]); setRows([]); }} disabled={busy}>清空</button>
      </div>

      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}

      {rows.length > 0 && (
        <div style={{ marginTop: 16, overflowX: "auto" }}>
          <table className="w-full" style={{ borderCollapse: "collapse", fontSize: ".9rem" }}>
            <thead>
              <tr style={{ color: "var(--text-dim)", textAlign: "left" }}>
                <th style={{ padding: 8 }}>文件</th>
                <th style={{ padding: 8 }}>原大小</th>
                <th style={{ padding: 8 }}>新大小</th>
                <th style={{ padding: 8 }}>尺寸</th>
                <th style={{ padding: 8 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: 8 }}>{r.name}</td>
                  <td style={{ padding: 8 }}>{formatBytes(r.originalSize)}</td>
                  <td style={{ padding: 8, color: "var(--success)" }}>{formatBytes(r.blob.size)}</td>
                  <td style={{ padding: 8 }} className="mono">{r.width}×{r.height}</td>
                  <td style={{ padding: 8 }}>
                    <button
                      className="btn btn-secondary"
                      style={{ minHeight: 36, padding: "0 .7rem" }}
                      onClick={() => {
                        const base = r.name.replace(/\.[^.]+$/, "");
                        downloadBlob(r.blob, `${safeFileName(base)}-compressed.${extensionForFormat(format)}`);
                      }}
                    >
                      下载
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
