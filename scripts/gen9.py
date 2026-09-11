from pathlib import Path
ROOT = Path(r"C:\Users\16600\toolbox")

def w(rel, content):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    if content.startswith("\n"): content = content[1:]
    p.write_text(content, encoding="utf-8")
    print("wrote", rel, p.stat().st_size)

w("src/tools/VideoInfo.tsx", r'''"use client";

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
''')

w("src/tools/VideoTrim.tsx", r'''"use client";

import { useRef, useState } from "react";
import FileDrop from "@/components/FileDrop";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function VideoTrim() {
  const [file, setFile] = useState<File | null>(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [duration, setDuration] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  async function onFile(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f); setOut(null); setError("");
    const url = URL.createObjectURL(f);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      setDuration(video.duration);
      setStart(0);
      setEnd(video.duration);
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      setError("无法读取视频，格式可能不受浏览器支持");
      URL.revokeObjectURL(url);
    };
    video.src = url;
  }

  async function run() {
    if (!file || duration <= 0) return;
    setBusy(true); setError(""); setOut(null);
    try {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = url;
      video.muted = true;
      await new Promise<void>((resolve, reject) => {
        video.onloadeddata = () => resolve();
        video.onerror = () => reject(new Error("视频加载失败"));
      });

      const w = video.videoWidth;
      const h = video.videoHeight;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("无法创建画布");
      const stream = canvas.captureStream(30);
      // try to include audio if possible
      try {
        // @ts-expect-error experimental
        const audioCtx = new AudioContext();
        const src = audioCtx.createMediaElementSource(video);
        const dest = audioCtx.createMediaStreamDestination();
        src.connect(dest);
        dest.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
      } catch { /* no audio track or blocked */ }

      const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";
      const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 2_500_000 });
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };

      const done = new Promise<Blob>((resolve) => {
        rec.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
      });

      video.currentTime = start;
      await new Promise((r) => { video.onseeked = () => r(null); });
      rec.start();
      video.play();
      const paint = () => {
        if (video.currentTime >= end || video.ended) {
          rec.stop();
          video.pause();
          return;
        }
        ctx.drawImage(video, 0, 0, w, h);
        requestAnimationFrame(paint);
      };
      requestAnimationFrame(paint);
      setOut(await done);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(humanError(e) + "（浏览器录制能力有限，建议使用桌面软件处理大视频）");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="video/*" onFiles={onFile} />
      {duration > 0 && <div style={{ marginTop: 8, color: "var(--text-dim)", fontSize: ".875rem" }}>时长约 {duration.toFixed(1)}s</div>}
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
      <p style={{ color: "var(--text-dim)", fontSize: ".85rem", marginTop: 10 }}>
        Beta：通过播放 + MediaRecorder 本地录制导出 WebM，兼容性因浏览器而异。
      </p>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy || end <= start} onClick={run}>{busy ? "截取中…" : "截取时间段"}</button>
        {out && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, `${safeFileName(file?.name.replace(/\.[^.]+$/, "") || "video")}-trim.webm`)}>
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      <video ref={videoRef} className="hidden" />
    </div>
  );
}
''')

w("src/tools/VideoExtractAudio.tsx", r'''"use client";

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
''')

w("src/tools/VideoCompress.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function VideoCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(0.5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true); setError(""); setOut(null);
    try {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = url;
      video.muted = true;
      await new Promise<void>((resolve, reject) => {
        video.onloadeddata = () => resolve();
        video.onerror = () => reject(new Error("视频加载失败"));
      });
      const w = Math.max(160, Math.round(video.videoWidth * scale));
      const h = Math.max(90, Math.round(video.videoHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("无法创建画布");
      const stream = canvas.captureStream(24);
      const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";
      const rec = new MediaRecorder(stream, {
        mimeType: mime,
        videoBitsPerSecond: Math.round(800_000 * scale + 200_000),
      });
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      const done = new Promise<Blob>((resolve) => {
        rec.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
      });
      rec.start();
      await video.play();
      const paint = () => {
        if (video.ended) {
          rec.stop();
          return;
        }
        ctx.drawImage(video, 0, 0, w, h);
        requestAnimationFrame(paint);
      };
      requestAnimationFrame(paint);
      // safety stop after duration + buffer
      setTimeout(() => {
        if (rec.state !== "inactive") rec.stop();
        video.pause();
      }, (video.duration + 0.5) * 1000);
      setOut(await done);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(humanError(e) + "（浏览器压缩能力有限，大文件可能失败）");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="video/*" onFiles={(f) => { setFile(f[0]); setOut(null); }} />
      <div style={{ marginTop: 16 }}>
        <label className="label" htmlFor="s">缩放比例：{(scale * 100).toFixed(0)}%</label>
        <input id="s" className="range" type="range" min={0.25} max={1} step={0.05} value={scale} onChange={(e) => setScale(Number(e.target.value))} />
      </div>
      <p style={{ color: "var(--text-dim)", fontSize: ".85rem", marginTop: 10 }}>
        Beta：本地降分辨率重新录制为 WebM。耗时约等于视频时长。
      </p>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "压缩中（请勿关闭页面）…" : "开始压缩"}</button>
        {out && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, `${safeFileName(file?.name.replace(/\.[^.]+$/, "") || "video")}-compressed.webm`)}>
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
''')

w("src/tools/ImagesToPdf.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { drawImageToCanvas, canvasToBlob, loadImageFromFile } from "@/lib/image";
import { buildPdfFromJpegs } from "@/lib/pdf";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function ImagesToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (!files.length) return;
    setBusy(true); setError(""); setOut(null);
    try {
      const pages: { bytes: Uint8Array; width: number; height: number }[] = [];
      for (const file of files) {
        const img = await loadImageFromFile(file);
        const canvas = drawImageToCanvas(img, img.naturalWidth, img.naturalHeight);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.globalCompositeOperation = "destination-over";
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        const blob = await canvasToBlob(canvas, "image/jpeg", 0.9);
        pages.push({
          bytes: new Uint8Array(await blob.arrayBuffer()),
          width: canvas.width,
          height: canvas.height,
        });
      }
      setOut(buildPdfFromJpegs(pages));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="image/*" multiple onFiles={(f) => setFiles((p) => [...p, ...f])} hint="上传多张图片，按顺序合并为 PDF" />
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
        <button className="btn btn-primary" disabled={!files.length || busy} onClick={run}>{busy ? "生成中…" : "生成 PDF"}</button>
        {out && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, safeFileName("images.pdf"))}>
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
''')

w("src/tools/PdfInfo.tsx", r'''"use client";

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
''')

# README
w("README.md", r'''# ToolBox

免费、隐私优先、本地处理的在线工具箱。

## 特点

- **免费使用**：无需注册 / 登录
- **隐私优先**：用户文件默认只在浏览器本地处理，不上传服务器
- **静态部署**：Next.js 静态导出，可部署到 Cloudflare Pages
- **广告预留**：Top / Sidebar / Bottom / Content 广告位已封装，当前为占位

## 本地启动

```bash
npm install
npm run dev
```

打开 http://localhost:3000

## 构建静态站点

```bash
npm run build
```

产物在 `out/` 目录，可直接托管。

## 技术栈

- Next.js 15 (App Router, `output: 'export'`)
- React 19 + TypeScript
- Tailwind CSS v4
- Web Canvas / Web Audio / Web Crypto / 自研本地 QR & PDF writer

## 工具列表

见首页与 `/tools/*` 分类页。已实现图片、开发者、文本、生成器、音频、视频（部分 Beta）、PDF 等工具。

## 隐私

见 `/privacy/`。原则：文件 → 浏览器本地处理 → 下载结果。

## 广告预留

`src/components/AdSlot.tsx` 预留：

- TopBannerAd
- SidebarAd
- BottomBannerAd
- ContentAd

后续替换组件内部即可接入 AdSense，无需改动工具逻辑。

## 已知限制

- 音频导出主要为 WAV（浏览器本地无可靠 MP3 编码器）
- 视频压缩/截取依赖 MediaRecorder，兼容性与耗时因浏览器而异（Beta）
- 部分浏览器不支持 AVIF 编码
- 超大文件受设备内存限制

## 测试

```bash
npm run lint
npm run typecheck
npm run build
npm test
```
''')

print("video+pdf+readme done")
