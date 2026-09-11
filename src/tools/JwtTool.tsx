"use client";

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
