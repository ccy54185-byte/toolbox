"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { audioBufferToWav, decodeAudioFile, resampleBuffer } from "@/lib/audio";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function AudioCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [rate, setRate] = useState(22050);
  const [mono, setMono] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true); setError("");
    try {
      const buf = await decodeAudioFile(file);
      const compressed = await resampleBuffer(buf, rate, mono);
      setOut(audioBufferToWav(compressed));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="audio/*" onFiles={(f) => { setFile(f[0]); setOut(null); }} />
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="sr">目标采样率</label>
          <select id="sr" className="select" value={rate} onChange={(e) => setRate(Number(e.target.value))}>
            <option value={44100}>44100 Hz</option>
            <option value={22050}>22050 Hz</option>
            <option value={16000}>16000 Hz</option>
            <option value={8000}>8000 Hz</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "end" }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--text-muted)", paddingBottom: 10 }}>
            <input type="checkbox" checked={mono} onChange={(e) => setMono(e.target.checked)} />
            转为单声道
          </label>
        </div>
      </div>
      <p style={{ color: "var(--text-dim)", fontSize: ".85rem", marginTop: 10 }}>
        通过降采样与单声道化减小 WAV 体积（Beta：浏览器重编码能力有限）。
      </p>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "处理中…" : "压缩并导出"}</button>
        {out && file && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}-small.wav`)}>
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
