export function buildPdfFromJpegs(
  pages: { bytes: Uint8Array; width: number; height: number }[]
): Blob {
  if (!pages.length) throw new Error("请至少添加一张图片");
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  let offset = 0;
  const offsets: number[] = [];

  const push = (data: Uint8Array | string) => {
    const bytes = typeof data === "string" ? encoder.encode(data) : data;
    chunks.push(bytes);
    offset += bytes.length;
  };

  type PdfObj = { id: number; body: string; stream?: Uint8Array };
  const objects: PdfObj[] = [];
  let nextId = 1;
  const catalogId = nextId++;
  const pagesId = nextId++;
  const pageIds: number[] = [];

  for (const page of pages) {
    const contentId = nextId++;
    const imageId = nextId++;
    const pageId = nextId++;
    pageIds.push(pageId);
    objects.push({
      id: pageId,
      body: `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${page.width} ${page.height}] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    });
    const content = `q ${page.width} 0 0 ${page.height} 0 0 cm /Im0 Do Q`;
    objects.push({
      id: contentId,
      body: `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    });
    objects.push({
      id: imageId,
      body: `<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.bytes.length} >>`,
      stream: page.bytes,
    });
  }

  objects.push({
    id: pagesId,
    body: `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`,
  });
  objects.push({ id: catalogId, body: `<< /Type /Catalog /Pages ${pagesId} 0 R >>` });
  objects.sort((a, b) => a.id - b.id);

  push("%PDF-1.4\n");
  for (const obj of objects) {
    offsets[obj.id] = offset;
    push(`${obj.id} 0 obj\n`);
    push(obj.body);
    if (obj.stream) {
      push("\n");
      push(obj.stream);
      push("\nendstream\n");
    } else {
      push("\n");
    }
    push("endobj\n");
  }

  const xrefStart = offset;
  const maxId = nextId - 1;
  push(`xref\n0 ${maxId + 1}\n`);
  push("0000000000 65535 f \n");
  for (let i = 1; i <= maxId; i++) {
    push(`${String(offsets[i] ?? 0).padStart(10, "0")} 00000 n \n`);
  }
  push(
    `trailer\n<< /Size ${maxId + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
  );

  const total = chunks.reduce((s, c) => s + c.length, 0);
  const out = new Uint8Array(total);
  let p = 0;
  for (const c of chunks) {
    out.set(c, p);
    p += c.length;
  }
  return new Blob([out], { type: "application/pdf" });
}

export function countPdfPages(data: ArrayBuffer): number {
  const text = new TextDecoder("latin1").decode(data);
  const matches = text.match(/\/Type\s*\/Page[^s]/g);
  if (matches?.length) return matches.length;
  const countMatch = text.match(/\/Count\s+(\d+)/);
  if (countMatch) return parseInt(countMatch[1], 10);
  return 0;
}
