import type { ReactNode } from "react";
import Link from "next/link";
import type { ToolMeta } from "@/lib/categories";
import PrivacyBanner from "@/components/PrivacyBanner";
import AdSlot from "@/components/AdSlot";
import { CATEGORIES } from "@/lib/categories";

export default function ToolShell({
  tool,
  children,
}: {
  tool: ToolMeta;
  children: ReactNode;
}) {
  const cat = CATEGORIES.find((c) => c.id === tool.category);
  return (
    <div className="tool-page">
      <nav aria-label="面包屑" className="tool-crumb">
        <Link href="/">首页</Link>
        <span aria-hidden> / </span>
        <Link href={`/tools/${tool.category}/`}>{cat?.name || tool.category}</Link>
        <span aria-hidden> / </span>
        <span className="tool-crumb-current">{tool.name}</span>
      </nav>

      <header className="tool-header">
        <div className="tool-header-row">
          <h1 className="tool-title">{tool.name}</h1>
          {tool.status === "beta" && <span className="badge">Beta</span>}
        </div>
        <p className="tool-desc">{tool.description}</p>
      </header>

      <PrivacyBanner note={tool.privacyNote} />

      <div className="tool-panel" style={{ marginTop: "1.25rem" }}>
        {children}
      </div>

      <div style={{ margin: "1.5rem 0" }}>
        <AdSlot variant="content" network="adsense" />
      </div>

      <div className="prose-tool">
        <h2>使用方法</h2>
        <ol>
          {tool.howTo.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {tool.longDescription && (
          <>
            <h2>关于本工具</h2>
            <p>{tool.longDescription}</p>
          </>
        )}
        {tool.faq?.length ? (
          <>
            <h2>常见问题</h2>
            {tool.faq.map((item) => (
              <div key={item.q} style={{ marginBottom: 12 }}>
                <p style={{ color: "var(--text)", fontWeight: 600, marginBottom: 4 }}>{item.q}</p>
                <p style={{ margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </>
        ) : null}
        <h2>隐私</h2>
        <p>
          本工具默认在浏览器本地完成处理。文件不会上传到服务器，也不会发送给第三方。
          详见{" "}
          <Link href="/privacy/" style={{ color: "var(--accent)" }}>
            隐私说明
          </Link>
          。
        </p>
      </div>

      <AdSlot variant="bottom" network="microsoft" />
    </div>
  );
}
