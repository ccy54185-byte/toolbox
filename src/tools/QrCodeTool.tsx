"use client";

import { useEffect, useRef, useState } from "react";
import { generateQrMatrix, renderQrToCanvas } from "@/lib/qr";
import { humanError } from "@/lib/utils";

export default function QrCodeTool() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(8);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const matrix = generateQrMatrix(text || " ");
      renderQrToCanvas(canvas, matrix, size);
      setError("");
    } catch (e) {
      setError(humanError(e));
    }
  }, [text, size]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qrcode.png";
    a.click();
  }

  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
      <div>
        <label className="label" htmlFor="t">文本 / URL</label>
        <textarea id="t" className="textarea" value={text} onChange={(e) => setText(e.target.value)} style={{ minHeight: 120, fontFamily: "inherit" }} />
        <div style={{ marginTop: 12 }}>
          <label className="label" htmlFor="s">模块大小：{size}px</label>
          <input id="s" className="range" type="range" min={4} max={16} value={size} onChange={(e) => setSize(Number(e.target.value))} />
        </div>
        <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={download}>下载 PNG</button>
        {error && <div style={{ marginTop: 10, color: "var(--error)", fontSize: ".875rem" }}>{error}</div>}
      </div>
      <div className="card" style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto", imageRendering: "pixelated" }} aria-label="二维码预览" />
      </div>
    </div>
  );
}
