export type ToolCategory =
  | "image"
  | "audio"
  | "video"
  | "pdf"
  | "developer"
  | "text"
  | "generator"
  | "utility";

export type ToolStatus = "ready" | "beta" | "planned";

export interface ToolMeta {
  slug: string;
  name: string;
  shortName: string;
  category: ToolCategory;
  description: string;
  longDescription: string;
  keywords: string[];
  icon: string;
  status: ToolStatus;
  privacyNote?: string;
  howTo: string[];
  faq?: { q: string; a: string }[];
}

export const CATEGORIES: {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
}[] = [
  { id: "image", name: "图片工具", description: "压缩、转换、裁剪、水印、EXIF 等本地图片处理", icon: "image" },
  { id: "audio", name: "音频工具", description: "音频信息、裁剪、音量、淡入淡出与格式处理", icon: "audio" },
  { id: "video", name: "视频工具", description: "视频信息、截取、提取音频等本地处理", icon: "video" },
  { id: "pdf", name: "PDF 工具", description: "图片合并 PDF、页面信息等本地文档辅助", icon: "pdf" },
  { id: "developer", name: "开发者工具", description: "JSON、Base64、编码解码、Hash、JWT、时间戳", icon: "code" },
  { id: "text", name: "文本工具", description: "文本统计、Diff 比较、Markdown 预览", icon: "text" },
  { id: "generator", name: "生成器", description: "密码、UUID、随机数、颜色、Lorem Ipsum、二维码", icon: "spark" },
  { id: "utility", name: "实用工具", description: "记事本等其他高频率小工具", icon: "wrench" },
];

export const SITE = {
  name: "ToolBox",
  tagline: "免费 · 隐私优先 · 本地处理",
  description:
    "免费在线工具箱。图片、音频、视频、PDF 与开发者工具，文件仅在浏览器本地处理，不上传服务器。",
  url: "https://toolbox.example.com",
};
