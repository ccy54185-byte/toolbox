import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/categories";

export const metadata: Metadata = {
  title: "服务条款",
  description: `${SITE.name} 服务条款：工具仅供参考，使用风险由用户自行承担。`,
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <div className="tool-page legal-page">
      <h1 className="legal-title">服务条款</h1>
      <p className="legal-lead">
        使用 {SITE.name} 即表示你同意以下条款。若不同意，请停止使用本站工具。
      </p>

      <section className="legal-section">
        <h2>1. 服务性质</h2>
        <p>
          本站提供免费在线工具，按「现状」提供。我们可能随时调整、暂停或下线某项功能，恕不另行通知。
        </p>
      </section>

      <section className="legal-section">
        <h2>2. 仅供参考</h2>
        <ul>
          <li>工具输出仅供参考与辅助，不构成法律、财务、工程或专业建议。</li>
          <li>我们不保证结果 100% 准确、完整或适用于你的特定场景。</li>
          <li>压缩、转换、解析等结果可能因浏览器、文件编码与版本而异。</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. 用户责任与风险</h2>
        <ul>
          <li>你应对上传/处理的文件拥有合法权利。</li>
          <li>重要文件请自行备份；处理前请确认原始文件安全。</li>
          <li>因使用本站工具导致的数据丢失、损坏、业务中断或其他损失，我们在法律允许范围内不承担责任。</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. 禁止行为</h2>
        <ul>
          <li>用于违法用途或侵犯他人权益</li>
          <li>试图攻击、破坏或过度消耗本站资源</li>
          <li>自动化大规模抓取影响服务可用性</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>5. 知识产权</h2>
        <p>站点界面、文案与原创代码受适用法律保护。工具本身可供个人与商业合理使用处理你自己的内容。</p>
      </section>

      <section className="legal-section">
        <h2>6. 免责声明</h2>
        <p>
          在适用法律允许的最大范围内，我们不对任何间接、附带或后果性损害负责。
          若司法辖区不允许完全免责，则我们的责任以法律允许的最低限度为准。
        </p>
      </section>

      <section className="legal-section">
        <h2>7. 联系</h2>
        <p>
          条款问题请见{" "}
          <Link href="/contact/" className="legal-link">
            联系我们
          </Link>
          。同时请阅读{" "}
          <Link href="/privacy/" className="legal-link">
            隐私政策
          </Link>
          。
        </p>
      </section>
    </div>
  );
}
