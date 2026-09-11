"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

function randInt(min: number, max: number): number {
  const range = max - min + 1;
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return min + (arr[0] % range);
}

export default function RandomNumber() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>([]);

  function generate() {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    const n = Math.min(1000, Math.max(1, count));
    if (unique && hi - lo + 1 < n) {
      setResults([]);
      alert("范围过小，无法生成不重复的随机数");
      return;
    }
    const set = new Set<number>();
    const out: number[] = [];
    while (out.length < n) {
      const v = randInt(lo, hi);
      if (unique) {
        if (!set.has(v)) { set.add(v); out.push(v); }
      } else out.push(v);
    }
    setResults(out);
  }

  return (
    <div>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))" }}>
        <div>
          <label className="label" htmlFor="min">最小值</label>
          <input id="min" className="input" type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} />
        </div>
        <div>
          <label className="label" htmlFor="max">最大值</label>
          <input id="max" className="input" type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} />
        </div>
        <div>
          <label className="label" htmlFor="count">数量</label>
          <input id="count" className="input" type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} />
        </div>
      </div>
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12, color: "var(--text-muted)" }}>
        <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} />
        不重复
      </label>
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={generate}>生成</button>
        <CopyButton value={results.join(", ")} />
      </div>
      {results.length > 0 && (
        <div className="mono card" style={{ marginTop: 14, padding: 14, wordBreak: "break-all", maxHeight: 240, overflow: "auto" }}>
          {results.join(", ")}
        </div>
      )}
    </div>
  );
}
