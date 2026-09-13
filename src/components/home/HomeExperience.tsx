"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagicCircle from "@/components/hero/MagicCircle";
import ParticleField from "@/components/hero/ParticleField";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { CATEGORIES } from "@/lib/categories";
import { getReadyTools, TOOLS } from "@/lib/tools";
import SearchBox from "@/components/SearchBox";
import AdSlot from "@/components/AdSlot";

const FEATURES = [
  {
    title: "本地处理",
    body: "文件默认只在浏览器内完成处理，不上传、不落库、不建账号。",
    meta: "PRIVACY",
  },
  {
    title: "即开即用",
    body: "打开网页就能用。无需安装客户端，也没有注册墙。",
    meta: "ACCESS",
  },
  {
    title: "精密工具集",
    body: "图片、音频、视频、PDF 与开发者工具，围绕高频真实场景编排。",
    meta: "SUITE",
  },
  {
    title: "静态可部署",
    body: "纯前端导出，适配 Cloudflare Pages 等免费静态托管。",
    meta: "STACK",
  },
];

export default function HomeExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const circleScrollRef = useRef<HTMLDivElement>(null);
  const circlePointerRef = useRef<HTMLDivElement>(null);
  const [intensity, setIntensity] = useState(0);
  const tools = getReadyTools();
  const featured = tools.slice(0, 8);

  useSmoothScroll();

  useEffect(() => {
    const root = rootRef.current;
    const circleScroll = circleScrollRef.current;
    const circlePointer = circlePointerRef.current;
    if (!root || !circleScroll || !circlePointer) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    // Pointer parallax only on inner node — never overwrite scroll-linked props
    const qx = gsap.quickTo(circlePointer, "x", { duration: 1.1, ease: "power3.out" });
    const qy = gsap.quickTo(circlePointer, "y", { duration: 1.1, ease: "power3.out" });
    const qr = gsap.quickTo(circlePointer, "rotation", { duration: 1.1, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      qx(dx * 18);
      qy(dy * 14);
      qr(dx * 2);
      setIntensity(Math.min(1, Math.hypot(dx, dy)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Card spotlight follows pointer (CSS vars, no re-render)
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".home-card"));
    const onCardMove = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    cards.forEach((c) => c.addEventListener("pointermove", onCardMove));

    const ctx = gsap.context(() => {
      // Entrance (does not feed into scrub start values)
      gsap.fromTo(
        "[data-hero-copy]",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.12,
        }
      );
      gsap.fromTo(
        circleScroll,
        { scale: 0.86, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: "power3.out" }
      );

      if (reduced) return;

      // Explicit fromTo + immediateRender:false so reverse scroll restores visible state
      gsap.fromTo(
        circleScroll,
        { scale: 1, y: 0, opacity: 1 },
        {
          scale: 0.42,
          y: -80,
          opacity: 0.35,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: "[data-section='hero']",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        "[data-hero-copy]",
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -48,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: "[data-section='hero']",
            start: "center top",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Scroll hint fades once user starts scrolling
      gsap.fromTo(
        "[data-scroll-hint]",
        { opacity: 1 },
        {
          opacity: 0,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: "[data-section='hero']",
            start: "top top",
            end: "15% top",
            scrub: true,
          },
        }
      );

      // Section reveals — animate on enter (down) AND enterBack (up)
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "bottom 15%",
              toggleActions: "play none play reverse",
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.65,
            delay: (i % 4) * 0.05,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "bottom 10%",
              toggleActions: "play none play reverse",
            },
          }
        );
      });
    }, root);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cards.forEach((c) => c.removeEventListener("pointermove", onCardMove));
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="home-root">
      {/* ===== S1 Hero ===== */}
      <section
        data-section="hero"
        className="home-hero"
        aria-label="首页主视觉"
      >
        <ParticleField />
        <div className="home-hero-glow" aria-hidden />

        <div ref={circleScrollRef} className="home-circle-wrap">
          <div ref={circlePointerRef} className="home-circle-pointer">
            <MagicCircle size={560} intensity={intensity} />
          </div>
        </div>

        <div className="home-hero-copy container-app" data-hero-copy>
          <div className="home-eyebrow">LOCAL PROCESSING</div>
          <h1 className="home-title">
            把工具收进
            <span className="home-title-accent">一枚精密法阵</span>
          </h1>
          <p className="home-sub">
            隐私优先的在线工具箱。压缩、转换、生成，全部在浏览器本地完成，文件不上传。
          </p>
          <div className="home-actions">
            <Link href="/tools/image-compressor/" className="btn btn-primary">
              立即压缩图片
            </Link>
            <a href="#tools" className="btn btn-secondary">
              浏览工具
            </a>
          </div>
        </div>

        <div className="home-scroll-hint" data-scroll-hint aria-hidden>
          <span>SCROLL</span>
          <div className="home-scroll-line" />
        </div>
      </section>

      {/* ===== S2 Shrink / thesis ===== */}
      <section data-section="thesis" className="home-section home-thesis">
        <div className="container-app">
          <p className="home-kicker" data-reveal>
            不是又一个杂乱工具站
          </p>
          <h2 className="home-h2" data-reveal>
            像操作仪器一样操作工具
          </h2>
          <p className="home-lead" data-reveal>
            首页是一枚持续运转的精密法阵。往下滚动，它缓缓退场，把舞台交给真正重要的东西：能立刻上手的实用工具。
          </p>
        </div>
      </section>

      {/* ===== S3 Featured tools ===== */}
      <section id="tools" data-section="tools" className="home-section">
        <div className="container-app">
          <div className="home-section-head" data-reveal>
            <div>
              <p className="home-kicker">FEATURED</p>
              <h2 className="home-h2">高频工具</h2>
            </div>
            <Link href="/tools/developer/" className="btn btn-ghost">
              查看更多 →
            </Link>
          </div>
          <div className="home-search" data-reveal>
            <SearchBox tools={TOOLS} />
          </div>
          <div className="home-grid">
            {featured.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}/`}
                className="home-card"
                data-card
              >
                <div className="home-card-top">
                  <span className="home-card-icon" aria-hidden>
                    ◈
                  </span>
                  {t.status === "beta" && <span className="badge">Beta</span>}
                </div>
                <h3>{t.name}</h3>
                <p>{t.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== S4 Categories ===== */}
      <section data-section="categories" className="home-section home-section-alt">
        <div className="container-app">
          <h2 className="home-h2" data-reveal>
            按场景分类
          </h2>
          <div className="home-cat-grid">
            {CATEGORIES.map((c, i) => (
              <Link
                key={c.id}
                href={`/tools/${c.id}/`}
                className="home-cat"
                data-card
              >
                <span className="home-cat-code">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <strong>{c.name}</strong>
                <span>{c.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== S5 Features ===== */}
      <section data-section="features" className="home-section">
        <div className="container-app">
          <h2 className="home-h2" data-reveal>
            为什么是 ToolBox
          </h2>
          <div className="home-feature-grid">
            {FEATURES.map((f) => (
              <article key={f.title} className="home-feature" data-card>
                <span className="home-feature-meta">{f.meta}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>

          <div className="home-cta" data-reveal>
            <div>
              <h3>准备好了吗？</h3>
              <p>从图片压缩或 JSON 格式化开始，三十秒内完成第一件事。</p>
            </div>
            <div className="home-actions">
              <Link href="/tools/image-compressor/" className="btn btn-primary">
                压缩图片
              </Link>
              <Link href="/tools/json-formatter/" className="btn btn-secondary">
                格式化 JSON
              </Link>
            </div>
          </div>

          <AdSlot variant="bottom" network="adsense" />
        </div>
      </section>
    </div>
  );
}
