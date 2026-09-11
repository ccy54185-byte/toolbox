/** Local Web Audio helpers. No network, no upload. */

export async function decodeAudioFile(file: File): Promise<AudioBuffer> {
  const arrayBuffer = await file.arrayBuffer();
  const ctx = new OfflineAudioContext(1, 1, 44100);
  try {
    return await ctx.decodeAudioData(arrayBuffer.slice(0));
  } catch {
    throw new Error("无法解码该音频，浏览器可能不支持此格式");
  }
}

export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = length * blockAlign;
  const headerSize = 44;
  const arrayBuffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) channels.push(buffer.getChannelData(c));

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([arrayBuffer], { type: "audio/wav" });
}

export function trimAudioBuffer(
  buffer: AudioBuffer,
  startSec: number,
  endSec: number
): AudioBuffer {
  const sr = buffer.sampleRate;
  const start = Math.max(0, Math.floor(startSec * sr));
  const end = Math.min(buffer.length, Math.floor(endSec * sr));
  if (end <= start) throw new Error("结束时间必须大于开始时间");
  const length = end - start;
  const ctx = new OfflineAudioContext(buffer.numberOfChannels, length, sr);
  const out = ctx.createBuffer(buffer.numberOfChannels, length, sr);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    out.copyToChannel(buffer.getChannelData(c).slice(start, end), c);
  }
  return out;
}

export function applyGain(buffer: AudioBuffer, gain: number): AudioBuffer {
  const ctx = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  const out = ctx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const src = buffer.getChannelData(c);
    const dst = out.getChannelData(c);
    for (let i = 0; i < src.length; i++) dst[i] = Math.max(-1, Math.min(1, src[i] * gain));
  }
  return out;
}

export function applyFade(
  buffer: AudioBuffer,
  fadeInSec: number,
  fadeOutSec: number
): AudioBuffer {
  const sr = buffer.sampleRate;
  const out = new AudioBuffer({
    length: buffer.length,
    numberOfChannels: buffer.numberOfChannels,
    sampleRate: sr,
  });
  const fadeIn = Math.min(buffer.length, Math.floor(fadeInSec * sr));
  const fadeOut = Math.min(buffer.length, Math.floor(fadeOutSec * sr));
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const src = buffer.getChannelData(c);
    const dst = out.getChannelData(c);
    for (let i = 0; i < src.length; i++) {
      let g = 1;
      if (i < fadeIn && fadeIn > 0) g = i / fadeIn;
      const fromEnd = buffer.length - 1 - i;
      if (fromEnd < fadeOut && fadeOut > 0) g = Math.min(g, fromEnd / fadeOut);
      dst[i] = src[i] * g;
    }
  }
  return out;
}

export function mergeAudioBuffers(buffers: AudioBuffer[]): AudioBuffer {
  if (buffers.length < 2) throw new Error("请至少上传两个音频");
  const sr = buffers[0].sampleRate;
  const ch = Math.max(...buffers.map((b) => b.numberOfChannels));
  const total = buffers.reduce((s, b) => s + b.length, 0);
  const out = new AudioBuffer({ length: total, numberOfChannels: ch, sampleRate: sr });
  let offset = 0;
  for (const buf of buffers) {
    for (let c = 0; c < ch; c++) {
      const src = buf.getChannelData(Math.min(c, buf.numberOfChannels - 1));
      out.getChannelData(c).set(src, offset);
    }
    offset += buf.length;
  }
  return out;
}

export async function resampleBuffer(
  buffer: AudioBuffer,
  targetRate: number,
  mono: boolean
): Promise<AudioBuffer> {
  const channels = mono ? 1 : buffer.numberOfChannels;
  const ctx = new OfflineAudioContext(
    channels,
    Math.ceil(buffer.duration * targetRate),
    targetRate
  );
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  if (mono && buffer.numberOfChannels > 1) {
    const g = ctx.createGain();
    g.gain.value = 1 / buffer.numberOfChannels;
    source.connect(g);
    g.connect(ctx.destination);
  } else {
    source.connect(ctx.destination);
  }
  source.start();
  return await ctx.startRendering();
}

export async function extractSilenceRanges(
  buffer: AudioBuffer,
  thresholdDb = -40,
  minSilenceSec = 0.4
): Promise<{ start: number; end: number }[]> {
  const data = buffer.getChannelData(0);
  const sr = buffer.sampleRate;
  const threshold = Math.pow(10, thresholdDb / 20);
  const minLen = Math.floor(minSilenceSec * sr);
  const ranges: { start: number; end: number }[] = [];
  let start = -1;
  for (let i = 0; i < data.length; i++) {
    const silent = Math.abs(data[i]) < threshold;
    if (silent && start < 0) start = i;
    if ((!silent || i === data.length - 1) && start >= 0) {
      const end = silent ? i + 1 : i;
      if (end - start >= minLen) {
        ranges.push({ start: start / sr, end: end / sr });
      }
      start = -1;
    }
  }
  return ranges;
}

export interface AudioInfo {
  duration: number;
  sampleRate: number;
  channels: number;
  size: number;
  name: string;
  type: string;
}

export async function readAudioInfo(file: File): Promise<AudioInfo> {
  const buffer = await decodeAudioFile(file);
  return {
    duration: buffer.duration,
    sampleRate: buffer.sampleRate,
    channels: buffer.numberOfChannels,
    size: file.size,
    name: file.name,
    type: file.type || "audio/*",
  };
}

export async function readVideoInfo(file: File): Promise<{
  duration: number;
  width: number;
  height: number;
  size: number;
  name: string;
  type: string;
}> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        size: file.size,
        name: file.name,
        type: file.type || "video/*",
      });
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("无法读取视频信息，格式可能不受浏览器支持"));
    };
    video.src = url;
  });
}
