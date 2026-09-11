"use client";

import { useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";

const algos = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

export default function HashTool() {
  const [input, setInput] = useState("");
  const [algo, setAlgo] = useState<(typeof algos)[number]>("SHA-256");
  const [hash, setHash] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!input) { setHash(""); setError(""); return; }
      try {
        const data = new TextEncoder().encode(input);
        const buf = await crypto.subtle.digest(algo, data);
        const hex = Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
        if (!cancelled) { setHash(hex); setError(""); }
      } catch {
        if (!cancelled) { setError("当前浏览器不支持该算法"); setHash(""); }
      }
    }
    run();
    return () => { cancelled = true; };
  }, [input, algo]);

  return (
    <div>
      <label className="label" htmlFor="in">输入文本</label>
      <textarea id="in" className="textarea" value={input} onChange={(e) => setInput(e.target.value)} style={{ minHeight: 140 }} />
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {algos.map((a) => (
          <button key={a} className={`btn ${algo === a ? "btn-primary" : "btn-secondary"}`} style={{ minHeight: 40 }} onClick={() => setAlgo(a)}>{a}</button>
        ))}
        <CopyButton value={hash} />
      </div>
      {error && <div style={{ marginTop: 10, color: "var(--error)" }}>{error}</div>}
      {hash && (
        <div style={{ marginTop: 14 }}>
          <div className="label">{algo} 摘要</div>
          <div className="mono" style={{ wordBreak: "break-all", padding: 12, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8 }}>{hash}</div>
        </div>
      )}
    </div>
  );
}
