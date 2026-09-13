import type { Metadata } from "next";
import { SITE } from "@/lib/categories";

export const metadata: Metadata = {
  title: "更新日志",
  description: `${SITE.name} 版本更新记录：功能上线、修复与体验改进。`,
  alternates: { canonical: "/changelog/" },
};

const RELEASES = [
  {
    version: "1.2.0",
    date: "当前",
    title: "苹果风界面与运营页面",
    items: [
      "全站 UI 按内容优先与留白原则重构",
      "新增关于我们、服务条款、联系、FAQ、更新日志",
      "增强隐私政策（Cookie / 广告说明）",
      "页脚补齐法律与帮助链接",
      "法阵主视觉改为更克制的系统蓝",
    ],
  },
  {
    version: "1.1.0",
    date: "早期版本",
    title: "首页体验与关键修复",
    items: [
      "沉浸式首页：程序生成法阵 + 滚动叙事",
      "修复上滑后主文案消失、工具组件加载问题",
      "二维码改用成熟编码库，提升可扫性",
      "修复图片压缩在部分浏览器失败",
      "广告位预留（AdSense / Microsoft）且不遮挡操作",
    ],
  },
  {
    version: "1.0.0",
    date: "首发",
    title: "核心工具集上线",
    items: [
      "图片：压缩、转换、裁剪、旋转、拼接、分割、水印、去 EXIF、取色、Base64、信息",
      "开发者：JSON、Base64、URL、UUID、Hash、JWT、时间戳",
      "文本与生成：统计、Markdown、Diff、密码、随机数、颜色、Lorem、二维码、记事本",
      "音频 / 视频 / PDF 基础工具",
      "静态导出，可部署 Cloudflare Pages",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="tool-page legal-page">
      <h1 className="legal-title">更新日志</h1>
      <p className="legal-lead">记录主要版本变化。小修可能不会逐条列出。</p>

      <div className="legal-timeline">
        {RELEASES.map((r) => (
          <article key={r.version} className="legal-release">
            <div className="legal-release-head">
              <span className="legal-version">v{r.version}</span>
              <span className="legal-date">{r.date}</span>
            </div>
            <h2>{r.title}</h2>
            <ul>
              {r.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p style={{ color: "var(--text-tertiary)", fontSize: "0.9rem" }}>
        站点名称：{SITE.name} · 持续迭代中
      </p>
    </div>
  );
}
