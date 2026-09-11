"use client";

import { useCallback, useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { downloadText } from "@/lib/utils";

function uuidV4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export default function UuidTool() {
  const [count, setCount] = useState(5);
  const [list, setList] = useState<string[]>([]);

  const generate = useCallback(() => {
    setList(Array.from({ length: Math.min(100, Math.max(1, count)) }, () => uuidV4()));
  }, [count]);

  useEffect(() => { generate(); }, [generate]);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, alignItems: "end", flexWrap: "wrap", marginBottom: 14 }}>
        <div>
          <label className="label" htmlFor="n">数量（1-100）</label>
          <input id="n" className="input" type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} style={{ width: 120 }} />
        </div>
        <button className="btn btn-primary" onClick={generate}>生成</button>
        <CopyButton value={list.join("\n")} label="复制全部" />
        <button className="btn btn-secondary" onClick={() => downloadText(list.join("\n"), "uuids.txt")}>下载</button>
      </div>
      <textarea className="textarea mono" readOnly value={list.join("\n")} style={{ minHeight: 260 }} />
    </div>
  );
}
