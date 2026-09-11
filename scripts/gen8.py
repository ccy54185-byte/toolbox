from pathlib import Path
ROOT = Path(r"C:\Users\16600\toolbox")

def w(rel, content):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    if content.startswith("\n"): content = content[1:]
    p.write_text(content, encoding="utf-8")
    print("wrote", rel, p.stat().st_size)

w("src/tools/AudioInfo.tsx", r'''"use client";

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
''')

w("src/tools/AudioTrim.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { audioBufferToWav, decodeAudioFile, trimAudioBuffer } from "@/lib/audio";
import { downloadBlob, formatBytes, formatDuration, humanError, safeFileName } from "@/lib/utils";

export default function AudioTrim() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function onFile(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f); setOut(null); setError("");
    try {
      const buf = await decodeAudioFile(f);
      setDuration(buf.duration);
      setStart(0);
      setEnd(Number(buf.duration.toFixed(2)));
    } catch (e) {
      setError(humanError(e));
    }
  }

  async function run() {
    if (!file) return;
    setBusy(true); setError("");
    try {
      const buf = await decodeAudioFile(file);
      const trimmed = trimAudioBuffer(buf, start, end);
      setOut(audioBufferToWav(trimmed));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="audio/*" onFiles={onFile} />
      {duration > 0 && (
        <div style={{ marginTop: 10, color: "var(--text-dim)", fontSize: ".875rem" }}>
          时长 {formatDuration(duration)} · {file?.name}
        </div>
      )}
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
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "处理中…" : "裁剪并导出 WAV"}</button>
        {out && file && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}-trim.wav`)}>
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
''')

w("src/tools/AudioVolume.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { applyGain, audioBufferToWav, decodeAudioFile } from "@/lib/audio";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function AudioVolume() {
  const [file, setFile] = useState<File | null>(null);
  const [gain, setGain] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true); setError("");
    try {
      const buf = await decodeAudioFile(file);
      const result = applyGain(buf, gain);
      setOut(audioBufferToWav(result));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="audio/*" onFiles={(f) => { setFile(f[0]); setOut(null); }} />
      <div style={{ marginTop: 16 }}>
        <label className="label" htmlFor="g">增益：{gain.toFixed(2)}×（1 = 原音量）</label>
        <input id="g" className="range" type="range" min={0.1} max={3} step={0.05} value={gain} onChange={(e) => setGain(Number(e.target.value))} />
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "处理中…" : "应用并导出"}</button>
        {out && file && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}-vol.wav`)}>
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
''')

w("src/tools/AudioFade.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { applyFade, audioBufferToWav, decodeAudioFile } from "@/lib/audio";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function AudioFade() {
  const [file, setFile] = useState<File | null>(null);
  const [fadeIn, setFadeIn] = useState(1);
  const [fadeOut, setFadeOut] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true); setError("");
    try {
      const buf = await decodeAudioFile(file);
      setOut(audioBufferToWav(applyFade(buf, fadeIn, fadeOut)));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="audio/*" onFiles={(f) => { setFile(f[0]); setOut(null); }} />
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="fi">淡入（秒）</label>
          <input id="fi" className="input" type="number" min={0} step={0.1} value={fadeIn} onChange={(e) => setFadeIn(Math.max(0, Number(e.target.value) || 0))} />
        </div>
        <div>
          <label className="label" htmlFor="fo">淡出（秒）</label>
          <input id="fo" className="input" type="number" min={0} step={0.1} value={fadeOut} onChange={(e) => setFadeOut(Math.max(0, Number(e.target.value) || 0))} />
        </div>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "处理中…" : "应用并导出"}</button>
        {out && file && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}-fade.wav`)}>
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
''')

w("src/tools/AudioMerge.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { audioBufferToWav, decodeAudioFile, mergeAudioBuffers } from "@/lib/audio";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function AudioMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (files.length < 2) return;
    setBusy(true); setError("");
    try {
      const buffers = await Promise.all(files.map((f) => decodeAudioFile(f)));
      setOut(audioBufferToWav(mergeAudioBuffers(buffers)));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="audio/*" multiple onFiles={(f) => setFiles((p) => [...p, ...f])} hint="上传至少两个音频，按顺序合并" />
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
        <button className="btn btn-primary" disabled={files.length < 2 || busy} onClick={run}>{busy ? "合并中…" : "合并并导出"}</button>
        {out && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, safeFileName("merged.wav"))}>
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
''')

w("src/tools/AudioConvert.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { audioBufferToWav, decodeAudioFile } from "@/lib/audio";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function AudioConvert() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true); setError("");
    try {
      const buf = await decodeAudioFile(file);
      setOut(audioBufferToWav(buf));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="audio/*" onFiles={(f) => { setFile(f[0]); setOut(null); }} />
      <p style={{ color: "var(--text-muted)", fontSize: ".875rem", marginTop: 12 }}>
        浏览器本地将可解码音频重编码为 WAV。不支持所有专业音频格式（如部分无损/DRM）。
      </p>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "转换中…" : "转换为 WAV"}</button>
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

w("src/tools/AudioCompressor.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { audioBufferToWav, decodeAudioFile, resampleBuffer } from "@/lib/audio";
import { downloadBlob, formatBytes, humanError, safeFileName } from "@/lib/utils";

export default function AudioCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [rate, setRate] = useState(22050);
  const [mono, setMono] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true); setError("");
    try {
      const buf = await decodeAudioFile(file);
      const compressed = await resampleBuffer(buf, rate, mono);
      setOut(audioBufferToWav(compressed));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="audio/*" onFiles={(f) => { setFile(f[0]); setOut(null); }} />
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="sr">目标采样率</label>
          <select id="sr" className="select" value={rate} onChange={(e) => setRate(Number(e.target.value))}>
            <option value={44100}>44100 Hz</option>
            <option value={22050}>22050 Hz</option>
            <option value={16000}>16000 Hz</option>
            <option value={8000}>8000 Hz</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "end" }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--text-muted)", paddingBottom: 10 }}>
            <input type="checkbox" checked={mono} onChange={(e) => setMono(e.target.checked)} />
            转为单声道
          </label>
        </div>
      </div>
      <p style={{ color: "var(--text-dim)", fontSize: ".85rem", marginTop: 10 }}>
        通过降采样与单声道化减小 WAV 体积（Beta：浏览器重编码能力有限）。
      </p>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "处理中…" : "压缩并导出"}</button>
        {out && file && (
          <button className="btn btn-secondary" onClick={() => downloadBlob(out, `${safeFileName(file.name.replace(/\.[^.]+$/, ""))}-small.wav`)}>
            下载（{formatBytes(out.size)}）
          </button>
        )}
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
    </div>
  );
}
''')

w("src/tools/AudioSilence.tsx", r'''"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { decodeAudioFile, extractSilenceRanges } from "@/lib/audio";
import { formatDuration, humanError } from "@/lib/utils";

export default function AudioSilence() {
  const [file, setFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState(-40);
  const [minSec, setMinSec] = useState(0.4);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ranges, setRanges] = useState<{ start: number; end: number }[]>([]);

  async function run() {
    if (!file) return;
    setBusy(true); setError(""); setRanges([]);
    try {
      const buf = await decodeAudioFile(file);
      setRanges(await extractSilenceRanges(buf, threshold, minSec));
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileDrop accept="audio/*" onFiles={(f) => { setFile(f[0]); setRanges([]); }} />
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", marginTop: 16 }}>
        <div>
          <label className="label" htmlFor="th">阈值（dB）</label>
          <input id="th" className="input" type="number" min={-80} max={-10} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
        </div>
        <div>
          <label className="label" htmlFor="min">最短静音（秒）</label>
          <input id="min" className="input" type="number" min={0.05} step={0.05} value={minSec} onChange={(e) => setMinSec(Number(e.target.value) || 0.05)} />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>{busy ? "分析中…" : "检测静音"}</button>
      </div>
      {error && <div style={{ marginTop: 12, color: "var(--error)" }}>{error}</div>}
      {ranges.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div className="label">检测到 {ranges.length} 段静音</div>
          <div className="card" style={{ maxHeight: 260, overflow: "auto" }}>
            {ranges.map((r, i) => (
              <div key={i} className="mono" style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontSize: ".85rem" }}>
                #{i + 1}  {formatDuration(r.start)} → {formatDuration(r.end)}  （{(r.end - r.start).toFixed(2)}s）
              </div>
            ))}
          </div>
        </div>
      )}
      {!busy && file && ranges.length === 0 && !error && (
        <div style={{ marginTop: 10, color: "var(--text-dim)", fontSize: ".875rem" }}>尚未检测，或未发现符合条件的静音。</div>
      )}
    </div>
  );
}
''')

print("audio tools done")
