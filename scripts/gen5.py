from pathlib import Path
ROOT = Path(r"C:\Users\16600\toolbox")

def w(rel, content):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    if content.startswith("\n"): content = content[1:]
    p.write_text(content, encoding="utf-8")
    print("wrote", rel, p.stat().st_size)

w("src/tools/JsonFormatter.tsx", r'''"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [mode, setMode] = useState<"format" | "minify">("format");

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true, value: "", error: "" };
    try {
      const parsed = JSON.parse(input);
      const value = mode === "format" ? JSON.stringify(parsed, null, indent) : JSON.stringify(parsed);
      return { ok: true, value, error: "" };
    } catch (e) {
      return { ok: false, value: "", error: e instanceof Error ? e.message : "JSON 无效" };
    }
  }, [input, indent, mode]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button className={`btn ${mode === "format" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("format")}>格式化</button>
        <button className={`btn ${mode === "minify" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("minify")}>压缩</button>
        <select className="select" style={{ width: "auto", minWidth: 120 }} value={indent} onChange={(e) => setIndent(Number(e.target.value))} disabled={mode === "minify"}>
          <option value={2}>缩进 2</option>
          <option value={4}>缩进 4</option>
          <option value={0}>紧凑</option>
        </select>
        <CopyButton value={result.value} />
      </div>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
        <div>
          <label className="label" htmlFor="in">输入 JSON</label>
          <textarea id="in" className="textarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"hello":"world"}' style={{ minHeight: 280 }} />
        </div>
        <div>
          <label className="label" htmlFor="out">结果</label>
          <textarea id="out" className="textarea" readOnly value={result.error ? "" : result.value} style={{ minHeight: 280 }} placeholder="输出将显示在这里" />
        </div>
      </div>
      {result.error && (
        <div style={{ marginTop: 10, color: "var(--error)", fontSize: ".875rem" }}>解析失败：{result.error}</div>
      )}
    </div>
  );
}
''')

w("src/tools/JsonEscape.tsx", r'''"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function JsonEscape() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"escape" | "unescape">("escape");

  const result = useMemo(() => {
    if (!input) return "";
    try {
      if (mode === "escape") {
        return JSON.stringify(input).slice(1, -1);
      }
      return JSON.parse(`"${input.replace(/"/g, '\\"')}"`);
    } catch {
      try {
        return JSON.parse(`"${input}"`);
      } catch {
        return "（无法反转义，请检查输入）";
      }
    }
  }, [input, mode]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button className={`btn ${mode === "escape" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("escape")}>转义</button>
        <button className={`btn ${mode === "unescape" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("unescape")}>反转义</button>
        <CopyButton value={result} />
      </div>
      <label className="label" htmlFor="in">输入</label>
      <textarea id="in" className="textarea" value={input} onChange={(e) => setInput(e.target.value)} style={{ minHeight: 140 }} />
      <label className="label" htmlFor="out" style={{ marginTop: 12 }}>输出</label>
      <textarea id="out" className="textarea" readOnly value={result} style={{ minHeight: 140 }} />
    </div>
  );
}
''')

w("src/tools/Base64Tool.tsx", r'''"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

function encodeUtf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin);
}

function decodeUtf8(b64: string): string {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const result = useMemo(() => {
    if (!input) return { value: "", error: "" };
    try {
      return { value: mode === "encode" ? encodeUtf8(input) : decodeUtf8(input.trim()), error: "" };
    } catch {
      return { value: "", error: mode === "decode" ? "无效的 Base64 字符串" : "编码失败" };
    }
  }, [input, mode]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button className={`btn ${mode === "encode" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("encode")}>编码</button>
        <button className={`btn ${mode === "decode" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("decode")}>解码</button>
        <CopyButton value={result.value} />
      </div>
      <label className="label" htmlFor="in">输入</label>
      <textarea id="in" className="textarea" value={input} onChange={(e) => setInput(e.target.value)} style={{ minHeight: 140 }} placeholder={mode === "encode" ? "任意文本（支持中文）" : "Base64 字符串"} />
      <label className="label" htmlFor="out" style={{ marginTop: 12 }}>输出</label>
      <textarea id="out" className="textarea" readOnly value={result.value} style={{ minHeight: 140 }} />
      {result.error && <div style={{ marginTop: 8, color: "var(--error)" }}>{result.error}</div>}
    </div>
  );
}
''')

w("src/tools/UrlEncode.tsx", r'''"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function UrlEncode() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode" | "component">("component");

  const result = useMemo(() => {
    if (!input) return { value: "", error: "" };
    try {
      if (mode === "encode") return { value: encodeURI(input), error: "" };
      if (mode === "component") return { value: encodeURIComponent(input), error: "" };
      return { value: decodeURIComponent(input), error: "" };
    } catch {
      return { value: "", error: mode === "decode" ? "无效的 URL 编码" : "编码失败" };
    }
  }, [input, mode]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button className={`btn ${mode === "component" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("component")}>encodeURIComponent</button>
        <button className={`btn ${mode === "encode" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("encode")}>encodeURI</button>
        <button className={`btn ${mode === "decode" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("decode")}>解码</button>
        <CopyButton value={result.value} />
      </div>
      <label className="label" htmlFor="in">输入</label>
      <textarea id="in" className="textarea" value={input} onChange={(e) => setInput(e.target.value)} style={{ minHeight: 120 }} />
      <label className="label" htmlFor="out" style={{ marginTop: 12 }}>输出</label>
      <textarea id="out" className="textarea" readOnly value={result.value} style={{ minHeight: 120 }} />
      {result.error && <div style={{ marginTop: 8, color: "var(--error)" }}>{result.error}</div>}
    </div>
  );
}
''')

w("src/tools/UuidTool.tsx", r'''"use client";

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
''')

w("src/tools/HashTool.tsx", r'''"use client";

import { useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";

const algos = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

export default function HashTool() {
  const [input, setInput] = useState("");
  const [algo, setAlgo] = useState<(typeof algos)[number]>("SHA-256");
  const [hash, setHash] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!input) { setHash(""); setError(""); return; }
      try {
        const data = new TextEncoder().encode(input);
        const buf = await crypto.subtle.digest(algo, data);
        const hex = Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
        if (!cancelled) { setHash(hex); setError(""); }
      } catch {
        if (!cancelled) { setError("当前浏览器不支持该算法"); setHash(""); }
      }
    }
    run();
    return () => { cancelled = true; };
  }, [input, algo]);

  return (
    <div>
      <label className="label" htmlFor="in">输入文本</label>
      <textarea id="in" className="textarea" value={input} onChange={(e) => setInput(e.target.value)} style={{ minHeight: 140 }} />
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {algos.map((a) => (
          <button key={a} className={`btn ${algo === a ? "btn-primary" : "btn-secondary"}`} style={{ minHeight: 40 }} onClick={() => setAlgo(a)}>{a}</button>
        ))}
        <CopyButton value={hash} />
      </div>
      {error && <div style={{ marginTop: 10, color: "var(--error)" }}>{error}</div>}
      {hash && (
        <div style={{ marginTop: 14 }}>
          <div className="label">{algo} 摘要</div>
          <div className="mono" style={{ wordBreak: "break-all", padding: 12, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8 }}>{hash}</div>
        </div>
      )}
    </div>
  );
}
''')

w("src/tools/JwtTool.tsx", r'''"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

function b64urlDecode(input: string): string {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export default function JwtTool() {
  const [token, setToken] = useState("");

  const parts = useMemo(() => {
    const t = token.trim();
    if (!t) return null;
    const segs = t.split(".");
    if (segs.length < 2) return { error: "JWT 至少需要 Header 和 Payload 两段" };
    try {
      const header = JSON.parse(b64urlDecode(segs[0]));
      const payload = JSON.parse(b64urlDecode(segs[1]));
      const exp = typeof payload.exp === "number" ? new Date(payload.exp * 1000).toLocaleString() : null;
      const iat = typeof payload.iat === "number" ? new Date(payload.iat * 1000).toLocaleString() : null;
      return {
        error: "",
        header,
        payload,
        exp,
        iat,
        signature: segs[2] || "",
      };
    } catch {
      return { error: "无法解码，请确认粘贴的是完整 JWT" };
    }
  }, [token]);

  return (
    <div>
      <label className="label" htmlFor="jwt">粘贴 JWT（仅本地解码，不验证签名）</label>
      <textarea id="jwt" className="textarea" value={token} onChange={(e) => setToken(e.target.value)} style={{ minHeight: 120 }} placeholder="eyJhbGciOi..." />
      {parts?.error && <div style={{ marginTop: 10, color: "var(--error)" }}>{parts.error}</div>}
      {parts && !parts.error && (
        <div style={{ display: "grid", gap: 12, marginTop: 14, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span className="label" style={{ margin: 0 }}>Header</span>
              <CopyButton value={JSON.stringify(parts.header, null, 2)} label="复制" className="btn btn-ghost" />
            </div>
            <pre className="mono" style={{ margin: 0, padding: 12, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, overflow: "auto", maxHeight: 240, fontSize: ".8rem" }}>{JSON.stringify(parts.header, null, 2)}</pre>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span className="label" style={{ margin: 0 }}>Payload</span>
              <CopyButton value={JSON.stringify(parts.payload, null, 2)} label="复制" className="btn btn-ghost" />
            </div>
            <pre className="mono" style={{ margin: 0, padding: 12, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, overflow: "auto", maxHeight: 240, fontSize: ".8rem" }}>{JSON.stringify(parts.payload, null, 2)}</pre>
          </div>
        </div>
      )}
      {parts && !parts.error && (
        <div style={{ marginTop: 12, color: "var(--text-dim)", fontSize: ".875rem" }}>
          {parts.exp && <div>过期时间 exp：{parts.exp}</div>}
          {parts.iat && <div>签发时间 iat：{parts.iat}</div>}
          <div>签名段长度：{parts.signature ? parts.signature.length : 0} 字符（未验证）</div>
        </div>
      )}
    </div>
  );
}
''')

w("src/tools/TimestampTool.tsx", r'''"use client";

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
''')

print("dev tools done")
