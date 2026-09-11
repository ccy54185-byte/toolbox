"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

function encodeUtf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin);
}

function decodeUtf8(b64: string): string {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const result = useMemo(() => {
    if (!input) return { value: "", error: "" };
    try {
      return { value: mode === "encode" ? encodeUtf8(input) : decodeUtf8(input.trim()), error: "" };
    } catch {
      return { value: "", error: mode === "decode" ? "无效的 Base64 字符串" : "编码失败" };
    }
  }, [input, mode]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button className={`btn ${mode === "encode" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("encode")}>编码</button>
        <button className={`btn ${mode === "decode" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("decode")}>解码</button>
        <CopyButton value={result.value} />
      </div>
      <label className="label" htmlFor="in">输入</label>
      <textarea id="in" className="textarea" value={input} onChange={(e) => setInput(e.target.value)} style={{ minHeight: 140 }} placeholder={mode === "encode" ? "任意文本（支持中文）" : "Base64 字符串"} />
      <label className="label" htmlFor="out" style={{ marginTop: 12 }}>输出</label>
      <textarea id="out" className="textarea" readOnly value={result.value} style={{ minHeight: 140 }} />
      {result.error && <div style={{ marginTop: 8, color: "var(--error)" }}>{result.error}</div>}
    </div>
  );
}
