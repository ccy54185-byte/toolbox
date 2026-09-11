"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import CopyButton from "@/components/CopyButton";
import { dataUrlToBlob, fileToDataUrl } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImageBase64() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [dataUrl, setDataUrl] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function encode(f: File) {
    setError("");
    try {
      const url = await fileToDataUrl(f);
      setDataUrl(url);
      setFile(f);
    } catch (e) {
      setError(humanError(e));
    }
  }

  function decode() {
    setError("");
    try {
      const value = input.trim();
      if (!value) throw new Error("请粘贴 Base64 或 Data URL");
      const dataUrl = value.startsWith("data:") ? value : `data:image/png;base64,${value}`;
      const blob = dataUrlToBlob(dataUrl);
      downloadBlob(blob, safeFileName("decoded-image.png", "image"));
    } catch (e) {
      setError(humanError(e));
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button className={`btn ${mode === "encode" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("encode")}>图片 → Base64</button>
        <button className={`btn ${mode === "decode" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("decode")}>Base64 → 图片</button>
      </div>
      {mode === "encode" ? (
        <>
          <FileDrop accept="image/*" onFiles={(f) => encode(f[0])} />
          {file && <div style={{ marginTop: 10, color: "var(--text-dim)", fontSize: ".875rem" }}>{file.name} · {formatBytes(file.size)}</div>}
          {dataUrl && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
                <span className="label" style={{ margin: 0 }}>Data URL</span>
                <CopyButton value={dataUrl} />
              </div>
              <textarea className="textarea" readOnly value={dataUrl} style={{ minHeight: 120 }} />
            </div>
          )}
        </>
      ) : (
        <>
          <label className="label" htmlFor="b64">粘贴 Base64 字符串或 Data URL</label>
          <textarea id="b64" className="textarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder="data:image/png;base64,iVBOR..." />
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={decode}>解码并下载图片</button>
          </div>
        </>
      )}
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
