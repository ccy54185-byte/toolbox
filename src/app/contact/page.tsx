import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/categories";

export const metadata: Metadata = {
  title: "联系我们",
  description: `联系 ${SITE.name}：反馈问题、报告错误或提出功能建议。`,
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <div className="tool-page legal-page">
      <h1 className="legal-title">联系我们</h1>
      <p className="legal-lead">
        欢迎反馈 Bug、功能建议或合作意向。我们是小团队，会尽量回复，但不保证时限。
      </p>

      <section className="legal-section">
        <h2>建议这样写</h2>
        <ul>
          <li>你使用的工具名称与页面链接</li>
          <li>设备与浏览器（例如 Chrome 131 / iPhone Safari）</li>
          <li>问题复现步骤（文件类型、大致大小，不要发送敏感原文件）</li>
          <li>期望的行为是什么</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>隐私提醒</h2>
        <p>
          请不要通过邮件发送含个人隐私或商业机密的原文件。描述问题即可；工具本身在你的浏览器本地处理文件。
        </p>
      </section>

      <section className="legal-section">
        <h2>渠道</h2>
        <ul>
          <li>
            GitHub Issues（推荐，可公开追踪）：
            <span className="mono"> github.com/ccy54185-byte/toolbox/issues</span>
          </li>
          <li>站内：从任意工具页底部说明进入相关文档</li>
        </ul>
        <p style={{ color: "var(--text-tertiary)", fontSize: "0.9rem" }}>
          也可先查看{" "}
          <Link href="/faq/" className="legal-link">
            常见问题
          </Link>{" "}
          与{" "}
          <Link href="/changelog/" className="legal-link">
            更新日志
          </Link>
          。
        </p>
      </section>
    </div>
  );
}
