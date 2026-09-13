import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/categories";

export const metadata: Metadata = {
  title: "关于我们",
  description: `了解 ${SITE.name}：为什么创建这个免费、隐私优先的在线工具箱，以及我们如何处理你的数据。`,
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <div className="tool-page legal-page">
      <h1 className="legal-title">关于我们</h1>
      <p className="legal-lead">
        {SITE.name} 是一个免费、隐私优先的在线工具箱。我们相信：好用的小工具不该强迫你注册，也不该把文件上传到别人的服务器。
      </p>

      <section className="legal-section">
        <h2>网站是做什么的</h2>
        <p>
          这里集合了图片压缩与转换、二维码生成、JSON 格式化、密码与 UUID 生成、文本统计等常用工具。
          打开网页即可使用，适合学生、设计师、开发者和内容创作者。
        </p>
      </section>

      <section className="legal-section">
        <h2>为什么创建这个网站</h2>
        <p>
          很多在线工具站会把你的图片、音频送到服务器处理，再要求登录或插广告才能下载。
          我们想做相反的事：尽量把处理放在浏览器本地完成，让你能安心处理工作文件。
        </p>
      </section>

      <section className="legal-section">
        <h2>本地处理理念</h2>
        <p>
          对于能在浏览器完成的处理，我们优先使用 Canvas、Web Audio、Web Crypto 等本地能力。
          用户文件默认路径是：你的设备 → 浏览器本地处理 → 你下载结果。
        </p>
        <p>
          我们不会为了「方便」把文件传到云端，除非某项功能在技术上确实无法本地完成（目前核心工具均不要求上传）。
        </p>
      </section>

      <section className="legal-section">
        <h2>商业模式</h2>
        <p>
          网站免费使用。未来可能通过页面广告（如 Google AdSense）获得少量收入，以覆盖托管与维护成本。
          广告不会遮挡工具操作区，也不会用于上传你的文件。
        </p>
      </section>

      <section className="legal-section">
        <h2>联系我们</h2>
        <p>
          有问题或建议，请查看{" "}
          <Link href="/contact/" className="legal-link">
            联系我们
          </Link>
          。也欢迎阅读{" "}
          <Link href="/privacy/" className="legal-link">
            隐私政策
          </Link>{" "}
          与{" "}
          <Link href="/terms/" className="legal-link">
            服务条款
          </Link>
          。
        </p>
      </section>
    </div>
  );
}
