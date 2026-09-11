import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-app" style={{ padding: "4rem 0", textAlign: "center" }}>
      <h1 style={{ marginTop: 0 }}>页面不存在</h1>
      <p style={{ color: "var(--text-muted)" }}>你访问的工具或页面可能已移动。</p>
      <Link className="btn btn-primary" href="/">返回首页</Link>
    </div>
  );
}
