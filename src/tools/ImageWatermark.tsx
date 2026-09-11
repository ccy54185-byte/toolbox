"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { addTextWatermark, type WatermarkPosition } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

const positions: { id: WatermarkPosition; label: string }[] = [
  { id: "tl", label: "左上" }, { id: "tc", label: "上中" }, { id: "tr", label: "右上" },
  { id: "ml", label: "左中" }, { id: "mc", label: "正中" }, { id: "mr", label: "右中" },
  { id: "bl", label: "左下" }, { id: "bc", label: "下中" }, { id: "br", label: "右下" },
];

export default function ImageWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("© ToolBox");
  const [opacity, setOpacity] = useState(0.4);
  const [fontSize, setFontSize] = useState(0);
  const [position, setPosition] = useState<WatermarkPosition>("br");
  const [color, setColor] = useState("#ffffff");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true); setError("");
    try {
      const blob = await addTextWatermark(file, text, {
        opacity,
        position,
        color,
        fontSize: fontSize || undefined,
        format: "image/png",
      });
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
      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="wm">水印文字</label>
          <input id="wm" className="input" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
          <div>
            <label className="label" htmlFor="op">透明度 {(opacity * 100).toFixed(0)}%</label>
            <input id="op" className="range" type="range" min={0.05} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
          </div>
          <div>
            <label className="label" htmlFor="fs">字号（0=自动）</label>
            <input id="fs" className="input" type="number" min={0} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value) || 0)} />
          </div>
          <div>
            <label className="label" htmlFor="color">颜色</label>
            <input id="color" className="input" type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ padding: 6, height: 44 }} />
          </div>
        </div>
        <div>
          <span className="label">位置</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {positions.map((p) => (
              <button key={p.id} type="button" className={`btn ${position === p.id ? "btn-primary" : "btn-secondary"}`} style={{ minHeight: 36, padding: "0 .65rem" }} onClick={() => setPosition(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || !text.trim() || busy} onClick={run}>{busy ? "处理中…" : "添加水印"}</button>
        {out && file && <button className="btn btn-secondary" onClick={() => downloadBlob(out, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}-watermark.png`)}>下载</button>}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {out && <div style={{ marginTop: 12, color: "var(--text-muted)" }}>已生成 {formatBytes(out.size)}</div>}
    </div>
  );
}
