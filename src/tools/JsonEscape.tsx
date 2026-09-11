"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function JsonEscape() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"escape" | "unescape">("escape");

  const result = useMemo(() => {
    if (!input) return "";
    try {
      if (mode === "escape") {
        return JSON.stringify(input).slice(1, -1);
      }
      return JSON.parse(`"${input.replace(/"/g, '\\"')}"`);
    } catch {
      try {
        return JSON.parse(`"${input}"`);
      } catch {
        return "（无法反转义，请检查输入）";
      }
    }
  }, [input, mode]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button className={`btn ${mode === "escape" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("escape")}>转义</button>
        <button className={`btn ${mode === "unescape" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("unescape")}>反转义</button>
        <CopyButton value={result} />
      </div>
      <label className="label" htmlFor="in">输入</label>
      <textarea id="in" className="textarea" value={input} onChange={(e) => setInput(e.target.value)} style={{ minHeight: 140 }} />
      <label className="label" htmlFor="out" style={{ marginTop: 12 }}>输出</label>
      <textarea id="out" className="textarea" readOnly value={result} style={{ minHeight: 140 }} />
    </div>
  );
}
