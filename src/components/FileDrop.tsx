"use client";

import { useCallback, useRef, useState } from "react";

interface Props {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  hint?: string;
  label?: string;
}

export default function FileDrop({
  accept,
  multiple = false,
  onFiles,
  hint = "拖拽文件到此处，或点击选择",
  label = "选择文件",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list || !list.length) return;
      onFiles(Array.from(list));
    },
    [onFiles]
  );

  return (
    <div
      className={`dropzone p-8 text-center ${dragging ? "dragging" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <div
        aria-hidden
        className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 16V4m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="font-medium">{hint}</div>
      <div className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
        支持拖放 · 本地处理不上传
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
