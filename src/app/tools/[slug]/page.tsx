import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTool, TOOLS } from "@/lib/tools";
import { SITE } from "@/lib/categories";
import ToolShell from "@/components/ToolShell";
import ToolView from "@/components/ToolView";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  const title = tool.name;
  const description = tool.description;
  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: { canonical: `/tools/${tool.slug}/` },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url: `${SITE.url}/tools/${tool.slug}/`,
      type: "website",
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (Web Browser)",
    description: tool.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolShell tool={tool}>
        <ToolView slug={tool.slug} />
      </ToolShell>
    </>
  );
}
