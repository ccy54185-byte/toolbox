"use client";

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
