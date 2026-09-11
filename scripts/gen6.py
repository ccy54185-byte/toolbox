from pathlib import Path
ROOT = Path(r"C:\Users\16600\toolbox")

def w(rel, content):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    if content.startswith("\n"): content = content[1:]
    p.write_text(content, encoding="utf-8")
    print("wrote", rel, p.stat().st_size)

w("src/tools/TextStats.tsx", r'''"use client";

import { useMemo, useState } from "react";

export default function TextStats() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const cjk = (text.match(/[一-鿿㐀-䶿]/g) || []).length;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const sentences = text.trim() ? (text.match(/[.!?。！？]+/g) || []).length || 1 : 0;
    const bytes = new TextEncoder().encode(text).length;
    return { chars, charsNoSpace, words, cjk, lines, sentences, bytes };
  }, [text]);

  const items: [string, string | number][] = [
    ["字符数", stats.chars],
    ["不含空白字符", stats.charsNoSpace],
    ["单词数", stats.words],
    ["中文字符", stats.cjk],
    ["行数", stats.lines],
    ["句子数（约）", stats.sentences],
    ["UTF-8 字节", stats.bytes],
  ];

  return (
    <div>
      <label className="label" htmlFor="t">输入或粘贴文本</label>
      <textarea id="t" className="textarea" value={text} onChange={(e) => setText(e.target.value)} style={{ minHeight: 220, fontFamily: "inherit" }} placeholder="开始输入，统计数据会实时更新…" />
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", marginTop: 16 }}>
        {items.map(([k, v]) => (
          <div key={k} className="card" style={{ padding: 12 }}>
            <div className="label" style={{ marginBottom: 4 }}>{k}</div>
            <div className="mono" style={{ fontSize: "1.2rem", color: "var(--accent)" }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
''')

w("src/tools/TextDiff.tsx", r'''"use client";

import { useMemo, useState } from "react";

function diffLines(a: string, b: string) {
  const as = a.split("\n");
  const bs = b.split("\n");
  // simple LCS-based line diff
  const m = as.length;
  const n = bs.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = as[i] === bs[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const rows: { type: "same" | "del" | "add"; text: string }[] = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (as[i] === bs[j]) {
      rows.push({ type: "same", text: as[i] });
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({ type: "del", text: as[i] });
      i++;
    } else {
      rows.push({ type: "add", text: bs[j] });
      j++;
    }
  }
  while (i < m) rows.push({ type: "del", text: as[i++] });
  while (j < n) rows.push({ type: "add", text: bs[j++] });
  return rows;
}

export default function TextDiff() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const rows = useMemo(() => diffLines(left, right), [left, right]);
  const stats = useMemo(() => ({
    same: rows.filter((r) => r.type === "same").length,
    del: rows.filter((r) => r.type === "del").length,
    add: rows.filter((r) => r.type === "add").length,
  }), [rows]);

  return (
    <div>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
        <div>
          <label className="label" htmlFor="l">原文</label>
          <textarea id="l" className="textarea" value={left} onChange={(e) => setLeft(e.target.value)} style={{ minHeight: 180, fontFamily: "inherit" }} />
        </div>
        <div>
          <label className="label" htmlFor="r">修改后</label>
          <textarea id="r" className="textarea" value={right} onChange={(e) => setRight(e.target.value)} style={{ minHeight: 180, fontFamily: "inherit" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, margin: "12px 0", color: "var(--text-dim)", fontSize: ".875rem", flexWrap: "wrap" }}>
        <span>相同 {stats.same}</span>
        <span style={{ color: "var(--error)" }}>删除 {stats.del}</span>
        <span style={{ color: "var(--success)" }}>新增 {stats.add}</span>
      </div>
      <div className="card mono" style={{ padding: 12, maxHeight: 320, overflow: "auto", fontSize: ".85rem" }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            padding: "2px 6px",
            background: r.type === "del" ? "rgba(248,113,113,.12)" : r.type === "add" ? "rgba(52,211,153,.12)" : "transparent",
            color: r.type === "del" ? "var(--error)" : r.type === "add" ? "var(--success)" : "var(--text-muted)",
            whiteSpace: "pre-wrap",
          }}>
            {r.type === "del" ? "- " : r.type === "add" ? "+ " : "  "}
            {r.text || " "}
          </div>
        ))}
      </div>
    </div>
  );
}
''')

w("src/tools/MarkdownPreview.tsx", r'''"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Minimal local markdown renderer — no network, no deps. */
function renderMarkdown(src: string): string {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inCode = false;
  let inList = false;
  for (const raw of lines) {
    const line = raw;
    if (line.startsWith("```")) {
      if (inCode) { html.push("</code></pre>"); inCode = false; }
      else { html.push("<pre><code>"); inCode = true; }
      continue;
    }
    if (inCode) { html.push(escapeHtml(line) + "\n"); continue; }

    if (/^#{1,6}\s/.test(line)) {
      const level = line.match(/^#+/)![0].length;
      const text = line.replace(/^#+\s/, "");
      html.push(`<h${level}>${inline(text)}</h${level}>`);
      continue;
    }
    if (/^>\s?/.test(line)) {
      html.push(`<blockquote>${inline(line.replace(/^>\s?/, ""))}</blockquote>`);
      continue;
    }
    if (/^[-*+]\s+/.test(line)) {
      if (!inList) { html.push("<ul>"); inList = true; }
      html.push(`<li>${inline(line.replace(/^[-*+]\s+/, ""))}</li>`);
      continue;
    }
    if (inList) { html.push("</ul>"); inList = false; }
    if (line.trim() === "") { html.push(""); continue; }
    if (/^---+$/.test(line.trim())) { html.push("<hr/>"); continue; }
    html.push(`<p>${inline(line)}</p>`);
  }
  if (inCode) html.push("</code></pre>");
  if (inList) html.push("</ul>");
  return html.join("\n");
}

function inline(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, t, href) => {
    const safe = /^(https?:|#|\/)/i.test(href) ? href : "#";
    return `<a href="${safe}" rel="noopener noreferrer" target="_blank">${t}</a>`;
  });
  return s;
}

const sample = `# Markdown 预览

这是 **加粗**，这是 *斜体*，这是 \`行内代码\`。

## 列表
- 项目一
- 项目二

## 代码
\`\`\`js
console.log("hello toolbox");
\`\`\`

## 引用
> 所有处理都在浏览器本地完成。
`;

export default function MarkdownPreview() {
  const [text, setText] = useState(sample);
  const html = useMemo(() => renderMarkdown(text), [text]);

  return (
    <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span className="label" style={{ margin: 0 }}>Markdown</span>
          <CopyButton value={text} label="复制原文" className="btn btn-ghost" />
        </div>
        <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} style={{ minHeight: 360, fontFamily: "inherit" }} />
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span className="label" style={{ margin: 0 }}>预览</span>
          <CopyButton value={html} label="复制 HTML" className="btn btn-ghost" />
        </div>
        <div
          className="card"
          style={{ minHeight: 360, padding: 16, overflow: "auto" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
''')

# generators
w("src/tools/PasswordGen.tsx", r'''"use client";

import { useCallback, useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
};

function randomInt(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

export default function PasswordGen() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ lower: true, upper: true, digits: true, symbols: true });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const generate = useCallback(() => {
    const pool =
      (opts.lower ? SETS.lower : "") +
      (opts.upper ? SETS.upper : "") +
      (opts.digits ? SETS.digits : "") +
      (opts.symbols ? SETS.symbols : "");
    if (!pool) { setError("请至少选择一种字符类型"); return; }
    setError("");
    const out: string[] = [];
    for (let i = 0; i < length; i++) out.push(pool[randomInt(pool.length)]);
    // ensure at least one from each selected set
    const required = [
      opts.lower ? SETS.lower : null,
      opts.upper ? SETS.upper : null,
      opts.digits ? SETS.digits : null,
      opts.symbols ? SETS.symbols : null,
    ].filter(Boolean) as string[];
    required.forEach((set, i) => {
      if (i < out.length) out[i] = set[randomInt(set.length)];
    });
    // shuffle
    for (let i = out.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [out[i], out[j]] = [out[j], out[i]];
    }
    setPassword(out.join(""));
  }, [length, opts]);

  useEffect(() => { generate(); }, [generate]);

  return (
    <div>
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div className="label">生成结果</div>
        <div className="mono" style={{ fontSize: "1.15rem", wordBreak: "break-all", color: "var(--accent)" }}>{password || "—"}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={generate}>重新生成</button>
          <CopyButton value={password} />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="len">长度：{length}</label>
        <input id="len" className="range" type="range" min={6} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 14 }}>
        {([
          ["lower", "小写字母 a-z"],
          ["upper", "大写字母 A-Z"],
          ["digits", "数字 0-9"],
          ["symbols", "符号"],
        ] as const).map(([key, label]) => (
          <label key={key} style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--text-muted)" }}>
            <input
              type="checkbox"
              checked={opts[key]}
              onChange={(e) => setOpts((o) => ({ ...o, [key]: e.target.checked }))}
            />
            {label}
          </label>
        ))}
      </div>
      {error && <div style={{ marginTop: 10, color: "var(--error)" }}>{error}</div>}
      <p style={{ color: "var(--text-dim)", fontSize: ".85rem", marginTop: 14 }}>
        使用浏览器 crypto.getRandomValues 本地生成，不会上传或记录。
      </p>
    </div>
  );
}
''')

w("src/tools/RandomNumber.tsx", r'''"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

function randInt(min: number, max: number): number {
  const range = max - min + 1;
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return min + (arr[0] % range);
}

export default function RandomNumber() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>([]);

  function generate() {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    const n = Math.min(1000, Math.max(1, count));
    if (unique && hi - lo + 1 < n) {
      setResults([]);
      alert("范围过小，无法生成不重复的随机数");
      return;
    }
    const set = new Set<number>();
    const out: number[] = [];
    while (out.length < n) {
      const v = randInt(lo, hi);
      if (unique) {
        if (!set.has(v)) { set.add(v); out.push(v); }
      } else out.push(v);
    }
    setResults(out);
  }

  return (
    <div>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))" }}>
        <div>
          <label className="label" htmlFor="min">最小值</label>
          <input id="min" className="input" type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} />
        </div>
        <div>
          <label className="label" htmlFor="max">最大值</label>
          <input id="max" className="input" type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} />
        </div>
        <div>
          <label className="label" htmlFor="count">数量</label>
          <input id="count" className="input" type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} />
        </div>
      </div>
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12, color: "var(--text-muted)" }}>
        <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} />
        不重复
      </label>
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={generate}>生成</button>
        <CopyButton value={results.join(", ")} />
      </div>
      {results.length > 0 && (
        <div className="mono card" style={{ marginTop: 14, padding: 14, wordBreak: "break-all", maxHeight: 240, overflow: "auto" }}>
          {results.join(", ")}
        </div>
      )}
    </div>
  );
}
''')

w("src/tools/RandomColor.tsx", r'''"use client";

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
''')

w("src/tools/LoremGen.tsx", r'''"use client";

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
''')

print("text+gen done")
