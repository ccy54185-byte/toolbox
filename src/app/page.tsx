import type { Metadata } from "next";
import HomeExperience from "@/components/home/HomeExperience";
import { SITE } from "@/lib/categories";

export const metadata: Metadata = {
  title: `${SITE.name} — 隐私优先的精密在线工具箱`,
  description:
    "免费、隐私优先的在线工具箱。图片压缩、格式转换、二维码、开发者工具等，全部在浏览器本地处理，文件不上传。",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE.name} — 隐私优先的精密在线工具箱`,
    description: SITE.description,
    url: SITE.url,
    type: "website",
  },
};

export default function HomePage() {
  return <HomeExperience />;
}
