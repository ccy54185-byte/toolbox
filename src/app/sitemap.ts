import type { MetadataRoute } from "next";
import { CATEGORIES, SITE } from "@/lib/categories";
import { TOOLS } from "@/lib/tools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about/`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/privacy/`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/terms/`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/contact/`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/faq/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/changelog/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
  for (const c of CATEGORIES) {
    entries.push({
      url: `${base}/tools/${c.id}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  for (const t of TOOLS) {
    entries.push({
      url: `${base}/tools/${t.slug}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }
  return entries;
}
