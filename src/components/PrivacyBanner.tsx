export default function PrivacyBanner({ note }: { note?: string }) {
  return (
    <div className="privacy-banner" role="note">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        style={{ flexShrink: 0, marginTop: 1, color: "var(--accent)" }}
      >
        <path
          d="M12 3l7 3v5.5c0 4.5-3 7.7-7 9.5-4-1.8-7-5-7-9.5V6l7-3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M9.2 12.1l1.9 1.9 3.7-3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        <strong>本地处理</strong>
        <div>{note || "文件仅在你的设备上处理，不会上传到服务器。"}</div>
      </div>
    </div>
  );
}
