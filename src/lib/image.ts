/** All processing is local. Never upload user files. */

export type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    return await loadImageFromUrl(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("无法解码该图片"));
    img.src = url;
  });
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("导出图片失败"));
      },
      type,
      quality
    );
  });
}

export function drawImageToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法创建画布上下文");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function normalizeFormat(type: string): OutputFormat {
  if (type === "image/png") return "image/png";
  if (type === "image/webp") return "image/webp";
  return "image/jpeg";
}

export function extensionForFormat(type: OutputFormat): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

function fillWhiteBehind(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";
}

export async function convertImageBlob(
  file: File,
  target: OutputFormat,
  quality = 0.92
): Promise<{ blob: Blob; width: number; height: number }> {
  const img = await loadImageFromFile(file);
  const canvas = drawImageToCanvas(img, img.naturalWidth, img.naturalHeight);
  if (target === "image/jpeg") fillWhiteBehind(canvas);
  const q = target === "image/png" ? undefined : quality;
  const blob = await canvasToBlob(canvas, target, q);
  return { blob, width: canvas.width, height: canvas.height };
}

export async function resizeImageBlob(
  file: File,
  opts: {
    width?: number;
    height?: number;
    scale?: number;
    keepRatio?: boolean;
    format?: OutputFormat;
    quality?: number;
  }
): Promise<{ blob: Blob; width: number; height: number }> {
  const img = await loadImageFromFile(file);
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  let tw = nw;
  let th = nh;

  if (opts.scale && opts.scale > 0) {
    tw = Math.max(1, Math.round(nw * opts.scale));
    th = Math.max(1, Math.round(nh * opts.scale));
  } else if (opts.keepRatio !== false) {
    if (opts.width && opts.height) {
      const ratio = Math.min(opts.width / nw, opts.height / nh);
      tw = Math.max(1, Math.round(nw * ratio));
      th = Math.max(1, Math.round(nh * ratio));
    } else if (opts.width) {
      tw = Math.max(1, opts.width);
      th = Math.max(1, Math.round((nh / nw) * tw));
    } else if (opts.height) {
      th = Math.max(1, opts.height);
      tw = Math.max(1, Math.round((nw / nh) * th));
    }
  } else {
    tw = Math.max(1, opts.width || nw);
    th = Math.max(1, opts.height || nh);
  }

  const canvas = drawImageToCanvas(img, tw, th);
  const format = normalizeFormat(opts.format || file.type || "image/jpeg");
  if (format === "image/jpeg") fillWhiteBehind(canvas);
  const blob = await canvasToBlob(
    canvas,
    format,
    format === "image/png" ? undefined : opts.quality ?? 0.92
  );
  return { blob, width: tw, height: th };
}

export async function rotateImageBlob(
  file: File,
  degrees: 90 | 180 | 270,
  flipH = false,
  flipV = false,
  format?: OutputFormat,
  quality = 0.92
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  const swap = degrees === 90 || degrees === 270;
  const canvas = document.createElement("canvas");
  canvas.width = swap ? nh : nw;
  canvas.height = swap ? nw : nh;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法创建画布上下文");
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((degrees * Math.PI) / 180);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(img, -nw / 2, -nh / 2, nw, nh);
  ctx.restore();
  const outFormat = normalizeFormat(format || file.type || "image/png");
  if (outFormat === "image/jpeg") fillWhiteBehind(canvas);
  return canvasToBlob(
    canvas,
    outFormat,
    outFormat === "image/png" ? undefined : quality
  );
}

export type WatermarkPosition =
  | "tl"
  | "tc"
  | "tr"
  | "ml"
  | "mc"
  | "mr"
  | "bl"
  | "bc"
  | "br";

export async function addTextWatermark(
  file: File,
  text: string,
  opts: {
    position?: WatermarkPosition;
    opacity?: number;
    fontSize?: number;
    color?: string;
    format?: OutputFormat;
    quality?: number;
  } = {}
): Promise<Blob> {
  if (!text.trim()) throw new Error("请输入水印文字");
  const img = await loadImageFromFile(file);
  const canvas = drawImageToCanvas(img, img.naturalWidth, img.naturalHeight);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法创建画布上下文");

  const fontPx = opts.fontSize ?? Math.max(16, Math.round(canvas.width * 0.04));
  const opacity = opts.opacity ?? 0.35;
  const color = opts.color ?? "#ffffff";
  const position = opts.position ?? "br";
  const margin = Math.max(12, Math.round(canvas.width * 0.02));

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.font = `600 ${fontPx}px system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 4;
  const tw = ctx.measureText(text).width;
  const th = fontPx;
  const midX = (canvas.width - tw) / 2;
  const midY = canvas.height / 2;
  const rightX = canvas.width - margin - tw;
  const bottomY = canvas.height - margin - th / 2;

  const map: Record<WatermarkPosition, [number, number]> = {
    tl: [margin, margin + th / 2],
    tc: [midX, margin + th / 2],
    tr: [rightX, margin + th / 2],
    ml: [margin, midY],
    mc: [midX, midY],
    mr: [rightX, midY],
    bl: [margin, bottomY],
    bc: [midX, bottomY],
    br: [rightX, bottomY],
  };
  const [x, y] = map[position] || map.br;
  ctx.fillText(text, x, y);
  ctx.restore();

  const outFormat = normalizeFormat(opts.format || "image/png");
  return canvasToBlob(
    canvas,
    outFormat,
    outFormat === "image/png" ? undefined : opts.quality ?? 0.92
  );
}

export async function joinImages(
  files: File[],
  direction: "horizontal" | "vertical",
  gap = 0
): Promise<Blob> {
  if (files.length < 2) throw new Error("请至少上传两张图片");
  const imgs = await Promise.all(files.map((f) => loadImageFromFile(f)));
  let width = 0;
  let height = 0;
  if (direction === "horizontal") {
    width =
      imgs.reduce((s, i) => s + i.naturalWidth, 0) + gap * (imgs.length - 1);
    height = Math.max(...imgs.map((i) => i.naturalHeight));
  } else {
    width = Math.max(...imgs.map((i) => i.naturalWidth));
    height =
      imgs.reduce((s, i) => s + i.naturalHeight, 0) + gap * (imgs.length - 1);
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法创建画布上下文");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let offset = 0;
  for (const img of imgs) {
    if (direction === "horizontal") {
      const y = (canvas.height - img.naturalHeight) / 2;
      ctx.drawImage(img, offset, y);
      offset += img.naturalWidth + gap;
    } else {
      const x = (canvas.width - img.naturalWidth) / 2;
      ctx.drawImage(img, x, offset);
      offset += img.naturalHeight + gap;
    }
  }
  return canvasToBlob(canvas, "image/png");
}

export async function cropImageBlob(
  file: File,
  crop: { x: number; y: number; w: number; h: number },
  format?: OutputFormat,
  quality = 0.92
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const x = Math.max(0, Math.round(crop.x));
  const y = Math.max(0, Math.round(crop.y));
  const w = Math.max(1, Math.round(crop.w));
  const h = Math.max(1, Math.round(crop.h));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法创建画布上下文");
  ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
  const outFormat = normalizeFormat(format || file.type || "image/png");
  if (outFormat === "image/jpeg") fillWhiteBehind(canvas);
  return canvasToBlob(
    canvas,
    outFormat,
    outFormat === "image/png" ? undefined : quality
  );
}

export async function splitImage(
  file: File,
  cols: number,
  rows: number
): Promise<{ blob: Blob; index: number; name: string }[]> {
  if (cols < 1 || rows < 1 || cols * rows > 100) {
    throw new Error("行列数需在合理范围（最多 100 格）");
  }
  const img = await loadImageFromFile(file);
  const cw = Math.floor(img.naturalWidth / cols);
  const ch = Math.floor(img.naturalHeight / rows);
  if (cw < 1 || ch < 1) throw new Error("图片太小，无法按该网格分割");
  const results: { blob: Blob; index: number; name: string }[] = [];
  let index = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("无法创建画布上下文");
      ctx.drawImage(img, c * cw, r * ch, cw, ch, 0, 0, cw, ch);
      const blob = await canvasToBlob(canvas, "image/png");
      results.push({ blob, index, name: `r${r + 1}c${c + 1}.png` });
      index++;
    }
  }
  return results;
}

export function stripExifViaReencode(file: File): Promise<Blob> {
  return convertImageBlob(
    file,
    file.type === "image/png" ? "image/png" : "image/jpeg",
    0.95
  ).then((r) => r.blob);
}

export async function extractPalette(file: File, count = 8): Promise<string[]> {
  const img = await loadImageFromFile(file);
  const size = 128;
  const canvas = drawImageToCanvas(img, size, size);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("无法创建画布上下文");
  const data = ctx.getImageData(0, 0, size, size).data;
  const buckets = new Map<string, number>();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const r = data[i] >> 3;
    const g = data[i + 1] >> 3;
    const b = data[i + 2] >> 3;
    const key = `${r},${g},${b}`;
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }
  return [...buckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key]) => {
      const [r, g, b] = key.split(",").map((n) => parseInt(n, 10) << 3);
      return rgbToHex(r, g, b);
    });
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("读取文件失败"));
    reader.readAsDataURL(file);
  });
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [head, base64] = dataUrl.split(",");
  const mime = head.match(/data:(.*?);/)?.[1] || "application/octet-stream";
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}
