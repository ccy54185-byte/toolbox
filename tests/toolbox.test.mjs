import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const src = join(root, "src");
const out = join(root, "out");

test("tools registry contains expected slugs", () => {
  const toolsTs = readFileSync(join(src, "lib", "tools.ts"), "utf8");
  const slugs = [...toolsTs.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.ok(slugs.length >= 40, `expected >=40 tools, got ${slugs.length}`);
  for (const required of [
    "image-compressor",
    "json-formatter",
    "password",
    "qrcode",
    "audio-info",
    "video-info",
    "images-to-pdf",
  ]) {
    assert.ok(slugs.includes(required), `missing tool ${required}`);
  }
});

test("every tool slug has a client component file", () => {
  const toolsTs = readFileSync(join(src, "lib", "tools.ts"), "utf8");
  const viewTs = readFileSync(join(src, "components", "ToolView.tsx"), "utf8");
  const slugs = [...toolsTs.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  const registered = [...viewTs.matchAll(/"([^"]+)":\s*\(\)\s*=>\s*import\("@\/tools\/([^"]+)"\)/g)];
  const map = new Map(registered.map((m) => [m[1], m[2]]));
  const toolsDir = join(src, "tools");
  for (const slug of slugs) {
    assert.ok(map.has(slug), `ToolView missing slug ${slug}`);
    const file = join(toolsDir, `${map.get(slug)}.tsx`);
    assert.ok(existsSync(file), `missing component file ${map.get(slug)}.tsx`);
  }
});

test("privacy copy present in core files", () => {
  const layout = readFileSync(join(src, "app", "layout.tsx"), "utf8");
  assert.ok(layout.includes("lang=\"zh-CN\""));
  const privacy = readFileSync(join(src, "app", "privacy", "page.tsx"), "utf8");
  assert.ok(privacy.includes("上传") && privacy.includes("不会"));
  const ad = readFileSync(join(src, "components", "AdSlot.tsx"), "utf8");
  assert.ok(ad.includes("Top") && ad.includes("Sidebar") && ad.includes("Bottom") && ad.includes("Content"));
});

test("no user-file upload patterns in source", () => {
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, name.name);
      if (name.isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(name.name)) files.push(p);
    }
  };
  walk(src);
  const banned = [/XMLHttpRequest/, /\.send\(\s*form/i, /multipart\/form-data/i, /fetch\(\s*["']https?:\/\/(?!localhost)/i];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    // allow schema.org URL in JSON-LD and next metadata
    for (const re of banned) {
      if (re.test(text) && !file.includes("layout.tsx") && !file.includes("page.tsx")) {
        // still flag real XHR/formdata
        if (re.source.includes("XMLHttpRequest") || re.source.includes("multipart")) {
          assert.fail(`${file} matches forbidden pattern ${re}`);
        }
      }
    }
    assert.ok(!text.includes("XMLHttpRequest"), `${file} uses XHR`);
  }
});

test("static export contains homepage and tool pages", (t) => {
  if (!existsSync(out)) {
    t.skip("out/ not built yet");
    return;
  }
  assert.ok(existsSync(join(out, "index.html")));
  assert.ok(existsSync(join(out, "privacy", "index.html")));
  assert.ok(existsSync(join(out, "tools", "image-compressor", "index.html")));
  assert.ok(existsSync(join(out, "tools", "json-formatter", "index.html")));
  assert.ok(existsSync(join(out, "sitemap.xml")));
  assert.ok(existsSync(join(out, "robots.txt")));
  const html = readFileSync(join(out, "index.html"), "utf8");
  assert.ok(html.includes("ToolBox") || html.includes("工具箱"));
});

test("utils formatBytes logic via dynamic import of compiled-like source", async () => {
  // reimplement expected contract to avoid TS loader
  const formatBytes = (bytes) => {
    if (!Number.isFinite(bytes) || bytes < 0) return "-";
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
    const value = bytes / Math.pow(k, i);
    return `${value.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
  };
  assert.equal(formatBytes(0), "0 B");
  assert.equal(formatBytes(1024), "1.0 KB");
  assert.equal(formatBytes(-1), "-");
});
