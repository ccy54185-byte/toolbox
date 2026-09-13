"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagicCircle from "@/components/hero/MagicCircle";
import ParticleField from "@/components/hero/ParticleField";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { CATEGORIES, SITE } from "@/lib/categories";
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
  const circleWrapRef = useRef<HTMLDivElement>(null);
  const [intensity, setIntensity] = useState(0);
  const tools = getReadyTools();
  const featured = tools.slice(0, 8);

  useSmoothScroll();

  useEffect(() => {
    const root = rootRef.current;
    const circle = circleWrapRef.current;
    if (!root || !circle) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    // pointer parallax on circle
    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      gsap.to(circle, {
        x: dx * 18,
        y: dy * 14,
        rotate: dx * 2,
        duration: 1.1,
        ease: "power3.out",
        overwrite: true,
      });
      setIntensity(Math.min(1, Math.hypot(dx, dy)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const ctx = gsap.context(() => {
      // entrance
      gsap.fromTo(
        "[data-hero-copy]",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: "power3.out", delay: 0.15 }
      );
      gsap.fromTo(
        circle,
        { scale: 0.86, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: "power3.out" }
      );

      if (reduced) return;

      // scroll: circle shrinks + drifts up slightly
      gsap.to(circle, {
        scale: 0.42,
        y: -80,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-section='hero']",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to("[data-hero-copy]", {
        opacity: 0,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-section='hero']",
          start: "center top",
          end: "bottom top",
          scrub: true,
        },
      });

      // section reveals
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: (i % 4) * 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, root);

    return () => {
      window.removeEventListener("pointermove", onMove);
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

        <div ref={circleWrapRef} className="home-circle-wrap">
          <MagicCircle size={560} intensity={intensity} />
        </div>

        <div className="home-hero-copy container-app" data-hero-copy>
          <div className="home-eyebrow">LOCAL · PRIVATE · FREE</div>
          <h1 className="home-title">
            把工具收进
            <span className="home-title-accent">一枚精密法阵</span>
          </h1>
          <p className="home-sub">
            {SITE.name} 是隐私优先的在线工具箱。图片、音频、开发者工具全部在浏览器本地完成处理——文件不上传，打开即用。
          </p>
          <div className="home-actions">
            <Link href="/tools/image/" className="btn btn-primary">
              进入工具
            </Link>
            <a href="#tools" className="btn btn-secondary">
              浏览全部
            </a>
          </div>
          <div className="home-meta">
            <span>{tools.length}+ 工具</span>
            <span className="dot" />
            <span>零上传</span>
            <span className="dot" />
            <span>开源可部署</span>
          </div>
        </div>

        <div className="home-scroll-hint" aria-hidden>
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
          <p className="home-kicker" data-reveal>
            CATEGORIES
          </p>
          <h2 className="home-h2" data-reveal>
            按场景分类
          </h2>
          <div className="home-cat-grid">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/tools/${c.id}/`}
                className="home-cat"
                data-card
              >
                <span className="home-cat-code">{c.id.toUpperCase()}</span>
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
          <p className="home-kicker" data-reveal>
            PRINCIPLES
          </p>
          <h2 className="home-h2" data-reveal>
            设计原则
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
