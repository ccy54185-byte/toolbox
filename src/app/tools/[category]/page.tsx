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
    <div className="tool-page">
      <nav aria-label="面包屑" className="tool-crumb">
        <Link href="/">首页</Link>
        <span aria-hidden> / </span>
        <span className="tool-crumb-current">{cat.name}</span>
      </nav>
      <header className="tool-header">
        <h1 className="tool-title">{cat.name}</h1>
        <p className="tool-desc">{cat.description}</p>
      </header>
      <div className="apple-tool-grid" style={{ marginTop: "0.5rem" }}>
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
      {tools.length === 0 && (
        <div className="card" style={{ padding: "2rem", color: "var(--text-tertiary)" }}>
          该分类工具即将上线。
        </div>
      )}
    </div>
  );
}
