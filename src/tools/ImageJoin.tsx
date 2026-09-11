"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { joinImages } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImageJoin() {
  const [files, setFiles] = useState<File[]>([]);
  const [direction, setDirection] = useState<"horizontal" | "vertical">("vertical");
  const [gap, setGap] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (files.length < 2) return;
    setBusy(true); setError("");
    try {
      const blob = await joinImages(files, direction, gap);
      setOut(blob);
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" multiple onFiles={(f) => setFiles((p) => [...p, ...f])} hint="上传至少两张图片" />
      {files.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: ".9rem" }}>
              <span>{i + 1}. {f.name}</span>
              <button className="btn btn-ghost" style={{ minHeight: 28, padding: "0 .5rem" }} onClick={() => setFiles(files.filter((_, j) => j !== i))}>移除</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="dir">拼接方向</label>
          <select id="dir" className="select" value={direction} onChange={(e) => setDirection(e.target.value as "horizontal" | "vertical")}>
            <option value="vertical">垂直</option>
            <option value="horizontal">水平</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="gap">间距（px）</label>
          <input id="gap" className="input" type="number" min={0} value={gap} onChange={(e) => setGap(Math.max(0, Number(e.target.value) || 0))} />
        </div>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={files.length < 2 || busy} onClick={run}>{busy ? "拼接中…" : "拼接"}</button>
        {out && <button className="btn btn-secondary" onClick={() => downloadBlob(out, safeFileName("joined.png"))}>下载 PNG</button>}
        <button className="btn btn-ghost" onClick={() => { setFiles([]); setOut(null); }}>清空</button>
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {out && <div style={{ marginTop: 12, color: "var(--text-muted)" }}>已生成 {formatBytes(out.size)}</div>}
    </div>
  );
}
