import Link from "next/link";
import { SITE } from "@/lib/categories";

const LINKS = [
  { href: "/about/", label: "关于" },
  { href: "/privacy/", label: "隐私" },
  { href: "/terms/", label: "条款" },
  { href: "/faq/", label: "FAQ" },
  { href: "/changelog/", label: "更新" },
  { href: "/contact/", label: "联系" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();
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
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="apple-footer-note">
          © {year} {SITE.name} · 保留所有权利 · 文件仅在你的设备上处理
        </p>
      </div>
    </footer>
  );
}
