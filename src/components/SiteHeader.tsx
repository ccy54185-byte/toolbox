import Link from "next/link";
import { SITE } from "@/lib/categories";

export default function SiteHeader() {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(10,14,20,.85)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        className="container-app"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 60, gap: 16 }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
          <span
            aria-hidden
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--accent-soft)",
              color: "var(--accent)",
              border: "1px solid rgba(0,229,255,.35)",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            T
          </span>
          <span>{SITE.name}</span>
          <span className="badge badge-accent" style={{ marginLeft: 4 }}>
            本地处理
          </span>
        </Link>
        <nav style={{ display: "flex", gap: 8, flexWrap: "wrap" }} aria-label="主导航">
          <Link className="btn btn-ghost" href="/tools/image/" style={{ minHeight: 36, padding: "0 .7rem" }}>图片</Link>
          <Link className="btn btn-ghost" href="/tools/developer/" style={{ minHeight: 36, padding: "0 .7rem" }}>开发者</Link>
          <Link className="btn btn-ghost" href="/tools/generator/" style={{ minHeight: 36, padding: "0 .7rem" }}>生成器</Link>
          <Link className="btn btn-ghost" href="/privacy/" style={{ minHeight: 36, padding: "0 .7rem" }}>隐私</Link>
        </nav>
      </div>
    </header>
  );
}
