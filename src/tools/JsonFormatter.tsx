"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [mode, setMode] = useState<"format" | "minify">("format");

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true, value: "", error: "" };
    try {
      const parsed = JSON.parse(input);
      const value = mode === "format" ? JSON.stringify(parsed, null, indent) : JSON.stringify(parsed);
      return { ok: true, value, error: "" };
    } catch (e) {
      return { ok: false, value: "", error: e instanceof Error ? e.message : "JSON 无效" };
    }
  }, [input, indent, mode]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button className={`btn ${mode === "format" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("format")}>格式化</button>
        <button className={`btn ${mode === "minify" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("minify")}>压缩</button>
        <select className="select" style={{ width: "auto", minWidth: 120 }} value={indent} onChange={(e) => setIndent(Number(e.target.value))} disabled={mode === "minify"}>
          <option value={2}>缩进 2</option>
          <option value={4}>缩进 4</option>
          <option value={0}>紧凑</option>
        </select>
        <CopyButton value={result.value} />
      </div>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
        <div>
          <label className="label" htmlFor="in">输入 JSON</label>
          <textarea id="in" className="textarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"hello":"world"}' style={{ minHeight: 280 }} />
        </div>
        <div>
          <label className="label" htmlFor="out">结果</label>
          <textarea id="out" className="textarea" readOnly value={result.error ? "" : result.value} style={{ minHeight: 280 }} placeholder="输出将显示在这里" />
        </div>
      </div>
      {result.error && (
        <div style={{ marginTop: 10, color: "var(--error)", fontSize: ".875rem" }}>解析失败：{result.error}</div>
      )}
    </div>
  );
}
