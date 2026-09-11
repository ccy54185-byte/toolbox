"use client";

import { useEffect, useRef, useState } from "react";
import FileDrop from "@/components/FileDrop";
import { cropImageBlob, loadImageFromFile } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImageCrop() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 100, h: 100 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);
  const previewRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!file) return;
    loadImageFromFile(file)
      .then((img) => {
        setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
        const cw = Math.floor(img.naturalWidth * 0.8);
        const ch = Math.floor(img.naturalHeight * 0.8);
        setCrop({
          x: Math.floor((img.naturalWidth - cw) / 2),
          y: Math.floor((img.naturalHeight - ch) / 2),
          w: cw,
          h: ch,
        });
      })
      .catch((e) => setError(humanError(e)));
  }, [file]);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const blob = await cropImageBlob(file, crop, "image/png");
      setOut(blob);
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  const fields: { key: keyof typeof crop; label: string; max: number }[] = [
    { key: "x", label: "X", max: imgSize.w },
    { key: "y", label: "Y", max: imgSize.h },
    { key: "w", label: "宽", max: imgSize.w },
    { key: "h", label: "高", max: imgSize.h },
  ];

  return (
    <div>
      <FileDrop accept="image/*" onFiles={(f) => { setFile(f[0]); setOut(null); }} />
      {imgSize.w > 0 && (
        <div style={{ marginTop: 10, color: "var(--text-dim)", fontSize: ".875rem" }}>
          原图 {imgSize.w}×{imgSize.h}
        </div>
      )}
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", marginTop: 16 }}>
        {fields.map((f) => (
          <div key={f.key}>
            <label className="label" htmlFor={f.key}>{f.label}</label>
            <input
              id={f.key}
              className="input"
              type="number"
              min={0}
              max={f.max}
              value={crop[f.key]}
              onChange={(e) => setCrop((c) => ({ ...c, [f.key]: Math.max(0, Number(e.target.value) || 0) }))}
            />
          </div>
        ))}
      </div>
      {file && (
        <div style={{ marginTop: 16, position: "relative", display: "inline-block", maxWidth: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={previewRef}
            src={URL.createObjectURL(file)}
            alt="裁剪预览"
            style={{ maxWidth: "100%", maxHeight: 280, display: "block", borderRadius: 8 }}
            onLoad={() => {}}
          />
          {(() => {
            const el = previewRef.current;
            if (!el || !imgSize.w) return null;
            const scale = el.clientWidth / imgSize.w;
            return (
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  left: crop.x * scale,
                  top: crop.y * scale,
                  width: crop.w * scale,
                  height: crop.h * scale,
                  border: "2px solid var(--accent)",
                  boxShadow: "0 0 0 9999px rgba(0,0,0,.45)",
                  pointerEvents: "none",
                }}
              />
            );
          })()}
        </div>
      )}
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>
          {busy ? "裁剪中…" : "裁剪并导出"}
        </button>
        {out && file && (
          <button
            className="btn btn-secondary"
            onClick={() =>
              downloadBlob(out, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}-crop.png`)
            }
          >
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
