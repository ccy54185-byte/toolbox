from pathlib import Path

ROOT = Path(r"C:\Users\16600\toolbox")

def w(rel: str, content: str):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    if content.startswith("\n"):
        content = content[1:]
    p.write_text(content, encoding="utf-8")
    print("wrote", rel, p.stat().st_size)

# shared result panel helper used by many tools - keep inline in each file to avoid extra deps

w("src/tools/ImageCompressor.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import CopyButton from "@/components/CopyButton";
import { convertImageBlob, extensionForFormat, type OutputFormat } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

type Row = {
  name: string;
  originalSize: number;
  blob: Blob;
  width: number;
  height: number;
};

export default function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [maxWidth, setMaxWidth] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Row[]>([]);

  async function run() {
    if (!files.length) return;
    setBusy(true);
    setError("");
    setRows([]);
    try {
      const out: Row[] = [];
      for (const file of files) {
        let source: File | Blob = file;
        if (maxWidth > 0) {
          const { resizeImageBlob } = await import("@/lib/image");
          const resized = await resizeImageBlob(file, {
            width: maxWidth,
            keepRatio: true,
            format,
            quality,
          });
          source = resized.blob;
        }
        const srcFile =
          source instanceof File
            ? source
            : new File([source], file.name, { type: file.type });
        const result = await convertImageBlob(srcFile, format, quality);
        out.push({
          name: file.name,
          originalSize: file.size,
          blob: result.blob,
          width: result.width,
          height: result.height,
        });
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
        accept="image/*"
        multiple
        onFiles={(f) => setFiles((prev) => [...prev, ...f])}
        hint="拖拽或点击上传图片（可多选）"
      />
      {files.length > 0 && (
        <div style={{ marginTop: 12, color: "var(--text-dim)", fontSize: ".875rem" }}>
          已选择 {files.length} 个文件
        </div>
      )}

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="q">质量 {(quality * 100).toFixed(0)}%</label>
          <input id="q" className="range" type="range" min={0.3} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
        </div>
        <div>
          <label className="label" htmlFor="fmt">输出格式</label>
          <select id="fmt" className="select" value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)}>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
            <option value="image/png">PNG</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="mw">最大宽度（0=不缩放）</label>
          <input id="mw" className="input" type="number" min={0} value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value) || 0)} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!files.length || busy} onClick={run}>
          {busy ? "处理中…" : "开始压缩"}
        </button>
        <button className="btn btn-secondary" onClick={() => { setFiles([]); setRows([]); }} disabled={busy}>清空</button>
      </div>

      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}

      {rows.length > 0 && (
        <div style={{ marginTop: 16, overflowX: "auto" }}>
          <table className="w-full" style={{ borderCollapse: "collapse", fontSize: ".9rem" }}>
            <thead>
              <tr style={{ color: "var(--text-dim)", textAlign: "left" }}>
                <th style={{ padding: 8 }}>文件</th>
                <th style={{ padding: 8 }}>原大小</th>
                <th style={{ padding: 8 }}>新大小</th>
                <th style={{ padding: 8 }}>尺寸</th>
                <th style={{ padding: 8 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: 8 }}>{r.name}</td>
                  <td style={{ padding: 8 }}>{formatBytes(r.originalSize)}</td>
                  <td style={{ padding: 8, color: "var(--success)" }}>{formatBytes(r.blob.size)}</td>
                  <td style={{ padding: 8 }} className="mono">{r.width}×{r.height}</td>
                  <td style={{ padding: 8 }}>
                    <button
                      className="btn btn-secondary"
                      style={{ minHeight: 36, padding: "0 .7rem" }}
                      onClick={() => {
                        const base = r.name.replace(/\.[^.]+$/, "");
                        downloadBlob(r.blob, `${safeFileName(base)}-compressed.${extensionForFormat(format)}`);
                      }}
                    >
                      下载
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
''')

w("src/tools/ImageConverter.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { convertImageBlob, extensionForFormat, type OutputFormat } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputFormat>("image/webp");
  const [quality, setQuality] = useState(0.92);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<{ blob: Blob; width: number; height: number } | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const result = await convertImageBlob(file, format, quality);
      setOut(result);
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" onFiles={(f) => setFile(f[0])} />
      {file && (
        <div style={{ marginTop: 10, fontSize: ".875rem", color: "var(--text-dim)" }}>
          {file.name} · {formatBytes(file.size)} · {file.type || "未知格式"}
        </div>
      )}
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="fmt">目标格式</label>
          <select id="fmt" className="select" value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)}>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
        {format !== "image/png" && (
          <div>
            <label className="label" htmlFor="q">质量 {(quality * 100).toFixed(0)}%</label>
            <input id="q" className="range" type="range" min={0.3} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
          </div>
        )}
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "转换中…" : "转换"}</button>
        {out && file && (
          <button
            className="btn btn-secondary"
            onClick={() => downloadBlob(out.blob, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}.${extensionForFormat(format)}`)}
          >
            下载结果
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {out && (
        <div style={{ marginTop: 12, color: "var(--text-muted)", fontSize: ".9rem" }}>
          已生成：{formatBytes(out.blob.size)} · {out.width}×{out.height}
        </div>
      )}
    </div>
  );
}
''')

w("src/tools/ImageResizer.tsx", r'''"use client";

import { useEffect, useState } from "react";
import FileDrop from "@/components/FileDrop";
import { extensionForFormat, loadImageFromFile, resizeImageBlob, type OutputFormat } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [nw, setNw] = useState(0);
  const [nh, setNh] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepRatio, setKeepRatio] = useState(true);
  const [format, setFormat] = useState<OutputFormat>("image/png");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<{ blob: Blob; width: number; height: number } | null>(null);

  useEffect(() => {
    if (!file) return;
    loadImageFromFile(file)
      .then((img) => {
        setNw(img.naturalWidth);
        setNh(img.naturalHeight);
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
      })
      .catch((e) => setError(humanError(e)));
  }, [file]);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const result = await resizeImageBlob(file, {
        width,
        height,
        keepRatio,
        format,
        quality: 0.92,
      });
      setOut(result);
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" onFiles={(f) => setFile(f[0])} />
      {nw > 0 && (
        <div style={{ marginTop: 10, fontSize: ".875rem", color: "var(--text-dim)" }}>
          原图：{nw}×{nh} · {file ? formatBytes(file.size) : ""}
        </div>
      )}
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="w">宽度</label>
          <input id="w" className="input" type="number" min={1} value={width || ""} onChange={(e) => {
            const v = Number(e.target.value) || 0;
            setWidth(v);
            if (keepRatio && nw) setHeight(Math.max(1, Math.round((nh / nw) * v)));
          }} />
        </div>
        <div>
          <label className="label" htmlFor="h">高度</label>
          <input id="h" className="input" type="number" min={1} value={height || ""} onChange={(e) => {
            const v = Number(e.target.value) || 0;
            setHeight(v);
            if (keepRatio && nh) setWidth(Math.max(1, Math.round((nw / nh) * v)));
          }} />
        </div>
        <div>
          <label className="label" htmlFor="fmt">输出格式</label>
          <select id="fmt" className="select" value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)}>
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
      </div>
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12, color: "var(--text-muted)" }}>
        <input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} />
        保持宽高比
      </label>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "处理中…" : "调整尺寸"}</button>
        {out && file && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out.blob, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}-${out.width}x${out.height}.${extensionForFormat(format)}`)}>
            下载
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {out && <div style={{ marginTop: 12, color: "var(--text-muted)" }}>输出：{out.width}×{out.height} · {formatBytes(out.blob.size)}</div>}
    </div>
  );
}
''')

w("src/tools/ImageRotate.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { extensionForFormat, rotateImageBlob, type OutputFormat } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImageRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [degrees, setDegrees] = useState<90 | 180 | 270>(90);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const blob = await rotateImageBlob(file, degrees, flipH, flipV, "image/png");
      setOut(blob);
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" onFiles={(f) => { setFile(f[0]); setOut(null); }} />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
        {([90, 180, 270] as const).map((d) => (
          <button key={d} type="button" className={`btn ${degrees === d ? "btn-primary" : "btn-secondary"}`} onClick={() => setDegrees(d)}>
            旋转 {d}°
          </button>
        ))}
        <button type="button" className={`btn ${flipH ? "btn-primary" : "btn-secondary"}`} onClick={() => setFlipH(!flipH)}>水平翻转</button>
        <button type="button" className={`btn ${flipV ? "btn-primary" : "btn-secondary"}`} onClick={() => setFlipV(!flipV)}>垂直翻转</button>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "处理中…" : "应用"}</button>
        {out && file && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}-rotated.${extensionForFormat("image/png")}`)}>下载</button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {out && <div style={{ marginTop: 12, color: "var(--text-muted)" }}>已生成 {formatBytes(out.size)}</div>}
    </div>
  );
}
''')

print("part1 tools ok")
