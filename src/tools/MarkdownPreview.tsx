"use client";

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
