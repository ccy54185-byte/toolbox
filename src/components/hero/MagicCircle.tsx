"use client";

import { useId, useMemo } from "react";

type Props = {
  size?: number;
  className?: string;
  /** 0-1 intensity for hover / scroll */
  intensity?: number;
};

/** Procedural precision dial — multi-ring SVG, no external assets. */
export default function MagicCircle({ size = 560, className = "", intensity = 0 }: Props) {
  const rawId = useId();
  const id = `mc${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const glow = 0.35 + intensity * 0.45;

  const rings = useMemo(() => {
    const items: {
      r: number;
      stroke: number;
      opacity: number;
      dash?: string;
      duration: number;
      reverse?: boolean;
    }[] = [
      { r: 248, stroke: 1, opacity: 0.35, duration: 80 },
      { r: 230, stroke: 0.8, opacity: 0.55, dash: "2 10", duration: 55, reverse: true },
      { r: 210, stroke: 1.2, opacity: 0.4, duration: 70 },
      { r: 188, stroke: 0.7, opacity: 0.7, dash: "1 6", duration: 40, reverse: true },
      { r: 160, stroke: 1.4, opacity: 0.5, duration: 90 },
      { r: 132, stroke: 0.8, opacity: 0.65, dash: "8 4 2 4", duration: 48 },
      { r: 104, stroke: 1, opacity: 0.45, duration: 62, reverse: true },
      { r: 72, stroke: 1.2, opacity: 0.7, duration: 36 },
      { r: 42, stroke: 0.9, opacity: 0.5, dash: "3 5", duration: 28, reverse: true },
    ];
    return items;
  }, []);

  const runes = useMemo(() => {
    // abstract technical glyphs (not readable language — keeps it refined)
    const glyphs = ["◇", "○", "△", "□", "⌁", "◌", "⊹", "⟐", "⬡", "◈", "⋅", "⧫", "⟁", "◌", "⊹", "⬡"];
    const n = 16;
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const r = 200;
      return {
        x: 280 + Math.cos(a) * r,
        y: 280 + Math.sin(a) * r,
        rot: (a * 180) / Math.PI + 90,
        char: glyphs[i % glyphs.length],
      };
    });
  }, []);

  const spokes = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => (i * 360) / 12);
  }, []);

  const orbiters = useMemo(() => {
    return [0, 1, 2].map((i) => ({
      r: 175 + i * 28,
      size: 3 - i * 0.5,
      duration: 18 + i * 7,
      delay: i * -4,
      reverse: i % 2 === 1,
    }));
  }, []);

  return (
    <div
      className={`magic-circle ${className}`}
      style={{ width: size, height: size, ["--mc-glow" as string]: glow }}
      aria-hidden
    >
      <svg viewBox="0 0 560 560" width="100%" height="100%" fill="none">
        <defs>
          <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="45%" stopColor="#0ea5e9" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#05070a" stopOpacity="0" />
          </radialGradient>
          <filter id={`${id}-soft`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ambient core */}
        <circle cx="280" cy="280" r="250" fill={`url(#${id}-core)`} />

        {/* static crosshair */}
        <g opacity="0.25" stroke="#9aa8b8" strokeWidth="0.6">
          <line x1="280" y1="20" x2="280" y2="540" />
          <line x1="20" y1="280" x2="540" y2="280" />
          <line x1="70" y1="70" x2="490" y2="490" strokeOpacity="0.4" />
          <line x1="490" y1="70" x2="70" y2="490" strokeOpacity="0.4" />
        </g>

        {/* rotating rings */}
        <g filter={`url(#${id}-soft)`}>
          {rings.map((ring, i) => (
            <g
              key={i}
              className={`mc-spin ${ring.reverse ? "mc-spin-rev" : ""}`}
              style={{ animationDuration: `${ring.duration}s` }}
              transform-origin="280 280"
            >
              <circle
                cx="280"
                cy="280"
                r={ring.r}
                stroke="#7dd3fc"
                strokeOpacity={ring.opacity * (0.7 + intensity * 0.5)}
                strokeWidth={ring.stroke}
                strokeDasharray={ring.dash}
              />
            </g>
          ))}
        </g>

        {/* geometric polygons */}
        <g
          className="mc-spin"
          style={{ animationDuration: "95s" }}
          transform-origin="280 280"
          opacity="0.45"
          stroke="#e8eef7"
          strokeWidth="0.7"
        >
          <polygon points={polygonPoints(280, 280, 145, 6)} />
          <polygon points={polygonPoints(280, 280, 120, 3)} stroke="#7dd3fc" strokeOpacity="0.5" />
        </g>
        <g
          className="mc-spin-rev"
          style={{ animationDuration: "72s" }}
          transform-origin="280 280"
          opacity="0.35"
          stroke="#9aa8b8"
          strokeWidth="0.6"
        >
          <polygon points={polygonPoints(280, 280, 168, 4)} />
        </g>

        {/* tick marks */}
        <g opacity="0.5">
          {spokes.map((deg) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            const r1 = 236;
            const r2 = deg % 30 === 0 ? 250 : 244;
            return (
              <line
                key={deg}
                x1={280 + Math.cos(rad) * r1}
                y1={280 + Math.sin(rad) * r1}
                x2={280 + Math.cos(rad) * r2}
                y2={280 + Math.sin(rad) * r2}
                stroke="#7dd3fc"
                strokeWidth={deg % 30 === 0 ? 1.2 : 0.6}
                strokeOpacity={0.7}
              />
            );
          })}
        </g>

        {/* runes */}
        <g
          className="mc-spin"
          style={{ animationDuration: "110s" }}
          transform-origin="280 280"
          filter={`url(#${id}-glow)`}
        >
          {runes.map((r, i) => (
            <text
              key={i}
              x={r.x}
              y={r.y}
              fill="#b6e0ff"
              fillOpacity={0.55 + intensity * 0.3}
              fontSize="11"
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(${r.rot} ${r.x} ${r.y})`}
              fontFamily="ui-monospace, monospace"
            >
              {r.char}
            </text>
          ))}
        </g>

        {/* inner seal */}
        <g opacity="0.8">
          <circle cx="280" cy="280" r="18" stroke="#e8eef7" strokeWidth="1" strokeOpacity="0.5" />
          <circle
            cx="280"
            cy="280"
            r="8"
            fill="#38bdf8"
            fillOpacity={0.15 + intensity * 0.25}
            stroke="#7dd3fc"
            strokeWidth="1"
          />
          <circle
            className="mc-pulse"
            cx="280"
            cy="280"
            r="28"
            stroke="#38bdf8"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
        </g>

        {/* orbiting nodes (SVG animation via CSS on groups) */}
        {orbiters.map((o, i) => (
          <g
            key={i}
            className={`mc-spin ${o.reverse ? "mc-spin-rev" : ""}`}
            style={{ animationDuration: `${o.duration}s`, animationDelay: `${o.delay}s` }}
            transform-origin="280 280"
          >
            <circle
              cx={280 + o.r}
              cy="280"
              r={o.size}
              fill="#7dd3fc"
              filter={`url(#${id}-glow)`}
              opacity="0.85"
            />
            <circle
              cx={280 + o.r}
              cy="280"
              r={o.size + 4}
              stroke="#7dd3fc"
              strokeOpacity="0.25"
              strokeWidth="0.6"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

function polygonPoints(cx: number, cy: number, r: number, n: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(" ");
}


