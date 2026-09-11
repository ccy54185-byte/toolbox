"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { decodeAudioFile, extractSilenceRanges } from "@/lib/audio";
import { formatDuration, humanError } from "@/lib/utils";

export default function AudioSilence() {
  const [file, setFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState(-40);
  const [minSec, setMinSec] = useState(0.4);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ranges, setRanges] = useState<{ start: number; end: number }[]>([]);

  async function run() {
    if (!file) return;
    setBusy(true); setError(""); setRanges([]);
    try {
      const buf = await decodeAudioFile(file);
      setRanges(await extractSilenceRanges(buf, threshold, minSec));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="audio/*" onFiles={(f) => { setFile(f[0]); setRanges([]); }} />
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="th">阈值（dB）</label>
          <input id="th" className="input" type="number" min={-80} max={-10} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
        </div>
        <div>
          <label className="label" htmlFor="min">最短静音（秒）</label>
          <input id="min" className="input" type="number" min={0.05} step={0.05} value={minSec} onChange={(e) => setMinSec(Number(e.target.value) || 0.05)} />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "分析中…" : "检测静音"}</button>
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {ranges.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div className="label">检测到 {ranges.length} 段静音</div>
          <div className="card" style={{ maxHeight: 260, overflow: "auto" }}>
            {ranges.map((r, i) => (
              <div key={i} className="mono" style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontSize: ".85rem" }}>
                #{i + 1}  {formatDuration(r.start)} → {formatDuration(r.end)}  （{(r.end - r.start).toFixed(2)}s）
              </div>
            ))}
          </div>
        </div>
      )}
      {!busy && file && ranges.length === 0 && !error && (
        <div style={{ marginTop: 10, color: "var(--text-dim)", fontSize: ".875rem" }}>尚未检测，或未发现符合条件的静音。</div>
      )}
    </div>
  );
}
