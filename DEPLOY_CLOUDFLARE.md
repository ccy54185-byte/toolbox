# Cloudflare Pages 部署说明

本项目是**纯静态网站**（Next.js `output: 'export'`），不依赖服务端。

## 方式一：直接上传（最快）

1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Upload assets**
2. 上传文件夹：`cloudflare-deploy/`  
   或上传压缩包：`toolbox-cloudflare-pages.zip`
3. 项目命名后点击 **Deploy site**

部署完成后即可通过 `https://<你的项目>.pages.dev` 访问。

> 上传的是**静态产物**，不是 Node 源码。文件夹里应直接能看到 `index.html`。

## 方式二：Git 连接（可持续更新）

1. 将本仓库推送到 GitHub（你本地已有 Git，本说明不强制 push）
2. Cloudflare → Create → Pages → **Connect to Git**
3. 构建设置：
   - **Framework preset**: Next.js (Static HTML Export) 或 Custom
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - Node 版本：20+
4. 保存并部署

每次 push 后会自动重新构建。

## 方式三：Wrangler CLI（可选）

```bash
npx wrangler pages deploy cloudflare-deploy --project-name=toolbox
```

## 部署前请改域名配置

编辑 `src/lib/categories.ts` 中的 `SITE.url`，改成你的正式域名，例如：

```ts
url: "https://toolbox.pages.dev"
```

然后重新 `npm run build`，再上传 `out/`（或刷新 `cloudflare-deploy/`）。

`sitemap.xml` / `canonical` / OpenGraph 会使用该 URL。

## 产物说明

| 路径 | 用途 |
|------|------|
| `out/` | Next.js 静态导出结果 |
| `cloudflare-deploy/` | 可直接上传的部署目录（含 `_headers`） |
| `toolbox-cloudflare-pages.zip` | 同上内容的 zip，便于拖拽上传 |

## 本地预览静态产物

```bash
npx serve out
```

或任意静态服务器指向 `cloudflare-deploy/`。
