"use client";

import { useEffect, useState } from "react";
import FileDrop from "@/components/FileDrop";
import { extensionForFormat, loadImageFromFile, resizeImageBlob, type OutputFormat } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [nw, setNw] = useState(0);
  const [nh, setNh] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepRatio, setKeepRatio] = useState(true);
  const [format, setFormat] = useState<OutputFormat>("image/png");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<{ blob: Blob; width: number; height: number } | null>(null);

  useEffect(() => {
    if (!file) return;
    loadImageFromFile(file)
      .then((img) => {
        setNw(img.naturalWidth);
        setNh(img.naturalHeight);
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
      })
      .catch((e) => setError(humanError(e)));
  }, [file]);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const result = await resizeImageBlob(file, {
        width,
        height,
        keepRatio,
        format,
        quality: 0.92,
      });
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
      {nw > 0 && (
        <div style={{ marginTop: 10, fontSize: ".875rem", color: "var(--text-dim)" }}>
          原图：{nw}×{nh} · {file ? formatBytes(file.size) : ""}
        </div>
      )}
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="w">宽度</label>
          <input id="w" className="input" type="number" min={1} value={width || ""} onChange={(e) => {
            const v = Number(e.target.value) || 0;
            setWidth(v);
            if (keepRatio && nw) setHeight(Math.max(1, Math.round((nh / nw) * v)));
          }} />
        </div>
        <div>
          <label className="label" htmlFor="h">高度</label>
          <input id="h" className="input" type="number" min={1} value={height || ""} onChange={(e) => {
            const v = Number(e.target.value) || 0;
            setHeight(v);
            if (keepRatio && nh) setWidth(Math.max(1, Math.round((nw / nh) * v)));
          }} />
        </div>
        <div>
          <label className="label" htmlFor="fmt">输出格式</label>
          <select id="fmt" className="select" value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)}>
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
      </div>
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12, color: "var(--text-muted)" }}>
        <input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} />
        保持宽高比
      </label>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "处理中…" : "调整尺寸"}</button>
        {out && file && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out.blob, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}-${out.width}x${out.height}.${extensionForFormat(format)}`)}>
            下载
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {out && <div style={{ marginTop: 12, color: "var(--text-muted)" }}>输出：{out.width}×{out.height} · {formatBytes(out.blob.size)}</div>}
    </div>
  );
}
