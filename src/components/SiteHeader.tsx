import Link from "next/link";
import { SITE } from "@/lib/categories";

const NAV = [
  { href: "/tools/image/", label: "图片" },
  { href: "/tools/developer/", label: "开发" },
  { href: "/tools/generator/", label: "生成" },
  { href: "/tools/audio/", label: "音频" },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container-app site-header-inner">
        <Link href="/" className="site-brand" aria-label={`${SITE.name} 首页`}>
          <span className="site-logo" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 3v3.2M12 17.8V21M3 12h3.2M17.8 12H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <span className="site-brand-name">{SITE.name}</span>
        </Link>
        <nav className="site-nav" aria-label="主导航">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="site-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/tools/image-compressor/" className="btn btn-primary site-header-cta">
          开始使用
        </Link>
      </div>
    </header>
  );
}
