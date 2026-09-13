import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/categories";

export const metadata: Metadata = {
  title: "隐私政策",
  description: `${SITE.name} 隐私政策：文件本地处理、不上传用户文件、Cookie 与广告说明。`,
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <div className="tool-page legal-page">
      <h1 className="legal-title">隐私政策</h1>
      <p className="legal-lead">
        最后更新：{new Date().getFullYear()} 年。本页面说明 {SITE.name} 如何处理信息。核心原则很简单：能本地做的，绝不上服务器。
      </p>

      <section className="legal-section">
        <h2>1. 用户文件</h2>
        <ul>
          <li>我们不会主动上传你选择的图片、音频、视频或 PDF 到服务器。</li>
          <li>我们不会收集、读取或存储你文件的内容（包括图片画面、文字识别结果等）。</li>
          <li>处理流程默认为：你的设备 → 浏览器本地 JavaScript/WASM → 你下载结果。</li>
          <li>我们不会建立用户文件历史记录，也不会把文件卖给第三方。</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>2. 本地存储</h2>
        <p>
          部分功能（如在线记事本）可能使用浏览器 LocalStorage 保存草稿。这些内容只保存在你的设备上。
          清除浏览器站点数据即可删除。我们无法从服务器读取这些内容。
        </p>
      </section>

      <section className="legal-section">
        <h2>3. Cookie 与类似技术</h2>
        <ul>
          <li>本站核心功能不依赖 Cookie 登录或追踪。</li>
          <li>托管平台（如 Cloudflare Pages）可能使用必要的技术 Cookie / 日志以保障安全与可用性。</li>
          <li>若接入广告网络，广告商可能使用 Cookie 或本地存储进行频率控制与效果统计；你可在浏览器中管理或清除这些数据。</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. 广告说明（Google AdSense / Microsoft Advertising）</h2>
        <p>
          为维持免费服务，我们可能展示第三方广告，包括 Google AdSense 与 Microsoft Advertising。
          Google 等广告供应商可能使用 Cookie（例如 AdSense 的个性化广告 Cookie）基于你对本站及其他网站的访问展示广告。
        </p>
        <p>
          你可前往 Google 广告设置了解个性化广告，并选择退出；也可在浏览器中屏蔽或清除 Cookie。
          详细政策见 Google 的隐私与条款页面。广告不会用于上传你的文件，也不会遮挡工具主要操作区。
        </p>
        <p>
          广告位均放置在页面文档流中，不会遮挡上传区与主要操作按钮，也不会用于上传你的文件。
          你可以使用广告拦截扩展；这不影响工具本身的本地处理能力。
        </p>
      </section>

      <section className="legal-section">
        <h2>5. 日志与统计</h2>
        <p>
          静态托管与 CDN 可能记录 IP、User-Agent、访问路径等基础日志，用于安全防护与故障排查。
          我们不会将这些日志与你的文件内容关联。
        </p>
      </section>

      <section className="legal-section">
        <h2>6. 第三方链接</h2>
        <p>工具页或文章中若出现外部链接，其隐私政策由对方负责。离开本站前请自行了解对方做法。</p>
      </section>

      <section className="legal-section">
        <h2>7. 儿童隐私</h2>
        <p>本站不面向 13 岁以下儿童定向设计。若你是监护人并认为儿童提交了信息，请通过联系我们请求协助。</p>
      </section>

      <section className="legal-section">
        <h2>8. 政策更新</h2>
        <p>
          重大变更会在本页面更新日期。继续使用即表示你了解最新政策。相关页面：{" "}
          <Link href="/terms/" className="legal-link">
            服务条款
          </Link>
          、{" "}
          <Link href="/about/" className="legal-link">
            关于我们
          </Link>
          。
        </p>
      </section>
    </div>
  );
}
