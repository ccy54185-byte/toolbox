"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { readAudioInfo } from "@/lib/audio";
import { formatBytes, formatDuration, humanError } from "@/lib/utils";

export default function AudioInfo() {
  const [info, setInfo] = useState<Awaited<ReturnType<typeof readAudioInfo>> | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handle(files: File[]) {
    const file = files[0];
    if (!file) return;
    setBusy(true); setError("");
    try {
      setInfo(await readAudioInfo(file));
    } catch (e) {
      setInfo(null);
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="audio/*" onFiles={handle} hint="上传音频文件查看信息" />
      {busy && <div style={{ marginTop: 10, color: "var(--text-dim)" }}>解码中…</div>}
      {error && <div style={{ marginTop: 10, color: "var(--error)" }}>{error}</div>}
      {info && (
        <div className="card" style={{ marginTop: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
            <tbody>
              {([
                ["文件名", info.name],
                ["格式", info.type],
                ["文件大小", formatBytes(info.size)],
                ["时长", formatDuration(info.duration)],
                ["采样率", `${info.sampleRate} Hz`],
                ["声道数", String(info.channels)],
              ] as const).map(([k, v]) => (
                <tr key={k} style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={{ textAlign: "left", padding: "10px 14px", width: 120, color: "var(--text-dim)", fontWeight: 560 }}>{k}</th>
                  <td className="mono" style={{ padding: "10px 14px" }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
