"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { audioBufferToWav } from "@/lib/audio";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function VideoExtractAudio() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true); setError(""); setOut(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const ctx = new OfflineAudioContext(1, 1, 44100);
      const buf = await ctx.decodeAudioData(arrayBuffer.slice(0));
      setOut(audioBufferToWav(buf));
    } catch (e) {
      setError(humanError(e) + "（部分视频编码浏览器无法解码音轨）");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="video/*" onFiles={(f) => { setFile(f[0]); setOut(null); }} />
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "提取中…" : "提取音频为 WAV"}</button>
        {out && file && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}.wav`)}>
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
