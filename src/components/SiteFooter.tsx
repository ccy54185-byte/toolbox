import Link from "next/link";
import { SITE } from "@/lib/categories";

export default function SiteFooter() {
  return (
    <footer className="apple-footer">
      <div className="apple-wrap">
        <div className="apple-footer-top">
          <div className="apple-brand">
            <span className="apple-mark" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </span>
            <span>{SITE.name}</span>
          </div>
          <nav className="apple-footer-nav" aria-label="页脚导航">
            <Link href="/tools/image/">图片</Link>
            <Link href="/tools/developer/">开发</Link>
            <Link href="/tools/generator/">生成</Link>
            <Link href="/privacy/">隐私</Link>
          </nav>
        </div>
        <p className="apple-footer-note">
          © {new Date().getFullYear()} {SITE.name} · 文件仅在你的设备上处理
        </p>
      </div>
    </footer>
  );
}
