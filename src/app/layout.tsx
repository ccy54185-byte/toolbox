import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SITE } from "@/lib/categories";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — 免费隐私优先在线工具箱`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "在线工具",
    "图片压缩",
    "json格式化",
    "免费工具",
    "本地处理",
    "隐私优先",
    "toolbox",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — 免费隐私优先在线工具箱`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — 免费隐私优先在线工具箱`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      {/*
        广告接入预留（Google AdSense）：
        审核通过后取消注释并替换 ca-pub-XXXXXXXX
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX" crossOrigin="anonymous"></script>

        Microsoft Advertising 预留：
        将 UET 标签脚本放在这里，或通过 AdSlot data-ad-network="microsoft" 容器注入。
        广告容器均在文档流内，不会遮挡工具按钮。
      */}
      <body>
        <SiteHeader />
        <main style={{ minHeight: "60vh", position: "relative", zIndex: 0 }}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
