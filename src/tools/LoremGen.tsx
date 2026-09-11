"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

function sentence(seed: number): string {
  const n = 8 + (seed % 10);
  const parts: string[] = [];
  for (let i = 0; i < n; i++) parts.push(WORDS[(seed * 17 + i * 31) % WORDS.length]);
  const s = parts.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}

function paragraph(seed: number): string {
  const n = 3 + (seed % 4);
  return Array.from({ length: n }, (_, i) => sentence(seed + i * 13)).join(" ");
}

export default function LoremGen() {
  const [paragraphs, setParagraphs] = useState(3);
  const [startWith, setStartWith] = useState(true);
  const text = useMemo(() => {
    const blocks = Array.from({ length: Math.min(20, Math.max(1, paragraphs)) }, (_, i) =>
      paragraph(i + 1)
    );
    if (startWith) {
      blocks[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + blocks[0];
    }
    return blocks.join("\n\n");
  }, [paragraphs, startWith]);

  return (
    <div>
      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
        <div>
          <label className="label" htmlFor="p">段落数</label>
          <input id="p" className="input" type="number" min={1} max={20} value={paragraphs} onChange={(e) => setParagraphs(Number(e.target.value) || 1)} style={{ width: 100 }} />
        </div>
        <label style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--text-muted)" }}>
          <input type="checkbox" checked={startWith} onChange={(e) => setStartWith(e.target.checked)} />
          经典开头
        </label>
        <CopyButton value={text} />
      </div>
      <textarea className="textarea" readOnly value={text} style={{ minHeight: 280, fontFamily: "inherit" }} />
    </div>
  );
}
