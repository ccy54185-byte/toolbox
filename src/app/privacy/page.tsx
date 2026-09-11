import type { Metadata } from "next";
import { SITE } from "@/lib/categories";

export const metadata: Metadata = {
  title: "隐私说明",
  description: `${SITE.name} 的隐私政策：文件本地处理，不上传用户文件。`,
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <div className="container-app" style={{ padding: "2rem 0 3rem", maxWidth: 760 }}>
      <h1 style={{ marginTop: 0 }}>隐私说明</h1>
      <p style={{ color: "var(--text-muted)" }}>
        {SITE.name} 以“隐私优先、本地处理”为默认原则。本页面说明我们如何对待用户数据。
      </p>

      <h2>用户文件</h2>
      <p>
        对于可在浏览器本地完成的处理，我们不会将用户文件上传到服务器，也不会发送到第三方文件处理 API。
        处理流程为：用户文件 → 浏览器本地 JavaScript/WASM → 结果 → 用户下载。
      </p>

      <h2>本地存储</h2>
      <p>
        部分工具（如在线记事本）可能使用浏览器 LocalStorage 保存草稿。这些内容只保存在您的设备上，不会同步到服务器。
        清除浏览器站点数据会删除这些内容。
      </p>

      <h2>网络请求</h2>
      <p>
        网站本身可能加载静态资源（HTML/CSS/JS）。我们不会因“用户文件处理”而发起上传请求。
        未来若接入广告，广告组件将独立封装，且不应用于上传用户文件。
      </p>

      <h2>广告（预留）</h2>
      <p>
        站点预留了 Top / Sidebar / Bottom / Content 广告位。当前显示占位内容，便于后续替换为 AdSense 等网络。
        广告不会遮挡工具操作区。
      </p>

      <h2>联系与更新</h2>
      <p>若隐私说明有重大变更，将在本页面更新。</p>
    </div>
  );
}
