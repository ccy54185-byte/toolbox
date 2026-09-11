"use client";

import dynamic from "next/dynamic";

const loaders: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  "image-compressor": () => import("@/tools/ImageCompressor"),
  "image-converter": () => import("@/tools/ImageConverter"),
  "image-resizer": () => import("@/tools/ImageResizer"),
  "image-crop": () => import("@/tools/ImageCrop"),
  "image-rotate": () => import("@/tools/ImageRotate"),
  "image-join": () => import("@/tools/ImageJoin"),
  "image-split": () => import("@/tools/ImageSplit"),
  "image-watermark": () => import("@/tools/ImageWatermark"),
  "image-exif": () => import("@/tools/ImageExif"),
  "image-colors": () => import("@/tools/ImageColors"),
  "image-base64": () => import("@/tools/ImageBase64"),
  "image-info": () => import("@/tools/ImageInfo"),
  "json-formatter": () => import("@/tools/JsonFormatter"),
  "json-escape": () => import("@/tools/JsonEscape"),
  "base64": () => import("@/tools/Base64Tool"),
  "url-encode": () => import("@/tools/UrlEncode"),
  "uuid": () => import("@/tools/UuidTool"),
  "hash": () => import("@/tools/HashTool"),
  "jwt": () => import("@/tools/JwtTool"),
  "timestamp": () => import("@/tools/TimestampTool"),
  "text-stats": () => import("@/tools/TextStats"),
  "markdown": () => import("@/tools/MarkdownPreview"),
  "diff": () => import("@/tools/TextDiff"),
  "password": () => import("@/tools/PasswordGen"),
  "random-number": () => import("@/tools/RandomNumber"),
  "random-color": () => import("@/tools/RandomColor"),
  "lorem": () => import("@/tools/LoremGen"),
  "qrcode": () => import("@/tools/QrCodeTool"),
  "note": () => import("@/tools/NotePad"),
  "audio-info": () => import("@/tools/AudioInfo"),
  "audio-trim": () => import("@/tools/AudioTrim"),
  "audio-volume": () => import("@/tools/AudioVolume"),
  "audio-fade": () => import("@/tools/AudioFade"),
  "audio-merge": () => import("@/tools/AudioMerge"),
  "audio-convert": () => import("@/tools/AudioConvert"),
  "audio-compressor": () => import("@/tools/AudioCompressor"),
  "audio-silence": () => import("@/tools/AudioSilence"),
  "video-info": () => import("@/tools/VideoInfo"),
  "video-trim": () => import("@/tools/VideoTrim"),
  "video-extract-audio": () => import("@/tools/VideoExtractAudio"),
  "video-compress": () => import("@/tools/VideoCompress"),
  "images-to-pdf": () => import("@/tools/ImagesToPdf"),
  "pdf-info": () => import("@/tools/PdfInfo"),
};

export default function ToolView({ slug }: { slug: string }) {
  const loader = loaders[slug];
  if (!loader) {
    return <div style={{ color: "var(--text-dim)" }}>工具组件加载失败。</div>;
  }
  const Comp = dynamic(loader, {
    ssr: false,
    loading: () => (
      <div style={{ color: "var(--text-dim)", padding: "1rem 0" }}>正在加载工具…</div>
    ),
  });
  return <Comp />;
}
