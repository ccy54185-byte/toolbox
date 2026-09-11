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
      <body>
        <SiteHeader />
        <main style={{ minHeight: "60vh" }}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
