"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { applyFade, audioBufferToWav, decodeAudioFile } from "@/lib/audio";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function AudioFade() {
  const [file, setFile] = useState<File | null>(null);
  const [fadeIn, setFadeIn] = useState(1);
  const [fadeOut, setFadeOut] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true); setError("");
    try {
      const buf = await decodeAudioFile(file);
      setOut(audioBufferToWav(applyFade(buf, fadeIn, fadeOut)));
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
          <label className="label" htmlFor="fi">淡入（秒）</label>
          <input id="fi" className="input" type="number" min={0} step={0.1} value={fadeIn} onChange={(e) => setFadeIn(Math.max(0, Number(e.target.value) || 0))} />
        </div>
        <div>
          <label className="label" htmlFor="fo">淡出（秒）</label>
          <input id="fo" className="input" type="number" min={0} step={0.1} value={fadeOut} onChange={(e) => setFadeOut(Math.max(0, Number(e.target.value) || 0))} />
        </div>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "处理中…" : "应用并导出"}</button>
        {out && file && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}-fade.wav`)}>
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
