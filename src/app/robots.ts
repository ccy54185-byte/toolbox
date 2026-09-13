import type { MetadataRoute } from "next";
import { SITE } from "@/lib/categories";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/private/"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
