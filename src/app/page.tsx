import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORIES, SITE } from "@/lib/categories";
import { TOOLS, getReadyTools } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import SearchBox from "@/components/SearchBox";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: `${SITE.name} — 免费隐私优先在线工具箱`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const tools = getReadyTools();
  return (
    <div className="container-app" style={{ padding: "2.5rem 0 3rem" }}>
      <section style={{ marginBottom: 28 }}>
        <div className="badge badge-accent" style={{ marginBottom: 12 }}>100% 浏览器本地处理</div>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", margin: "0 0 12px", fontWeight: 750, lineHeight: 1.2 }}>
          免费、隐私优先的
          <span style={{ color: "var(--accent)" }}>在线工具箱</span>
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: 640, margin: "0 0 20px" }}>
          图片、音频、视频、PDF 与开发者工具。文件默认只在您的设备上处理，不上传、不注册、不登录。
        </p>
        <SearchBox tools={TOOLS} />
      </section>

      <AdSlot variant="top" network="adsense" />

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.1rem", margin: "0 0 12px", color: "var(--text-muted)" }}>工具分类</h2>
        <div className="grid-tools">
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={`/tools/${c.id}/`} className="card card-hover" style={{ padding: "1rem" }}>
              <div style={{ fontWeight: 650, marginBottom: 6 }}>{c.name}</div>
              <div style={{ fontSize: ".875rem", color: "var(--text-dim)" }}>{c.description}</div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <h2 style={{ fontSize: "1.1rem", margin: 0, color: "var(--text-muted)" }}>全部工具</h2>
          <span style={{ color: "var(--text-dim)", fontSize: ".85rem" }}>{tools.length} 个可用</span>
        </div>
        <div className="grid-tools">
          {tools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>

      <section style={{ marginTop: 40 }} className="card" >
        <div style={{ padding: "1.25rem" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "1.15rem" }}>为什么选择 {SITE.name}？</h2>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--text-muted)" }}>
            <li>隐私优先：文件处理默认在浏览器本地完成</li>
            <li>免费使用：无需注册或登录</li>
            <li>实用丰富：覆盖图片、开发者、生成器等高频场景</li>
            <li>适合部署：可静态托管到 Cloudflare Pages 等平台</li>
          </ul>
        </div>
      </section>

      <AdSlot variant="bottom" network="microsoft" />
      <AdSlot variant="content" network="adsense" />
    </div>
  );
}
