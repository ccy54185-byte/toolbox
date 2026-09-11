"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { audioBufferToWav, decodeAudioFile, trimAudioBuffer } from "@/lib/audio";
import { downloadBlob, formatBytes, formatDuration, humanError, safeFileName } from "@/lib/utils";

export default function AudioTrim() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function onFile(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f); setOut(null); setError("");
    try {
      const buf = await decodeAudioFile(f);
      setDuration(buf.duration);
      setStart(0);
      setEnd(Number(buf.duration.toFixed(2)));
    } catch (e) {
      setError(humanError(e));
    }
  }

  async function run() {
    if (!file) return;
    setBusy(true); setError("");
    try {
      const buf = await decodeAudioFile(file);
      const trimmed = trimAudioBuffer(buf, start, end);
      setOut(audioBufferToWav(trimmed));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="audio/*" onFiles={onFile} />
      {duration > 0 && (
        <div style={{ marginTop: 10, color: "var(--text-dim)", fontSize: ".875rem" }}>
          时长 {formatDuration(duration)} · {file?.name}
        </div>
      )}
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="s">开始（秒）</label>
          <input id="s" className="input" type="number" min={0} step={0.1} value={start} onChange={(e) => setStart(Number(e.target.value) || 0)} />
        </div>
        <div>
          <label className="label" htmlFor="e">结束（秒）</label>
          <input id="e" className="input" type="number" min={0} step={0.1} value={end} onChange={(e) => setEnd(Number(e.target.value) || 0)} />
        </div>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "处理中…" : "裁剪并导出 WAV"}</button>
        {out && file && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}-trim.wav`)}>
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
