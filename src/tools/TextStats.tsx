"use client";

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
