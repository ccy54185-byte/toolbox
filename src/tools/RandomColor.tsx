"use client";

import { useCallback, useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { rgbToHex } from "@/lib/image";

function rand() {
  const a = new Uint8Array(3);
  crypto.getRandomValues(a);
  return { r: a[0], g: a[1], b: a[2] };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function RandomColor() {
  const [color, setColor] = useState(() => rand());

  const generate = useCallback(() => setColor(rand()), []);
  useEffect(() => { generate(); }, [generate]);

  const hex = rgbToHex(color.r, color.g, color.b);
  const hsl = rgbToHsl(color.r, color.g, color.b);

  return (
    <div>
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ height: 160, background: hex }} />
        <div style={{ padding: 16, display: "grid", gap: 8 }}>
          <div className="mono">HEX: {hex.toUpperCase()}</div>
          <div className="mono">RGB: rgb({color.r}, {color.g}, {color.b})</div>
          <div className="mono">HSL: hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            <button className="btn btn-primary" onClick={generate}>换一个</button>
            <CopyButton value={hex.toUpperCase()} label="复制 HEX" />
            <CopyButton value={`rgb(${color.r}, ${color.g}, ${color.b})`} label="复制 RGB" />
            <CopyButton value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} label="复制 HSL" />
          </div>
        </div>
      </div>
    </div>
  );
}
