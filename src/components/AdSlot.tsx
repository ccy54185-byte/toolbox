"use client";

import type { CSSProperties } from "react";

/**
 * Ad slot placeholder for Google AdSense / Microsoft Advertising.
 *
 * Design rules (must keep):
 * - In normal document flow only — never position:fixed/absolute overlay
 * - Never cover upload zones, primary buttons, or tool controls
 * - Reserved min-height so layout does not jump when ads load
 * - pointer-events only on the ad frame itself
 *
 * To enable AdSense later:
 * 1. Add script in layout.tsx (data-ad-client="ca-pub-XXXXXXXX")
 * 2. Replace the inner placeholder with:
 *    <ins className="adsbygoogle" style={{display:"block"}} data-ad-client="ca-pub-XXX"
 *         data-ad-slot="YYY" data-ad-format="auto" data-full-width-responsive="true" />
 * 3. Call (adsbygoogle = window.adsbygoogle || []).push({}) once mounted
 *
 * Microsoft Advertising (UET / MSN ads) can use the same slot wrappers
 * via data-ad-network="microsoft".
 */

export type AdVariant = "top" | "sidebar" | "bottom" | "content";

const labels: Record<AdVariant, string> = {
  top: "广告位 · 顶部横幅",
  sidebar: "广告位 · 侧栏",
  bottom: "广告位 · 底部横幅",
  content: "广告位 · 文中",
};

const minHeight: Record<AdVariant, number> = {
  top: 96,
  sidebar: 250,
  bottom: 96,
  content: 100,
};

export default function AdSlot({
  variant = "content",
  network = "adsense",
  className = "",
  style,
}: {
  variant?: AdVariant;
  /** Reserved for future multi-network: "adsense" | "microsoft" */
  network?: "adsense" | "microsoft";
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <aside
      className={`ad-frame ${className}`}
      data-ad-slot={variant}
      data-ad-network={network}
      data-ad-placeholder="true"
      aria-label="广告位"
      style={{
        position: "relative",
        zIndex: 0,
        margin: "1rem 0",
        pointerEvents: "auto",
        ...style,
      }}
    >
      <div
        className="ad-slot"
        style={{
          minHeight: minHeight[variant],
          width: "100%",
          // Never cover neighbors
          position: "static",
          pointerEvents: "none",
          userSelect: "none",
        }}
        role="presentation"
      >
        {labels[variant]} · {network === "microsoft" ? "Microsoft Ads" : "Google AdSense"}（预留）
      </div>
    </aside>
  );
}
