export default function PrivacyBanner({
  note,
}: {
  note?: string;
}) {
  return (
    <div className="privacy-banner" role="note">
      <span aria-hidden style={{ color: "var(--accent)", fontSize: "1rem", lineHeight: 1.2 }}>
        ⛨
      </span>
      <div>
        <strong>本地处理</strong>
        <div>{note || "文件仅在您的设备上处理，不会上传到服务器。"}</div>
      </div>
    </div>
  );
}
