"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { applyGain, audioBufferToWav, decodeAudioFile } from "@/lib/audio";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function AudioVolume() {
  const [file, setFile] = useState<File | null>(null);
  const [gain, setGain] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true); setError("");
    try {
      const buf = await decodeAudioFile(file);
      const result = applyGain(buf, gain);
      setOut(audioBufferToWav(result));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="audio/*" onFiles={(f) => { setFile(f[0]); setOut(null); }} />
      <div style={{ marginTop: 16 }}>
        <label className="label" htmlFor="g">增益：{gain.toFixed(2)}×（1 = 原音量）</label>
        <input id="g" className="range" type="range" min={0.1} max={3} step={0.05} value={gain} onChange={(e) => setGain(Number(e.target.value))} />
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "处理中…" : "应用并导出"}</button>
        {out && file && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}-vol.wav`)}>
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
