"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const loading = () => (
  <div
    style={{
      color: "var(--text-dim)",
      padding: "1.25rem 0",
      fontSize: "0.9rem",
    }}
  >
    正在加载工具…
  </div>
);

// Module-level dynamic wrappers — do NOT call dynamic() during render.
const ImageCompressor = dynamic(() => import("@/tools/ImageCompressor"), { ssr: false, loading });
const ImageConverter = dynamic(() => import("@/tools/ImageConverter"), { ssr: false, loading });
const ImageResizer = dynamic(() => import("@/tools/ImageResizer"), { ssr: false, loading });
const ImageCrop = dynamic(() => import("@/tools/ImageCrop"), { ssr: false, loading });
const ImageRotate = dynamic(() => import("@/tools/ImageRotate"), { ssr: false, loading });
const ImageJoin = dynamic(() => import("@/tools/ImageJoin"), { ssr: false, loading });
const ImageSplit = dynamic(() => import("@/tools/ImageSplit"), { ssr: false, loading });
const ImageWatermark = dynamic(() => import("@/tools/ImageWatermark"), { ssr: false, loading });
const ImageExif = dynamic(() => import("@/tools/ImageExif"), { ssr: false, loading });
const ImageColors = dynamic(() => import("@/tools/ImageColors"), { ssr: false, loading });
const ImageBase64 = dynamic(() => import("@/tools/ImageBase64"), { ssr: false, loading });
const ImageInfo = dynamic(() => import("@/tools/ImageInfo"), { ssr: false, loading });
const JsonFormatter = dynamic(() => import("@/tools/JsonFormatter"), { ssr: false, loading });
const JsonEscape = dynamic(() => import("@/tools/JsonEscape"), { ssr: false, loading });
const Base64Tool = dynamic(() => import("@/tools/Base64Tool"), { ssr: false, loading });
const UrlEncode = dynamic(() => import("@/tools/UrlEncode"), { ssr: false, loading });
const UuidTool = dynamic(() => import("@/tools/UuidTool"), { ssr: false, loading });
const HashTool = dynamic(() => import("@/tools/HashTool"), { ssr: false, loading });
const JwtTool = dynamic(() => import("@/tools/JwtTool"), { ssr: false, loading });
const TimestampTool = dynamic(() => import("@/tools/TimestampTool"), { ssr: false, loading });
const TextStats = dynamic(() => import("@/tools/TextStats"), { ssr: false, loading });
const MarkdownPreview = dynamic(() => import("@/tools/MarkdownPreview"), { ssr: false, loading });
const TextDiff = dynamic(() => import("@/tools/TextDiff"), { ssr: false, loading });
const PasswordGen = dynamic(() => import("@/tools/PasswordGen"), { ssr: false, loading });
const RandomNumber = dynamic(() => import("@/tools/RandomNumber"), { ssr: false, loading });
const RandomColor = dynamic(() => import("@/tools/RandomColor"), { ssr: false, loading });
const LoremGen = dynamic(() => import("@/tools/LoremGen"), { ssr: false, loading });
const QrCodeTool = dynamic(() => import("@/tools/QrCodeTool"), { ssr: false, loading });
const NotePad = dynamic(() => import("@/tools/NotePad"), { ssr: false, loading });
const AudioInfo = dynamic(() => import("@/tools/AudioInfo"), { ssr: false, loading });
const AudioTrim = dynamic(() => import("@/tools/AudioTrim"), { ssr: false, loading });
const AudioVolume = dynamic(() => import("@/tools/AudioVolume"), { ssr: false, loading });
const AudioFade = dynamic(() => import("@/tools/AudioFade"), { ssr: false, loading });
const AudioMerge = dynamic(() => import("@/tools/AudioMerge"), { ssr: false, loading });
const AudioConvert = dynamic(() => import("@/tools/AudioConvert"), { ssr: false, loading });
const AudioCompressor = dynamic(() => import("@/tools/AudioCompressor"), { ssr: false, loading });
const AudioSilence = dynamic(() => import("@/tools/AudioSilence"), { ssr: false, loading });
const VideoInfo = dynamic(() => import("@/tools/VideoInfo"), { ssr: false, loading });
const VideoTrim = dynamic(() => import("@/tools/VideoTrim"), { ssr: false, loading });
const VideoExtractAudio = dynamic(() => import("@/tools/VideoExtractAudio"), { ssr: false, loading });
const VideoCompress = dynamic(() => import("@/tools/VideoCompress"), { ssr: false, loading });
const ImagesToPdf = dynamic(() => import("@/tools/ImagesToPdf"), { ssr: false, loading });
const PdfInfo = dynamic(() => import("@/tools/PdfInfo"), { ssr: false, loading });

const TOOLS: Record<string, ComponentType> = {
  "image-compressor": ImageCompressor,
  "image-converter": ImageConverter,
  "image-resizer": ImageResizer,
  "image-crop": ImageCrop,
  "image-rotate": ImageRotate,
  "image-join": ImageJoin,
  "image-split": ImageSplit,
  "image-watermark": ImageWatermark,
  "image-exif": ImageExif,
  "image-colors": ImageColors,
  "image-base64": ImageBase64,
  "image-info": ImageInfo,
  "json-formatter": JsonFormatter,
  "json-escape": JsonEscape,
  "base64": Base64Tool,
  "url-encode": UrlEncode,
  "uuid": UuidTool,
  "hash": HashTool,
  "jwt": JwtTool,
  "timestamp": TimestampTool,
  "text-stats": TextStats,
  "markdown": MarkdownPreview,
  "diff": TextDiff,
  "password": PasswordGen,
  "random-number": RandomNumber,
  "random-color": RandomColor,
  "lorem": LoremGen,
  "qrcode": QrCodeTool,
  "note": NotePad,
  "audio-info": AudioInfo,
  "audio-trim": AudioTrim,
  "audio-volume": AudioVolume,
  "audio-fade": AudioFade,
  "audio-merge": AudioMerge,
  "audio-convert": AudioConvert,
  "audio-compressor": AudioCompressor,
  "audio-silence": AudioSilence,
  "video-info": VideoInfo,
  "video-trim": VideoTrim,
  "video-extract-audio": VideoExtractAudio,
  "video-compress": VideoCompress,
  "images-to-pdf": ImagesToPdf,
  "pdf-info": PdfInfo,
};

export default function ToolView({ slug }: { slug: string }) {
  const Comp = TOOLS[slug];
  if (!Comp) {
    return (
      <div style={{ color: "var(--text-muted)", padding: "0.5rem 0" }}>
        未找到该工具组件。
      </div>
    );
  }
  return <Comp />;
}
