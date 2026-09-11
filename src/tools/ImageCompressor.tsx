"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import {
  convertImageBlob,
  extensionForFormat,
  resizeImageBlob,
  type OutputFormat,
} from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

type Row = {
  name: string;
  originalSize: number;
  blob: Blob;
  width: number;
  height: number;
  ratio: number;
};

export default function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(0.75);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [maxWidth, setMaxWidth] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Row[]>([]);

  async function compressOne(file: File): Promise<Row> {
    let result: { blob: Blob; width: number; height: number };
    if (maxWidth > 0) {
      result = await resizeImageBlob(file, {
        width: maxWidth,
        keepRatio: true,
        format,
        quality,
      });
    } else {
      result = await convertImageBlob(file, format, quality);
    }
    // If re-encode made file larger, keep original bytes but still return info
    const useOriginal =
      format === "image/png" && result.blob.size >= file.size && maxWidth <= 0;
    const blob = useOriginal ? file : result.blob;
    return {
      name: file.name,
      originalSize: file.size,
      blob,
      width: result.width,
      height: result.height,
      ratio:
        file.size > 0
          ? Math.round((1 - blob.size / file.size) * 100)
          : 0,
    };
  }

  async function run() {
    if (!files.length) return;
    setBusy(true);
    setError("");
    setRows([]);
    try {
      const out: Row[] = [];
      for (const file of files) {
        out.push(await compressOne(file));
      }
      setRows(out);
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop
        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/*"
        multiple
        onFiles={(f) => setFiles((prev) => [...prev, ...f])}
        hint="拖拽或点击上传图片（可多选）"
      />
      {files.length > 0 && (
        <div style={{ marginTop: 12, color: "var(--text-dim)", fontSize: ".875rem" }}>
          已选择 {files.length} 个文件
          <button
            type="button"
            className="btn btn-ghost"
            style={{ minHeight: 28, marginLeft: 8, padding: "0 .5rem" }}
            onClick={() => {
              setFiles([]);
              setRows([]);
              setError("");
            }}
          >
            重新选择
          </button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          marginTop: 16,
        }}
      >
        <div>
          <label className="label" htmlFor="q">
            质量 {(quality * 100).toFixed(0)}%
          </label>
          <input
            id="q"
            className="range"
            type="range"
            min={0.2}
            max={1}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="label" htmlFor="fmt">
            输出格式
          </label>
          <select
            id="fmt"
            className="select"
            value={format}
            onChange={(e) => setFormat(e.target.value as OutputFormat)}
          >
            <option value="image/jpeg">JPEG（推荐压缩）</option>
            <option value="image/webp">WebP</option>
            <option value="image/png">PNG（通常更大）</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="mw">
            最大宽度（0 = 原尺寸）
          </label>
          <input
            id="mw"
            className="input"
            type="number"
            min={0}
            placeholder="例如 1920"
            value={maxWidth || ""}
            onChange={(e) => setMaxWidth(Number(e.target.value) || 0)}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <button
          className="btn btn-primary"
          disabled={!files.length || busy}
          onClick={run}
        >
          {busy ? "处理中…" : "开始压缩"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setFiles([]);
            setRows([]);
            setError("");
          }}
          disabled={busy}
        >
          清空
        </button>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            marginTop: 12,
            color: "var(--error)",
            padding: 10,
            border: "1px solid rgba(248,113,113,.35)",
            borderRadius: 8,
            background: "rgba(248,113,113,.08)",
            fontSize: ".9rem",
          }}
        >
          {error}
        </div>
      )}

      {rows.length > 0 && (
        <div style={{ marginTop: 16, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
            <thead>
              <tr style={{ color: "var(--text-dim)", textAlign: "left" }}>
                <th style={{ padding: 8 }}>文件</th>
                <th style={{ padding: 8 }}>原大小</th>
                <th style={{ padding: 8 }}>新大小</th>
                <th style={{ padding: 8 }}>变化</th>
                <th style={{ padding: 8 }}>尺寸</th>
                <th style={{ padding: 8 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: 8, wordBreak: "break-all" }}>{r.name}</td>
                  <td style={{ padding: 8 }} className="mono">{formatBytes(r.originalSize)}</td>
                  <td style={{ padding: 8, color: "var(--success)" }} className="mono">
                    {formatBytes(r.blob.size)}
                  </td>
                  <td style={{ padding: 8 }} className="mono">
                    {r.ratio > 0 ? `-${r.ratio}%` : r.ratio < 0 ? `+${-r.ratio}%` : "—"}
                  </td>
                  <td style={{ padding: 8 }} className="mono">
                    {r.width}×{r.height}
                  </td>
                  <td style={{ padding: 8 }}>
                    <button
                      className="btn btn-secondary"
                      style={{ minHeight: 36, padding: "0 .7rem" }}
                      onClick={() => {
                        const base = r.name.replace(/\.[^.]+$/, "");
                        downloadBlob(
                          r.blob,
                          `${safeFileName(base)}-compressed.${extensionForFormat(format)}`
                        );
                      }}
                    >
                      下载
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ color: "var(--text-dim)", fontSize: ".8rem", marginTop: 8 }}>
            提示：PNG 压缩为 JPEG/WebP 通常更明显；HEIC 等浏览器无法解码的格式请先转换。
          </p>
        </div>
      )}
    </div>
  );
}
