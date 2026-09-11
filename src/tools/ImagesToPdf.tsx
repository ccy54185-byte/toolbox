"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { drawImageToCanvas, canvasToBlob, loadImageFromFile } from "@/lib/image";
import { buildPdfFromJpegs } from "@/lib/pdf";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImagesToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (!files.length) return;
    setBusy(true); setError(""); setOut(null);
    try {
      const pages: { bytes: Uint8Array; width: number; height: number }[] = [];
      for (const file of files) {
        const img = await loadImageFromFile(file);
        const canvas = drawImageToCanvas(img, img.naturalWidth, img.naturalHeight);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.globalCompositeOperation = "destination-over";
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        const blob = await canvasToBlob(canvas, "image/jpeg", 0.9);
        pages.push({
          bytes: new Uint8Array(await blob.arrayBuffer()),
          width: canvas.width,
          height: canvas.height,
        });
      }
      setOut(buildPdfFromJpegs(pages));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" multiple onFiles={(f) => setFiles((p) => [...p, ...f])} hint="上传多张图片，按顺序合并为 PDF" />
      {files.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: ".9rem" }}>
              <span>{i + 1}. {f.name}</span>
              <button className="btn btn-ghost" style={{ minHeight: 28 }} onClick={() => setFiles(files.filter((_, j) => j !== i))}>移除</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!files.length || busy} onClick={run}>{busy ? "生成中…" : "生成 PDF"}</button>
        {out && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, safeFileName("images.pdf"))}>
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
