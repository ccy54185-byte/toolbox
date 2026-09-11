"use client";

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
