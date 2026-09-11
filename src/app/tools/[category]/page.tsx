import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";

const valid = new Set(CATEGORIES.map((c) => c.id));

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat) return {};
  return {
    title: `${cat.name}`,
    description: cat.description,
    alternates: { canonical: `/tools/${cat.id}/` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!valid.has(category as never)) notFound();
  const cat = CATEGORIES.find((c) => c.id === category)!;
  const tools = getToolsByCategory(category);

  return (
    <div className="container-app" style={{ padding: "2rem 0 3rem" }}>
      <nav aria-label="面包屑" style={{ fontSize: ".85rem", color: "var(--text-dim)", marginBottom: 12 }}>
        <Link href="/">首页</Link>
        <span aria-hidden> / </span>
        <span style={{ color: "var(--text-muted)" }}>{cat.name}</span>
      </nav>
      <h1 style={{ margin: "0 0 8px" }}>{cat.name}</h1>
      <p style={{ color: "var(--text-muted)", margin: "0 0 24px" }}>{cat.description}</p>
      <div className="grid-tools">
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
      {tools.length === 0 && (
        <div className="card" style={{ padding: "2rem", color: "var(--text-dim)" }}>
          该分类工具即将上线。
        </div>
      )}
    </div>
  );
}
