import Link from "next/link";
import { SITE } from "@/lib/categories";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-app">
        <div className="site-footer-grid">
          <div>
            <div className="site-brand" style={{ marginBottom: 10 }}>
              <span className="site-logo" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
              <span className="site-brand-name">{SITE.name}</span>
            </div>
            <p className="site-footer-tag">{SITE.tagline}</p>
          </div>
          <div className="site-footer-links">
            <Link href="/tools/image/">图片工具</Link>
            <Link href="/tools/developer/">开发者</Link>
            <Link href="/tools/generator/">生成器</Link>
            <Link href="/privacy/">隐私说明</Link>
          </div>
        </div>
        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span>文件本地处理 · 不上传</span>
        </div>
      </div>
    </footer>
  );
}
