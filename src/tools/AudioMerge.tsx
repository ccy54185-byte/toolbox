"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { audioBufferToWav, decodeAudioFile, mergeAudioBuffers } from "@/lib/audio";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function AudioMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (files.length < 2) return;
    setBusy(true); setError("");
    try {
      const buffers = await Promise.all(files.map((f) => decodeAudioFile(f)));
      setOut(audioBufferToWav(mergeAudioBuffers(buffers)));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="audio/*" multiple onFiles={(f) => setFiles((p) => [...p, ...f])} hint="上传至少两个音频，按顺序合并" />
      {files.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: ".9rem" }}>
              <span>{i + 1}. {f.name}</span>
              <button className="btn btn-ghost" style={{ minHeight: 28 }} onClick={() => setFiles(files.filter((_, j) => j !== i))}>移除</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={files.length < 2 || busy} onClick={run}>{busy ? "合并中…" : "合并并导出"}</button>
        {out && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, safeFileName("merged.wav"))}>
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
