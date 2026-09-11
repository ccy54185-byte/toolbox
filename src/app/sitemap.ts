import type { MetadataRoute } from "next";
import { CATEGORIES, SITE } from "@/lib/categories";
import { TOOLS } from "@/lib/tools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/privacy/`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];
  for (const c of CATEGORIES) {
    entries.push({
      url: `${base}/tools/${c.id}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  for (const t of TOOLS) {
    entries.push({
      url: `${base}/tools/${t.slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }
  return entries;
}
