from pathlib import Path
ROOT = Path(r"C:\Users\16600\toolbox")

def w(rel, content):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    if content.startswith("\n"): content = content[1:]
    p.write_text(content, encoding="utf-8")
    print("wrote", rel, p.stat().st_size)

w("src/tools/ImageJoin.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { joinImages } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImageJoin() {
  const [files, setFiles] = useState<File[]>([]);
  const [direction, setDirection] = useState<"horizontal" | "vertical">("vertical");
  const [gap, setGap] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (files.length < 2) return;
    setBusy(true); setError("");
    try {
      const blob = await joinImages(files, direction, gap);
      setOut(blob);
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" multiple onFiles={(f) => setFiles((p) => [...p, ...f])} hint="上传至少两张图片" />
      {files.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: ".9rem" }}>
              <span>{i + 1}. {f.name}</span>
              <button className="btn btn-ghost" style={{ minHeight: 28, padding: "0 .5rem" }} onClick={() => setFiles(files.filter((_, j) => j !== i))}>移除</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="dir">拼接方向</label>
          <select id="dir" className="select" value={direction} onChange={(e) => setDirection(e.target.value as "horizontal" | "vertical")}>
            <option value="vertical">垂直</option>
            <option value="horizontal">水平</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="gap">间距（px）</label>
          <input id="gap" className="input" type="number" min={0} value={gap} onChange={(e) => setGap(Math.max(0, Number(e.target.value) || 0))} />
        </div>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={files.length < 2 || busy} onClick={run}>{busy ? "拼接中…" : "拼接"}</button>
        {out && <button className="btn btn-secondary" onClick={() => downloadBlob(out, safeFileName("joined.png"))}>下载 PNG</button>}
        <button className="btn btn-ghost" onClick={() => { setFiles([]); setOut(null); }}>清空</button>
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {out && <div style={{ marginTop: 12, color: "var(--text-muted)" }}>已生成 {formatBytes(out.size)}</div>}
    </div>
  );
}
''')

w("src/tools/ImageSplit.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { splitImage } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImageSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [parts, setParts] = useState<{ blob: Blob; name: string }[]>([]);

  async function run() {
    if (!file) return;
    setBusy(true); setError(""); setParts([]);
    try {
      const result = await splitImage(file, cols, rows);
      setParts(result.map((p) => ({ blob: p.blob, name: p.name })));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" onFiles={(f) => { setFile(f[0]); setParts([]); }} />
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="cols">列数</label>
          <input id="cols" className="input" type="number" min={1} max={20} value={cols} onChange={(e) => setCols(Math.max(1, Number(e.target.value) || 1))} />
        </div>
        <div>
          <label className="label" htmlFor="rows">行数</label>
          <input id="rows" className="input" type="number" min={1} max={20} value={rows} onChange={(e) => setRows(Math.max(1, Number(e.target.value) || 1))} />
        </div>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "分割中…" : "分割"}</button>
        {parts.length > 0 && (
          <button className="btn btn-secondary" onClick={() => {
            parts.forEach((p, i) => setTimeout(() => downloadBlob(p.blob, `${safeFileName(file!.name.replace(/\.[^.]+$/, ""))}-${p.name}`), i * 150));
          }}>下载全部</button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {parts.length > 0 && (
        <div style={{ marginTop: 12, color: "var(--text-muted)" }}>已生成 {parts.length} 张切片 · 合计约 {formatBytes(parts.reduce((s, p) => s + p.blob.size, 0))}</div>
      )}
    </div>
  );
}
''')

w("src/tools/ImageWatermark.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { addTextWatermark, type WatermarkPosition } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

const positions: { id: WatermarkPosition; label: string }[] = [
  { id: "tl", label: "左上" }, { id: "tc", label: "上中" }, { id: "tr", label: "右上" },
  { id: "ml", label: "左中" }, { id: "mc", label: "正中" }, { id: "mr", label: "右中" },
  { id: "bl", label: "左下" }, { id: "bc", label: "下中" }, { id: "br", label: "右下" },
];

export default function ImageWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("© ToolBox");
  const [opacity, setOpacity] = useState(0.4);
  const [fontSize, setFontSize] = useState(0);
  const [position, setPosition] = useState<WatermarkPosition>("br");
  const [color, setColor] = useState("#ffffff");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true); setError("");
    try {
      const blob = await addTextWatermark(file, text, {
        opacity,
        position,
        color,
        fontSize: fontSize || undefined,
        format: "image/png",
      });
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
      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="wm">水印文字</label>
          <input id="wm" className="input" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
          <div>
            <label className="label" htmlFor="op">透明度 {(opacity * 100).toFixed(0)}%</label>
            <input id="op" className="range" type="range" min={0.05} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
          </div>
          <div>
            <label className="label" htmlFor="fs">字号（0=自动）</label>
            <input id="fs" className="input" type="number" min={0} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value) || 0)} />
          </div>
          <div>
            <label className="label" htmlFor="color">颜色</label>
            <input id="color" className="input" type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ padding: 6, height: 44 }} />
          </div>
        </div>
        <div>
          <span className="label">位置</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {positions.map((p) => (
              <button key={p.id} type="button" className={`btn ${position === p.id ? "btn-primary" : "btn-secondary"}`} style={{ minHeight: 36, padding: "0 .65rem" }} onClick={() => setPosition(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || !text.trim() || busy} onClick={run}>{busy ? "处理中…" : "添加水印"}</button>
        {out && file && <button className="btn btn-secondary" onClick={() => downloadBlob(out, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}-watermark.png`)}>下载</button>}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {out && <div style={{ marginTop: 12, color: "var(--text-muted)" }}>已生成 {formatBytes(out.size)}</div>}
    </div>
  );
}
''')

w("src/tools/ImageExif.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { stripExifViaReencode } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImageExif() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<{ name: string; before: number; blob: Blob }[]>([]);

  async function run() {
    if (!files.length) return;
    setBusy(true); setError(""); setResults([]);
    try {
      const out = [];
      for (const f of files) {
        const blob = await stripExifViaReencode(f);
        out.push({ name: f.name, before: f.size, blob });
      }
      setResults(out);
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" multiple onFiles={(f) => setFiles((p) => [...p, ...f])} />
      {files.length > 0 && <div style={{ marginTop: 10, color: "var(--text-dim)", fontSize: ".875rem" }}>已选择 {files.length} 张图片</div>}
      <p style={{ color: "var(--text-muted)", fontSize: ".875rem", marginTop: 12 }}>
        通过重新编码图片移除 EXIF 等元数据（位置、设备型号等）。画质可能有轻微变化。
      </p>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!files.length || busy} onClick={run}>{busy ? "处理中…" : "去除元数据"}</button>
        <button className="btn btn-secondary" onClick={() => { setFiles([]); setResults([]); }}>清空</button>
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {results.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {results.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
              <span>{r.name} · {formatBytes(r.before)} → {formatBytes(r.blob.size)}</span>
              <button className="btn btn-secondary" style={{ minHeight: 36 }} onClick={() => downloadBlob(r.blob, `${safeFileName(r.name.replace(/\.[^.]+$/, ""))}-clean.jpg`)}>下载</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
''')

w("src/tools/ImageColors.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import CopyButton from "@/components/CopyButton";
import { extractPalette } from "@/lib/image";
import { humanError } from "@/lib/utils";

export default function ImageColors() {
  const [file, setFile] = useState<File | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(f: File) {
    setBusy(true); setError("");
    try {
      const palette = await extractPalette(f, 8);
      setColors(palette);
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" onFiles={(f) => { setFile(f[0]); if (f[0]) run(f[0]); }} />
      {busy && <div style={{ marginTop: 12, color: "var(--text-dim)" }}>提取颜色中…</div>}
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {colors.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))" }}>
            {colors.map((c) => (
              <div key={c} className="card" style={{ overflow: "hidden" }}>
                <div style={{ height: 64, background: c }} />
                <div style={{ padding: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                  <span className="mono" style={{ fontSize: ".85rem" }}>{c.toUpperCase()}</span>
                  <CopyButton value={c.toUpperCase()} label="复制" className="btn btn-ghost" />
                </div>
              </div>
            ))}
          </div>
          {file && <div style={{ marginTop: 10, color: "var(--text-dim)", fontSize: ".85rem" }}>来自：{file.name}</div>}
        </div>
      )}
    </div>
  );
}
''')

w("src/tools/ImageBase64.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import CopyButton from "@/components/CopyButton";
import { dataUrlToBlob, fileToDataUrl } from "@/lib/image";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImageBase64() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [dataUrl, setDataUrl] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function encode(f: File) {
    setError("");
    try {
      const url = await fileToDataUrl(f);
      setDataUrl(url);
      setFile(f);
    } catch (e) {
      setError(humanError(e));
    }
  }

  function decode() {
    setError("");
    try {
      const value = input.trim();
      if (!value) throw new Error("请粘贴 Base64 或 Data URL");
      const dataUrl = value.startsWith("data:") ? value : `data:image/png;base64,${value}`;
      const blob = dataUrlToBlob(dataUrl);
      downloadBlob(blob, safeFileName("decoded-image.png", "image"));
    } catch (e) {
      setError(humanError(e));
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button className={`btn ${mode === "encode" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("encode")}>图片 → Base64</button>
        <button className={`btn ${mode === "decode" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("decode")}>Base64 → 图片</button>
      </div>
      {mode === "encode" ? (
        <>
          <FileDrop accept="image/*" onFiles={(f) => encode(f[0])} />
          {file && <div style={{ marginTop: 10, color: "var(--text-dim)", fontSize: ".875rem" }}>{file.name} · {formatBytes(file.size)}</div>}
          {dataUrl && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
                <span className="label" style={{ margin: 0 }}>Data URL</span>
                <CopyButton value={dataUrl} />
              </div>
              <textarea className="textarea" readOnly value={dataUrl} style={{ minHeight: 120 }} />
            </div>
          )}
        </>
      ) : (
        <>
          <label className="label" htmlFor="b64">粘贴 Base64 字符串或 Data URL</label>
          <textarea id="b64" className="textarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder="data:image/png;base64,iVBOR..." />
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={decode}>解码并下载图片</button>
          </div>
        </>
      )}
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
''')

w("src/tools/ImageInfo.tsx", r'''"use client";

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
''')

print("image tools batch2 done")
