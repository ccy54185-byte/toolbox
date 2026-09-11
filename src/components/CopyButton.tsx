"use client";

import { useState } from "react";
import { copyText } from "@/lib/utils";

export default function CopyButton({
  value,
  label = "复制",
  className = "btn btn-secondary",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={className}
      disabled={!value}
      onClick={async () => {
        const ok = await copyText(value);
        if (ok) {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        }
      }}
    >
      {done ? "已复制" : label}
    </button>
  );
}
