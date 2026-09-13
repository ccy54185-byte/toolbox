import Link from "next/link";
import { SITE } from "@/lib/categories";

export default function SiteHeader() {
  return (
    <header className="apple-nav">
      <div className="apple-nav-inner">
        <Link href="/" className="apple-brand" aria-label={`${SITE.name} 首页`}>
          <span className="apple-mark" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" opacity="0.9" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
          <span>{SITE.name}</span>
        </Link>
        <nav className="apple-nav-links" aria-label="主导航">
          <Link href="/tools/image/">图片</Link>
          <Link href="/tools/developer/">开发</Link>
          <Link href="/tools/generator/">生成</Link>
          <Link href="/privacy/">隐私</Link>
        </nav>
      </div>
    </header>
  );
}
