"use client";

import { useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { downloadText } from "@/lib/utils";

const KEY = "toolbox.note.v1";

export default function NotePad() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v) setText(v);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(KEY, text);
        setSaved(true);
        setTimeout(() => setSaved(false), 1200);
      } catch { /* quota */ }
    }, 400);
    return () => clearTimeout(id);
  }, [text]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 8, flexWrap: "wrap" }}>
        <span className="label" style={{ margin: 0 }}>
          内容保存在本浏览器 LocalStorage，不上传服务器
          {saved && <span style={{ color: "var(--success)", marginLeft: 8 }}>已自动保存</span>}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <CopyButton value={text} />
          <button className="btn btn-secondary" onClick={() => downloadText(text, "note.txt")}>下载</button>
          <button className="btn btn-ghost" onClick={() => { if (confirm("确定清空笔记？")) setText(""); }}>清空</button>
        </div>
      </div>
      <textarea
        className="textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ minHeight: 320, fontFamily: "inherit" }}
        placeholder="在这里输入笔记…"
      />
    </div>
  );
}
