"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function UrlEncode() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode" | "component">("component");

  const result = useMemo(() => {
    if (!input) return { value: "", error: "" };
    try {
      if (mode === "encode") return { value: encodeURI(input), error: "" };
      if (mode === "component") return { value: encodeURIComponent(input), error: "" };
      return { value: decodeURIComponent(input), error: "" };
    } catch {
      return { value: "", error: mode === "decode" ? "无效的 URL 编码" : "编码失败" };
    }
  }, [input, mode]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button className={`btn ${mode === "component" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("component")}>encodeURIComponent</button>
        <button className={`btn ${mode === "encode" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("encode")}>encodeURI</button>
        <button className={`btn ${mode === "decode" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("decode")}>解码</button>
        <CopyButton value={result.value} />
      </div>
      <label className="label" htmlFor="in">输入</label>
      <textarea id="in" className="textarea" value={input} onChange={(e) => setInput(e.target.value)} style={{ minHeight: 120 }} />
      <label className="label" htmlFor="out" style={{ marginTop: 12 }}>输出</label>
      <textarea id="out" className="textarea" readOnly value={result.value} style={{ minHeight: 120 }} />
      {result.error && <div style={{ marginTop: 8, color: "var(--error)" }}>{result.error}</div>}
    </div>
  );
}
