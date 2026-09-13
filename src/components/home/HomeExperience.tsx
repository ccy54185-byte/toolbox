"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagicCircle from "@/components/hero/MagicCircle";
import ParticleField from "@/components/hero/ParticleField";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { CATEGORIES } from "@/lib/categories";
import { getReadyTools } from "@/lib/tools";

export default function HomeExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const circleScrollRef = useRef<HTMLDivElement>(null);
  const circlePointerRef = useRef<HTMLDivElement>(null);
  const [intensity, setIntensity] = useState(0);
  const tools = getReadyTools();
  const featured = tools.slice(0, 6);

  useSmoothScroll();

  useEffect(() => {
    const root = rootRef.current;
    const circleScroll = circleScrollRef.current;
    const circlePointer = circlePointerRef.current;
    if (!root || !circleScroll || !circlePointer) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    const qx = gsap.quickTo(circlePointer, "x", { duration: 1.2, ease: "power3.out" });
    const qy = gsap.quickTo(circlePointer, "y", { duration: 1.2, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      qx(((e.clientX - cx) / cx) * 12);
      qy(((e.clientY - cy) / cy) * 10);
      setIntensity(Math.min(1, Math.hypot((e.clientX - cx) / cx, (e.clientY - cy) / cy)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-line]",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.15,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.1,
        }
      );
      gsap.fromTo(
        circleScroll,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.6, ease: "power3.out" }
      );

      if (reduced) return;

      gsap.fromTo(
        circleScroll,
        { scale: 1, y: 0, opacity: 1 },
        {
          scale: 0.38,
          y: -100,
          opacity: 0.2,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: "[data-section='hero']",
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        "[data-hero-copy]",
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -56,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: "[data-section='hero']",
            start: "35% top",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none play reverse",
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: (i % 3) * 0.07,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "bottom 15%",
              toggleActions: "play none play reverse",
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
    <div ref={rootRef} className="apple-page">
      {/* 1 · Hero */}
      <section data-section="hero" className="apple-hero">
        <ParticleField density={0.00003} />
        <div ref={circleScrollRef} className="apple-hero-orb">
          <div ref={circlePointerRef} className="apple-hero-orb-inner">
            <MagicCircle size={640} intensity={intensity} />
          </div>
        </div>

        <div className="apple-hero-copy" data-hero-copy>
          <p className="apple-hero-eyebrow" data-hero-line>
            本地处理 · 免费 · 无需注册
          </p>
          <h1 className="apple-hero-title">
            <span data-hero-line>工具，本该</span>
            <span data-hero-line className="apple-hero-title-em">
              安静地好用
            </span>
          </h1>
          <p className="apple-hero-sub" data-hero-line>
            图片、音频与开发者工具，全部在浏览器里完成。文件不离开你的设备。
          </p>
          <div className="apple-hero-actions" data-hero-line>
            <Link href="/tools/image-compressor/" className="apple-btn apple-btn-fill">
              开始压缩图片
            </Link>
            <a href="#tools" className="apple-btn apple-btn-quiet">
              浏览全部工具
            </a>
          </div>
        </div>
      </section>

      {/* 2 · Thesis */}
      <section className="apple-section apple-section-tight">
        <div className="apple-wrap">
          <h2 className="apple-display" data-reveal>
            复杂留给机器，
            <br />
            简单留给你。
          </h2>
          <p className="apple-body-lg" data-reveal>
            首页中央是一枚缓慢运转的精密法阵。往下滚动，它会退开，让真正的内容出现——不是仪表盘，不是按钮墙，只是你此刻需要的工具。
          </p>
        </div>
      </section>

      {/* 3 · Tools */}
      <section id="tools" className="apple-section">
        <div className="apple-wrap">
          <div className="apple-section-label" data-reveal>
            常用工具
          </div>
          <h2 className="apple-headline" data-reveal>
            打开就能用
          </h2>
          <div className="apple-tool-grid">
            {featured.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}/`} className="apple-tool" data-card>
                <h3>{t.name}</h3>
                <p>{t.description}</p>
                <span className="apple-tool-go" aria-hidden>
                  →
                </span>
              </Link>
            ))}
          </div>
          <div className="apple-more" data-reveal>
            <Link href="/tools/image/" className="apple-link">
              查看图片工具
            </Link>
            <Link href="/tools/developer/" className="apple-link">
              查看开发者工具
            </Link>
          </div>
        </div>
      </section>

      {/* 4 · Categories */}
      <section className="apple-section apple-section-soft">
        <div className="apple-wrap">
          <div className="apple-section-label" data-reveal>
            分类
          </div>
          <h2 className="apple-headline" data-reveal>
            按场景进入
          </h2>
          <div className="apple-cat-list">
            {CATEGORIES.map((c) => (
              <Link key={c.id} href={`/tools/${c.id}/`} className="apple-cat-row" data-card>
                <span className="apple-cat-name">{c.name}</span>
                <span className="apple-cat-desc">{c.description}</span>
                <span className="apple-cat-arrow" aria-hidden>
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · Close */}
      <section className="apple-section">
        <div className="apple-wrap apple-close">
          <h2 className="apple-display" data-reveal>
            免费。本地。可部署。
          </h2>
          <p className="apple-body-lg" data-reveal>
            无需账号，无广告干扰工具区。静态站点，可托管到任何免费平台。
          </p>
          <div className="apple-hero-actions" data-reveal>
            <Link href="/tools/json-formatter/" className="apple-btn apple-btn-fill">
              格式化 JSON
            </Link>
            <Link href="/privacy/" className="apple-btn apple-btn-quiet">
              了解隐私说明
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
