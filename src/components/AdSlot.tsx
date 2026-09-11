"use client";

type Variant = "top" | "sidebar" | "bottom" | "content";

const labels: Record<Variant, string> = {
  top: "广告位 · Top Banner",
  sidebar: "广告位 · Sidebar",
  bottom: "广告位 · Bottom Banner",
  content: "广告位 · In Content",
};

/**
 * Ad placeholder. Replace internals with real AdSense later.
 * Must never cover tools or interfere with file drop zones.
 */
export default function AdSlot({
  variant = "content",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  return (
    <div
      className={`ad-slot ${className}`}
      data-ad-slot={variant}
      aria-hidden
      role="presentation"
    >
      {labels[variant]}
    </div>
  );
}
