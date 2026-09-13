import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/categories";

export const metadata: Metadata = {
  title: "常见问题",
  description: `${SITE.name} FAQ：文件是否上传、支持格式、压缩效果、浏览器兼容性等。`,
  alternates: { canonical: "/faq/" },
};

const FAQS = [
  {
    q: "文件会上传到服务器吗？",
    a: "不会。核心工具在浏览器本地用 Canvas / Web Audio / Web Crypto 等完成处理。文件默认只在你的设备上，处理完由你下载结果。",
  },
  {
    q: "支持哪些图片格式？",
    a: "常见 JPG、PNG、WebP、GIF、BMP 一般可解码。HEIC 等取决于系统与浏览器；若失败请先转换为 JPG/PNG。",
  },
  {
    q: "为什么压缩后大小变化不明显？",
    a: "PNG 再压为 PNG 往往收益有限；改用 JPEG/WebP、降低质量或限制最大宽度通常更明显。已是高压缩图片可提升空间很小。",
  },
  {
    q: "音频能导出 MP3 吗？",
    a: "浏览器本地没有稳定可靠的 MP3 编码器。我们导出 WAV，兼容性好；需要 MP3 可再用桌面软件转换。",
  },
  {
    q: "视频压缩为什么很慢或失败？",
    a: "浏览器通过播放+录制方式处理，耗时约等于视频时长，且受编码器限制。大视频建议用专业桌面工具。",
  },
  {
    q: "支持哪些浏览器？",
    a: "推荐最新 Chrome、Edge、Firefox、Safari。请保持浏览器更新；部分旧浏览器可能不支持 WebP 导出或某些 Web API。",
  },
  {
    q: "手机上能用吗？",
    a: "可以。页面已做响应式。超大文件会受手机内存限制，建议先缩小尺寸或改用电脑。",
  },
  {
    q: "需要注册吗？收费吗？",
    a: "不需要注册，核心工具免费。我们可能展示广告以维持托管成本，广告不会挡住工具按钮。",
  },
  {
    q: "记事本内容会丢吗？",
    a: "记事本保存在本机浏览器 LocalStorage。清除站点数据、更换浏览器或设备都会导致内容消失，请自行备份重要文字。",
  },
  {
    q: "二维码扫不出来怎么办？",
    a: "请保证足够对比与留白，避免在浅色背景上用过浅颜色。可调高导出清晰度后重新下载 PNG。",
  },
];

export default function FaqPage() {
  return (
    <div className="tool-page legal-page">
      <h1 className="legal-title">常见问题</h1>
      <p className="legal-lead">关于隐私、格式、兼容性与效果的高频问题。</p>

      <div className="legal-faq">
        {FAQS.map((item) => (
          <details key={item.q} className="legal-faq-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>

      <p style={{ marginTop: "2rem", color: "var(--text-secondary)" }}>
        没找到答案？请看{" "}
        <Link href="/contact/" className="legal-link">
          联系我们
        </Link>
        ，或先读{" "}
        <Link href="/privacy/" className="legal-link">
          隐私政策
        </Link>
        。
      </p>
    </div>
  );
}
