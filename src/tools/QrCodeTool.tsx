"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { humanError } from "@/lib/utils";

export default function QrCodeTool() {
  const [text, setText] = useState("https://example.com");
  const [scale, setScale] = useState(8);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const value = (text || " ").trim() || " ";
    setBusy(true);
    QRCode.toCanvas(canvas, value, {
      width: Math.max(160, scale * 32),
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#0a0e14",
        light: "#ffffff",
      },
    })
      .then(() => {
        if (!cancelled) setError("");
      })
      .catch((e) => {
        if (!cancelled) setError(humanError(e));
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [text, scale]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qrcode.png";
    a.click();
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
      }}
    >
      <div>
        <label className="label" htmlFor="t">
          文本 / URL
        </label>
        <textarea
          id="t"
          className="textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ minHeight: 120, fontFamily: "inherit" }}
          placeholder="https://example.com 或任意文本"
        />
        <div style={{ marginTop: 12 }}>
          <label className="label" htmlFor="s">
            导出清晰度：{scale}
          </label>
          <input
            id="s"
            className="range"
            type="range"
            min={4}
            max={16}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={download} disabled={busy}>
            下载 PNG
          </button>
          <span style={{ color: "var(--text-dim)", fontSize: ".85rem", alignSelf: "center" }}>
            {busy ? "生成中…" : "本地生成 · 可扫码"}
          </span>
        </div>
        {error && (
          <div style={{ marginTop: 10, color: "var(--error)", fontSize: ".875rem" }}>{error}</div>
        )}
      </div>
      <div
        className="card"
        style={{
          padding: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: "100%",
            width: 280,
            height: "auto",
            imageRendering: "pixelated",
            borderRadius: 4,
          }}
          aria-label="二维码预览"
        />
      </div>
    </div>
  );
}
