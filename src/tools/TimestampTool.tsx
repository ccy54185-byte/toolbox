"use client";

import { useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function TimestampTool() {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  const [input, setInput] = useState("");
  const [unit, setUnit] = useState<"s" | "ms">("s");
  const [dateInput, setDateInput] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const parsed = (() => {
    if (!input.trim()) return "";
    const n = Number(input.trim());
    if (!Number.isFinite(n)) return "无效时间戳";
    const ms = unit === "s" ? n * 1000 : n;
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return "无效时间戳";
    return d.toLocaleString() + "\nISO: " + d.toISOString();
  })();

  const fromDate = (() => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return "无效日期";
    return `秒：${Math.floor(d.getTime() / 1000)}\n毫秒：${d.getTime()}`;
  })();

  return (
    <div>
      <div className="card" style={{ padding: 14, marginBottom: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div className="label">当前 Unix 时间戳（秒）</div>
          <div className="mono" style={{ fontSize: "1.25rem", color: "var(--accent)" }}>{now}</div>
        </div>
        <CopyButton value={String(now)} label="复制当前" />
      </div>

      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
        <div>
          <div className="label">时间戳 → 日期</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="例如 1710000000" />
            <select className="select" style={{ width: 90 }} value={unit} onChange={(e) => setUnit(e.target.value as "s" | "ms")}>
              <option value="s">秒</option>
              <option value="ms">毫秒</option>
            </select>
          </div>
          <pre className="mono" style={{ marginTop: 8, whiteSpace: "pre-wrap", color: "var(--text-muted)", fontSize: ".9rem" }}>{parsed}</pre>
        </div>
        <div>
          <div className="label">日期 → 时间戳</div>
          <input className="input" type="datetime-local" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
          <pre className="mono" style={{ marginTop: 8, whiteSpace: "pre-wrap", color: "var(--text-muted)", fontSize: ".9rem" }}>{fromDate}</pre>
        </div>
      </div>
    </div>
  );
}
