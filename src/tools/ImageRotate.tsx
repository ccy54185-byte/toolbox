"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { extensionForFormat, rotateImageBlob } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImageRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [degrees, setDegrees] = useState<90 | 180 | 270>(90);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const blob = await rotateImageBlob(file, degrees, flipH, flipV, "image/png");
      setOut(blob);
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" onFiles={(f) => { setFile(f[0]); setOut(null); }} />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
        {([90, 180, 270] as const).map((d) => (
          <button key={d} type="button" className={`btn ${degrees === d ? "btn-primary" : "btn-secondary"}`} onClick={() => setDegrees(d)}>
            旋转 {d}°
          </button>
        ))}
        <button type="button" className={`btn ${flipH ? "btn-primary" : "btn-secondary"}`} onClick={() => setFlipH(!flipH)}>水平翻转</button>
        <button type="button" className={`btn ${flipV ? "btn-primary" : "btn-secondary"}`} onClick={() => setFlipV(!flipV)}>垂直翻转</button>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "处理中…" : "应用"}</button>
        {out && file && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}-rotated.${extensionForFormat("image/png")}`)}>下载</button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {out && <div style={{ marginTop: 12, color: "var(--text-muted)" }}>已生成 {formatBytes(out.size)}</div>}
    </div>
  );
}
