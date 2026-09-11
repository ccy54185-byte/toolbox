"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { loadImageFromFile } from "@/lib/image";
import { formatBytes, humanError } from "@/lib/utils";

export default function ImageInfo() {
  const [info, setInfo] = useState<null | {
    name: string; size: number; type: string; width: number; height: number;
  }>(null);
  const [error, setError] = useState("");

  async function handle(files: File[]) {
    const file = files[0];
    if (!file) return;
    setError("");
    try {
      const img = await loadImageFromFile(file);
      setInfo({
        name: file.name,
        size: file.size,
        type: file.type || "未知",
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    } catch (e) {
      setInfo(null);
      setError(humanError(e));
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" onFiles={handle} />
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {info && (
        <div className="card" style={{ marginTop: 16, padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
            <tbody>
              {[
                ["文件名", info.name],
                ["格式", info.type],
                ["文件大小", formatBytes(info.size)],
                ["宽度", `${info.width} px`],
                ["高度", `${info.height} px`],
                ["宽高比", (info.width / info.height).toFixed(3)],
                ["总像素", (info.width * info.height).toLocaleString()],
              ].map(([k, v]) => (
                <tr key={k} style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--text-dim)", width: 120, fontWeight: 560 }}>{k}</th>
                  <td style={{ padding: "10px 14px" }} className={k === "文件名" ? "" : "mono"}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
