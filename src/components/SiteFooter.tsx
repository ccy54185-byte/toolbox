import Link from "next/link";
import { SITE } from "@/lib/categories";

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", marginTop: 64, padding: "2rem 0 2.5rem" }}>
      <div className="container-app" style={{ color: "var(--text-dim)", fontSize: ".875rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <strong style={{ color: "var(--text-muted)" }}>{SITE.name}</strong>
            <div>{SITE.tagline}</div>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/privacy/">隐私说明</Link>
            <Link href="/tools/image/">图片工具</Link>
            <Link href="/tools/developer/">开发者</Link>
            <Link href="/sitemap.xml">站点地图</Link>
          </div>
        </div>
        <div>© {new Date().getFullYear()} {SITE.name} · 免费使用 · 文件不上传</div>
      </div>
    </footer>
  );
}
