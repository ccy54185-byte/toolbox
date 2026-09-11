"use client";

import { useMemo, useState } from "react";

function diffLines(a: string, b: string) {
  const as = a.split("\n");
  const bs = b.split("\n");
  // simple LCS-based line diff
  const m = as.length;
  const n = bs.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = as[i] === bs[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const rows: { type: "same" | "del" | "add"; text: string }[] = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (as[i] === bs[j]) {
      rows.push({ type: "same", text: as[i] });
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({ type: "del", text: as[i] });
      i++;
    } else {
      rows.push({ type: "add", text: bs[j] });
      j++;
    }
  }
  while (i < m) rows.push({ type: "del", text: as[i++] });
  while (j < n) rows.push({ type: "add", text: bs[j++] });
  return rows;
}

export default function TextDiff() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const rows = useMemo(() => diffLines(left, right), [left, right]);
  const stats = useMemo(() => ({
    same: rows.filter((r) => r.type === "same").length,
    del: rows.filter((r) => r.type === "del").length,
    add: rows.filter((r) => r.type === "add").length,
  }), [rows]);

  return (
    <div>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
        <div>
          <label className="label" htmlFor="l">原文</label>
          <textarea id="l" className="textarea" value={left} onChange={(e) => setLeft(e.target.value)} style={{ minHeight: 180, fontFamily: "inherit" }} />
        </div>
        <div>
          <label className="label" htmlFor="r">修改后</label>
          <textarea id="r" className="textarea" value={right} onChange={(e) => setRight(e.target.value)} style={{ minHeight: 180, fontFamily: "inherit" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, margin: "12px 0", color: "var(--text-dim)", fontSize: ".875rem", flexWrap: "wrap" }}>
        <span>相同 {stats.same}</span>
        <span style={{ color: "var(--error)" }}>删除 {stats.del}</span>
        <span style={{ color: "var(--success)" }}>新增 {stats.add}</span>
      </div>
      <div className="card mono" style={{ padding: 12, maxHeight: 320, overflow: "auto", fontSize: ".85rem" }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            padding: "2px 6px",
            background: r.type === "del" ? "rgba(248,113,113,.12)" : r.type === "add" ? "rgba(52,211,153,.12)" : "transparent",
            color: r.type === "del" ? "var(--error)" : r.type === "add" ? "var(--success)" : "var(--text-muted)",
            whiteSpace: "pre-wrap",
          }}>
            {r.type === "del" ? "- " : r.type === "add" ? "+ " : "  "}
            {r.text || " "}
          </div>
        ))}
      </div>
    </div>
  );
}
