"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { readVideoInfo } from "@/lib/audio";
import { formatBytes, formatDuration, humanError } from "@/lib/utils";

export default function VideoInfo() {
  const [info, setInfo] = useState<Awaited<ReturnType<typeof readVideoInfo>> | null>(null);
  const [error, setError] = useState("");

  async function handle(files: File[]) {
    const file = files[0];
    if (!file) return;
    setError("");
    try {
      setInfo(await readVideoInfo(file));
    } catch (e) {
      setInfo(null);
      setError(humanError(e));
    }
  }

  return (
    <div>
      <FileDrop accept="video/*" onFiles={handle} />
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
                ["分辨率", `${info.width}×${info.height}`],
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
