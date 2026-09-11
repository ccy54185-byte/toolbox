# ToolBox

免费、隐私优先、本地处理的在线工具箱。

## 特点

- **免费使用**：无需注册 / 登录
- **隐私优先**：用户文件默认只在浏览器本地处理，不上传服务器
- **静态部署**：Next.js 静态导出，可部署到 Cloudflare Pages
- **广告预留**：Top / Sidebar / Bottom / Content 广告位已封装，当前为占位

## 本地启动

```bash
npm install
npm run dev
```

打开 http://localhost:3000

## 构建静态站点

```bash
npm run build
```

产物在 `out/` 目录，可直接托管。

## 技术栈

- Next.js 15 (App Router, `output: 'export'`)
- React 19 + TypeScript
- Tailwind CSS v4
- Web Canvas / Web Audio / Web Crypto / 自研本地 QR & PDF writer

## 工具列表

见首页与 `/tools/*` 分类页。已实现图片、开发者、文本、生成器、音频、视频（部分 Beta）、PDF 等工具。

## 隐私

见 `/privacy/`。原则：文件 → 浏览器本地处理 → 下载结果。

## 广告预留

`src/components/AdSlot.tsx` 预留：

- TopBannerAd
- SidebarAd
- BottomBannerAd
- ContentAd

后续替换组件内部即可接入 AdSense，无需改动工具逻辑。

## 已知限制

- 音频导出主要为 WAV（浏览器本地无可靠 MP3 编码器）
- 视频压缩/截取依赖 MediaRecorder，兼容性与耗时因浏览器而异（Beta）
- 部分浏览器不支持 AVIF 编码
- 超大文件受设备内存限制

## 测试

```bash
npm run lint
npm run typecheck
npm run build
npm test
```
