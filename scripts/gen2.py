from pathlib import Path

ROOT = Path(r"C:\Users\16600\toolbox")

def w(rel: str, content: str):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    if content.startswith("\n"):
        content = content[1:]
    p.write_text(content, encoding="utf-8")
    print("wrote", rel, p.stat().st_size)

# layout
w("src/app/layout.tsx", '''import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SITE } from "@/lib/categories";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — 免费隐私优先在线工具箱`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "在线工具",
    "图片压缩",
    "json格式化",
    "免费工具",
    "本地处理",
    "隐私优先",
    "toolbox",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — 免费隐私优先在线工具箱`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — 免费隐私优先在线工具箱`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        <main style={{ minHeight: "60vh" }}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
''')

# homepage
w("src/app/page.tsx", '''import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORIES, SITE } from "@/lib/categories";
import { TOOLS, getReadyTools } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import SearchBox from "@/components/SearchBox";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: `${SITE.name} — 免费隐私优先在线工具箱`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const tools = getReadyTools();
  return (
    <div className="container-app" style={{ padding: "2.5rem 0 3rem" }}>
      <section style={{ marginBottom: 28 }}>
        <div className="badge badge-accent" style={{ marginBottom: 12 }}>100% 浏览器本地处理</div>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", margin: "0 0 12px", fontWeight: 750, lineHeight: 1.2 }}>
          免费、隐私优先的
          <span style={{ color: "var(--accent)" }}>在线工具箱</span>
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: 640, margin: "0 0 20px" }}>
          图片、音频、视频、PDF 与开发者工具。文件默认只在您的设备上处理，不上传、不注册、不登录。
        </p>
        <SearchBox tools={TOOLS} />
      </section>

      <AdSlot variant="top" className="mb-6" />

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.1rem", margin: "0 0 12px", color: "var(--text-muted)" }}>工具分类</h2>
        <div className="grid-tools">
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={`/tools/${c.id}/`} className="card card-hover" style={{ padding: "1rem" }}>
              <div style={{ fontWeight: 650, marginBottom: 6 }}>{c.name}</div>
              <div style={{ fontSize: ".875rem", color: "var(--text-dim)" }}>{c.description}</div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <h2 style={{ fontSize: "1.1rem", margin: 0, color: "var(--text-muted)" }}>全部工具</h2>
          <span style={{ color: "var(--text-dim)", fontSize: ".85rem" }}>{tools.length} 个可用</span>
        </div>
        <div className="grid-tools">
          {tools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>

      <section style={{ marginTop: 40 }} className="card" >
        <div style={{ padding: "1.25rem" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "1.15rem" }}>为什么选择 {SITE.name}？</h2>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--text-muted)" }}>
            <li>隐私优先：文件处理默认在浏览器本地完成</li>
            <li>免费使用：无需注册或登录</li>
            <li>实用丰富：覆盖图片、开发者、生成器等高频场景</li>
            <li>适合部署：可静态托管到 Cloudflare Pages 等平台</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
''')

# privacy page
w("src/app/privacy/page.tsx", '''import type { Metadata } from "next";
import { SITE } from "@/lib/categories";

export const metadata: Metadata = {
  title: "隐私说明",
  description: `${SITE.name} 的隐私政策：文件本地处理，不上传用户文件。`,
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <div className="container-app" style={{ padding: "2rem 0 3rem", maxWidth: 760 }}>
      <h1 style={{ marginTop: 0 }}>隐私说明</h1>
      <p style={{ color: "var(--text-muted)" }}>
        {SITE.name} 以“隐私优先、本地处理”为默认原则。本页面说明我们如何对待用户数据。
      </p>

      <h2>用户文件</h2>
      <p>
        对于可在浏览器本地完成的处理，我们不会将用户文件上传到服务器，也不会发送到第三方文件处理 API。
        处理流程为：用户文件 → 浏览器本地 JavaScript/WASM → 结果 → 用户下载。
      </p>

      <h2>本地存储</h2>
      <p>
        部分工具（如在线记事本）可能使用浏览器 LocalStorage 保存草稿。这些内容只保存在您的设备上，不会同步到服务器。
        清除浏览器站点数据会删除这些内容。
      </p>

      <h2>网络请求</h2>
      <p>
        网站本身可能加载静态资源（HTML/CSS/JS）。我们不会因“用户文件处理”而发起上传请求。
        未来若接入广告，广告组件将独立封装，且不应用于上传用户文件。
      </p>

      <h2>广告（预留）</h2>
      <p>
        站点预留了 Top / Sidebar / Bottom / Content 广告位。当前显示占位内容，便于后续替换为 AdSense 等网络。
        广告不会遮挡工具操作区。
      </p>

      <h2>联系与更新</h2>
      <p>若隐私说明有重大变更，将在本页面更新。</p>
    </div>
  );
}
''')

# category page
w("src/app/tools/[category]/page.tsx", '''import type { Metadata } from "next";
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
''')

# dynamic tool page shell that dispatches to client tools
w("src/app/tools/[slug]/page.tsx", '''import type { Metadata } from "next";
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
''')

# sitemap + robots
w("src/app/sitemap.ts", '''import type { MetadataRoute } from "next";
import { CATEGORIES, SITE } from "@/lib/categories";
import { TOOLS } from "@/lib/tools";

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
''')

w("src/app/robots.ts", '''import type { MetadataRoute } from "next";
import { SITE } from "@/lib/categories";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/private/"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
''')

# not-found
w("src/app/not-found.tsx", '''import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-app" style={{ padding: "4rem 0", textAlign: "center" }}>
      <h1 style={{ marginTop: 0 }}>页面不存在</h1>
      <p style={{ color: "var(--text-muted)" }}>你访问的工具或页面可能已移动。</p>
      <Link className="btn btn-primary" href="/">返回首页</Link>
    </div>
  );
}
''')

# ToolView dispatcher
w("src/components/ToolView.tsx", '''"use client";

import dynamic from "next/dynamic";

const loaders: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  "image-compressor": () => import("@/tools/ImageCompressor"),
  "image-converter": () => import("@/tools/ImageConverter"),
  "image-resizer": () => import("@/tools/ImageResizer"),
  "image-crop": () => import("@/tools/ImageCrop"),
  "image-rotate": () => import("@/tools/ImageRotate"),
  "image-join": () => import("@/tools/ImageJoin"),
  "image-split": () => import("@/tools/ImageSplit"),
  "image-watermark": () => import("@/tools/ImageWatermark"),
  "image-exif": () => import("@/tools/ImageExif"),
  "image-colors": () => import("@/tools/ImageColors"),
  "image-base64": () => import("@/tools/ImageBase64"),
  "image-info": () => import("@/tools/ImageInfo"),
  "json-formatter": () => import("@/tools/JsonFormatter"),
  "json-escape": () => import("@/tools/JsonEscape"),
  "base64": () => import("@/tools/Base64Tool"),
  "url-encode": () => import("@/tools/UrlEncode"),
  "uuid": () => import("@/tools/UuidTool"),
  "hash": () => import("@/tools/HashTool"),
  "jwt": () => import("@/tools/JwtTool"),
  "timestamp": () => import("@/tools/TimestampTool"),
  "text-stats": () => import("@/tools/TextStats"),
  "markdown": () => import("@/tools/MarkdownPreview"),
  "diff": () => import("@/tools/TextDiff"),
  "password": () => import("@/tools/PasswordGen"),
  "random-number": () => import("@/tools/RandomNumber"),
  "random-color": () => import("@/tools/RandomColor"),
  "lorem": () => import("@/tools/LoremGen"),
  "qrcode": () => import("@/tools/QrCodeTool"),
  "note": () => import("@/tools/NotePad"),
  "audio-info": () => import("@/tools/AudioInfo"),
  "audio-trim": () => import("@/tools/AudioTrim"),
  "audio-volume": () => import("@/tools/AudioVolume"),
  "audio-fade": () => import("@/tools/AudioFade"),
  "audio-merge": () => import("@/tools/AudioMerge"),
  "audio-convert": () => import("@/tools/AudioConvert"),
  "audio-compressor": () => import("@/tools/AudioCompressor"),
  "audio-silence": () => import("@/tools/AudioSilence"),
  "video-info": () => import("@/tools/VideoInfo"),
  "video-trim": () => import("@/tools/VideoTrim"),
  "video-extract-audio": () => import("@/tools/VideoExtractAudio"),
  "video-compress": () => import("@/tools/VideoCompress"),
  "images-to-pdf": () => import("@/tools/ImagesToPdf"),
  "pdf-info": () => import("@/tools/PdfInfo"),
};

export default function ToolView({ slug }: { slug: string }) {
  const loader = loaders[slug];
  if (!loader) {
    return <div style={{ color: "var(--text-dim)" }}>工具组件加载失败。</div>;
  }
  const Comp = dynamic(loader, {
    ssr: false,
    loading: () => (
      <div style={{ color: "var(--text-dim)", padding: "1rem 0" }}>正在加载工具…</div>
    ),
  });
  return <Comp />;
}
''')

print("app shell done")
