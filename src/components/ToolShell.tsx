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
    <div className="container-app" style={{ padding: "1.5rem 0 3rem" }}>
      <nav aria-label="面包屑" style={{ fontSize: ".85rem", color: "var(--text-dim)", marginBottom: 12 }}>
        <Link href="/">首页</Link>
        <span aria-hidden> / </span>
        <Link href={`/tools/${tool.category}/`}>{cat?.name || tool.category}</Link>
        <span aria-hidden> / </span>
        <span style={{ color: "var(--text-muted)" }}>{tool.name}</span>
      </nav>

      <header style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 8 }}>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700 }}>{tool.name}</h1>
          {tool.status === "beta" && <span className="badge">Beta</span>}
          {tool.privacyNote && <span className="badge badge-accent">本地处理</span>}
        </div>
        <p style={{ margin: 0, color: "var(--text-muted)", maxWidth: 720 }}>{tool.description}</p>
      </header>

      <AdSlot variant="top" className="mb-4" />

      {(tool.privacyNote || true) && (
        <div style={{ marginBottom: 16 }}>
          <PrivacyBanner note={tool.privacyNote} />
        </div>
      )}

      <div className="card" style={{ padding: "1.1rem", marginBottom: 20 }}>{children}</div>

      <AdSlot variant="bottom" className="mb-6" />

      <div className="prose-tool" style={{ maxWidth: 760 }}>
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
          如需了解网站整体数据处理方式，请查看{" "}
          <Link href="/privacy/" style={{ color: "var(--accent)" }}>隐私说明</Link>。
        </p>
      </div>
    </div>
  );
}
