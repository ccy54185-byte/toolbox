"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { countPdfPages } from "@/lib/pdf";
import { formatBytes, humanError } from "@/lib/utils";

export default function PdfInfo() {
  const [info, setInfo] = useState<{ name: string; size: number; pages: number } | null>(null);
  const [error, setError] = useState("");

  async function handle(files: File[]) {
    const file = files[0];
    if (!file) return;
    setError("");
    try {
      if (!/pdf$/i.test(file.type) && !/\.pdf$/i.test(file.name)) {
        throw new Error("请选择 PDF 文件");
      }
      const buf = await file.arrayBuffer();
      const pages = countPdfPages(buf);
      if (!pages) throw new Error("无法解析页数，文件可能已损坏或加密");
      setInfo({ name: file.name, size: file.size, pages });
    } catch (e) {
      setInfo(null);
      setError(humanError(e));
    }
  }

  return (
    <div>
      <FileDrop accept="application/pdf,.pdf" onFiles={handle} />
      {error && <div style={{ marginTop: 10, color: "var(--error)" }}>{error}</div>}
      {info && (
        <div className="card" style={{ marginTop: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
            <tbody>
              {([
                ["文件名", info.name],
                ["文件大小", formatBytes(info.size)],
                ["页数", String(info.pages)],
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
