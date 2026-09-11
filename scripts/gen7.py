from pathlib import Path
ROOT = Path(r"C:\Users\16600\toolbox")

def w(rel, content):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    if content.startswith("\n"): content = content[1:]
    p.write_text(content, encoding="utf-8")
    print("wrote", rel, p.stat().st_size)

# Lightweight QR encoder (byte mode, versions 1-10, EC level M) — sufficient for URLs/text
# Based on public-domain algorithm structure; no deps.
w("src/lib/qr.ts", r'''"use client";

// Minimal QR Code generator for byte mode, ECC level M, versions 1-10.
// Self-contained for offline use.

type Ecc = { ecCodewordsPerBlock: number; blocks: number };

const ECC_M: Record<number, Ecc> = {
  1: { ecCodewordsPerBlock: 10, blocks: 1 },
  2: { ecCodewordsPerBlock: 16, blocks: 1 },
  3: { ecCodewordsPerBlock: 26, blocks: 1 },
  4: { ecCodewordsPerBlock: 18, blocks: 2 },
  5: { ecCodewordsPerBlock: 24, blocks: 2 },
  6: { ecCodewordsPerBlock: 16, blocks: 4 },
  7: { ecCodewordsPerBlock: 18, blocks: 4 },
  8: { ecCodewordsPerBlock: 22, blocks: 4 },
  9: { ecCodewordsPerBlock: 22, blocks: 5 },
  10: { ecCodewordsPerBlock: 26, blocks: 5 },
};

const DATA_CAPACITY: Record<number, number> = {
  1: 16, 2: 28, 3: 44, 4: 64, 5: 86, 6: 108, 7: 124, 8: 154, 9: 182, 10: 216,
};

// Alignment pattern positions
const ALIGN: Record<number, number[]> = {
  1: [],
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
  8: [6, 24, 42],
  9: [6, 26, 46],
  10: [6, 28, 50],
};

// GF(256) for Reed-Solomon
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(function initGf() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

function rsGenerator(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], EXP[i]);
    }
    poly = next;
  }
  return poly;
}

function rsEncode(data: number[], ecLen: number): number[] {
  const gen = rsGenerator(ecLen);
  const res = new Array(ecLen).fill(0);
  for (const d of data) {
    const factor = d ^ res[0];
    res.shift();
    res.push(0);
    for (let i = 0; i < gen.length - 1; i++) {
      res[i] ^= gfMul(gen[i + 1], factor);
    }
  }
  return res;
}

function encodeBytes(text: string): number[] {
  return Array.from(new TextEncoder().encode(text));
}

export function generateQrMatrix(text: string): boolean[][] {
  const bytes = encodeBytes(text);
  let version = 0;
  for (let v = 1; v <= 10; v++) {
    // byte mode header: 4 bits mode + length bits (8 for v1-9, 16 for v10)
    const lenBits = v < 10 ? 8 : 16;
    const needed = 4 + lenBits + bytes.length * 8;
    if (needed <= DATA_CAPACITY[v] * 8) { version = v; break; }
  }
  if (!version) throw new Error("内容过长，请缩短文本（支持约 200 字符）");

  const ecc = ECC_M[version];
  const totalData = DATA_CAPACITY[version];
  const lenBits = version < 10 ? 8 : 16;

  // Bit buffer
  const bits: number[] = [];
  const pushBits = (val: number, n: number) => {
    for (let i = n - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };
  pushBits(0b0100, 4); // byte mode
  pushBits(bytes.length, lenBits);
  for (const b of bytes) pushBits(b, 8);
  // terminator
  const capacityBits = totalData * 8;
  const term = Math.min(4, capacityBits - bits.length);
  for (let i = 0; i < term; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);
  const dataCodewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let v = 0;
    for (let j = 0; j < 8; j++) v = (v << 1) | bits[i + j];
    dataCodewords.push(v);
  }
  const pad = [0xec, 0x11];
  let pi = 0;
  while (dataCodewords.length < totalData) dataCodewords.push(pad[pi++ % 2]);

  // Split into blocks
  const blocks: number[][] = [];
  const eccBlocks: number[][] = [];
  const perBlock = Math.floor(totalData / ecc.blocks);
  const extra = totalData % ecc.blocks;
  let offset = 0;
  for (let i = 0; i < ecc.blocks; i++) {
    const size = perBlock + (i >= ecc.blocks - extra ? 1 : 0);
    const block = dataCodewords.slice(offset, offset + size);
    offset += size;
    blocks.push(block);
    eccBlocks.push(rsEncode(block, ecc.ecCodewordsPerBlock));
  }
  // Interleave
  const finalCw: number[] = [];
  const maxData = Math.max(...blocks.map((b) => b.length));
  for (let i = 0; i < maxData; i++) {
    for (const b of blocks) if (i < b.length) finalCw.push(b[i]);
  }
  for (let i = 0; i < ecc.ecCodewordsPerBlock; i++) {
    for (const b of eccBlocks) finalCw.push(b[i]);
  }

  // Matrix
  const size = version * 4 + 17;
  const modules: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const setFn = (r: number, c: number, val: boolean) => {
    if (r < 0 || c < 0 || r >= size || c >= size) return;
    modules[r][c] = val;
    reserved[r][c] = true;
  };

  // Finder patterns
  const placeFinder = (r0: number, c0: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const r1 = r0 + r, c1 = c0 + c;
        if (r1 < 0 || c1 < 0 || r1 >= size || c1 >= size) continue;
        const inRing = (r >= 0 && r <= 6 && (c === 0 || c === 6)) || (c >= 0 && c <= 6 && (r === 0 || r === 6));
        const inCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        setFn(r1, c1, inRing || inCore);
      }
    }
  };
  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Timing
  for (let i = 8; i < size - 8; i++) {
    setFn(6, i, i % 2 === 0);
    setFn(i, 6, i % 2 === 0);
  }

  // Alignment
  const centers = ALIGN[version];
  for (const r of centers) {
    for (const c of centers) {
      if ((r === 6 && c === 6) || (r === 6 && c === size - 7) || (r === size - 7 && c === 6)) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const ring = Math.max(Math.abs(dr), Math.abs(dc));
          setFn(r + dr, c + dc, ring !== 1);
        }
      }
    }
  }

  // Format info (ECC M = 00, mask will be applied later) — reserve format areas
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i++) {
    reserved[8][size - 1 - i] = true;
    reserved[size - 1 - i][8] = true;
  }
  reserved[size - 8][8] = true;

  // Version info for v>=7
  if (version >= 7) {
    for (let i = 0; i < 18; i++) {
      const r = Math.floor(i / 3);
      const c = size - 11 + (i % 3);
      reserved[r][c] = true;
      reserved[c][r] = true;
    }
  }

  // Place data bits with mask 0
  const dataBits: number[] = [];
  for (const cw of finalCw) {
    for (let i = 7; i >= 0; i--) dataBits.push((cw >> i) & 1);
  }
  let bitIdx = 0;
  let upward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--; // skip timing column
    for (let i = 0; i < size; i++) {
      const row = upward ? size - 1 - i : i;
      for (let c = 0; c < 2; c++) {
        const cc = col - c;
        if (reserved[row][cc]) continue;
        modules[row][cc] = bitIdx < dataBits.length ? dataBits[bitIdx++] === 1 : false;
      }
    }
    upward = !upward;
  }

  // Mask 0: (r+c)%2==0
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (reserved[r][c]) continue;
      if ((r + c) % 2 === 0) modules[r][c] = !modules[r][c];
    }
  }

  // Format info for ECC M + mask 0
  // formatBits: ECC M=00, mask 000 -> data = 0b00000, BCH...
  // Precomputed format for M/mask0 = 0x5412 >> ... actually standard table:
  // ECC L=01 M=00 Q=11 H=10; mask 0; format string for M/0 is 0x5412 (15 bits)
  const format = 0x5412;
  for (let i = 0; i < 15; i++) {
    const bit = ((format >> i) & 1) === 1;
    // top-left
    if (i < 6) setFn(8, i, bit);
    else if (i === 6) setFn(8, 7, bit);
    else if (i === 7) setFn(8, 8, bit);
    else if (i === 8) setFn(7, 8, bit);
    else setFn(14 - i, 8, bit);
    // copy
    if (i < 8) setFn(size - 1 - i, 8, bit);
    else setFn(8, size - 15 + i, bit);
  }
  setFn(size - 8, 8, true);

  return modules.map((row) => row.map((v) => !!v));
}

export function renderQrToCanvas(canvas: HTMLCanvasElement, matrix: boolean[][], scale = 8, margin = 4) {
  const size = matrix.length;
  const dim = (size + margin * 2) * scale;
  canvas.width = dim;
  canvas.height = dim;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法创建画布");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, dim, dim);
  ctx.fillStyle = "#000000";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) {
        ctx.fillRect((c + margin) * scale, (r + margin) * scale, scale, scale);
      }
    }
  }
}
''')

w("src/tools/QrCodeTool.tsx", r'''"use client";

import { useEffect, useRef, useState } from "react";
import { generateQrMatrix, renderQrToCanvas } from "@/lib/qr";
import { humanError } from "@/lib/utils";

export default function QrCodeTool() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(8);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const matrix = generateQrMatrix(text || " ");
      renderQrToCanvas(canvas, matrix, size);
      setError("");
    } catch (e) {
      setError(humanError(e));
    }
  }, [text, size]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qrcode.png";
    a.click();
  }

  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
      <div>
        <label className="label" htmlFor="t">文本 / URL</label>
        <textarea id="t" className="textarea" value={text} onChange={(e) => setText(e.target.value)} style={{ minHeight: 120, fontFamily: "inherit" }} />
        <div style={{ marginTop: 12 }}>
          <label className="label" htmlFor="s">模块大小：{size}px</label>
          <input id="s" className="range" type="range" min={4} max={16} value={size} onChange={(e) => setSize(Number(e.target.value))} />
        </div>
        <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={download}>下载 PNG</button>
        {error && <div style={{ marginTop: 10, color: "var(--error)", fontSize: ".875rem" }}>{error}</div>}
      </div>
      <div className="card" style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto", imageRendering: "pixelated" }} aria-label="二维码预览" />
      </div>
    </div>
  );
}
''')

w("src/tools/NotePad.tsx", r'''"use client";

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
''')

print("qr+note done")
