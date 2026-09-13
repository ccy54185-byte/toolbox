import Link from "next/link";
import type { ToolMeta } from "@/lib/categories";

export default function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link href={`/tools/${tool.slug}/`} className="apple-tool">
      <h3>
        {tool.name}
        {tool.status === "beta" && (
          <span className="badge" style={{ marginLeft: 8, verticalAlign: "middle" }}>
            Beta
          </span>
        )}
      </h3>
      <p>{tool.description}</p>
      <span className="apple-tool-go" aria-hidden>
        →
      </span>
    </Link>
  );
}
