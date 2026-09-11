"use client";

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
