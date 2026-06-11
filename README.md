# 北辰笔记 - 中文个人博客

一个基于 Next.js 16 + vinext 的克制式中文博客平台，采用 Cloudflare Workers 部署架构。

## 特性

### 核心功能
- 📝 **文章管理** - 分类为随笔(essay)和日记(diary)两种类型
- 🎯 **全屏阅读** - 三种全屏模式
  - 文章沉浸式阅读（隐藏导航和侧边栏）
  - 首页标题全屏展示
  - 整个网页全屏浏览
- 🗂️ **数据库支持** - Cloudflare D1 + Drizzle ORM
- 🔐 **管理后台** - `/admin` 路由支持文章编辑（需要认证）
- 📱 **响应式设计** - 手机、平板、桌面端完美适配

### 界面设计
- 清爽的极简主义设计
- 渐进式排版，重点突出
- 底部 padding 优化（100px），按钮与屏幕边缘有舒适间距
- 自定义焦点样式，移除蓝色轮廓框
- 灵动的全屏过渡效果

## 技术栈

```
前端框架:     Next.js 16 (App Router)
运行时:       Cloudflare Workers (via vinext)
数据库:       Cloudflare D1
ORM:          Drizzle
样式:         Tailwind CSS + 自定义 CSS
字体:         ZCOOL XiaoWei (中文显示字) + IBM Plex Mono
```

## 项目结构

```
.
├── app/
│   ├── layout.tsx              # 全局布局和 Header
│   ├── page.tsx                # 首页（带全屏标题）
│   ├── about/page.tsx          # 关于页面
│   ├── writing/page.tsx        # 文章列表
│   ├── diary/page.tsx          # 日记列表
│   ├── posts/[slug]/page.tsx   # 文章详情页
│   ├── admin/                  # 管理后台
│   │   ├── page.tsx            # 管理首页
│   │   ├── posts/[slug]/edit/  # 编辑文章
│   │   └── posts/new/          # 新建文章
│   ├── api/admin/              # 管理 API
│   │   ├── posts/route.ts      # 文章 CRUD
│   │   └── seed/route.ts       # 数据库初始化
│   ├── components/
│   │   ├── FullscreenButton.tsx        # 文章全屏按钮
│   │   ├── GlobalFullscreen.tsx        # 整体全屏按钮
│   │   └── TitleFullscreen.tsx         # 标题全屏组件
│   ├── lib/
│   │   ├── db-posts.ts         # 数据库查询函数
│   │   └── auth.ts             # 认证逻辑
│   ├── content.ts              # 静态文章数据（VPS 备用）
│   └── globals.css             # 全局样式
├── drizzle/                     # 数据库 schema 和迁移
├── .openai/hosting.json         # OpenAI Sites 配置
├── start-server.mjs             # VPS 启动脚本
└── package.json
```

## 快速开始

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 部署指南

详见 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 文章格式

文章数据结构：

```typescript
type Post = {
  slug: string;           // URL 路径
  kind: "essay" | "diary"; // 类型
  category: string;       // 分类
  title: string;          // 标题
  summary: string;        // 摘要
  date: string;           // 日期
  readTime: string;       // 阅读时长
  kicker: string;         // 副标题标签
  body: string[];         // 段落数组
  featured?: boolean;     // 是否为首页主文章
};
```

## 全屏功能使用说明

### 1. 文章全屏阅读
- 进入文章详情页，点击右上角 `⛶` 按钮
- 隐藏导航栏、侧边栏，沉浸式阅读
- 点击 `↙` 或按 ESC 键退出

### 2. 首页标题全屏
- 在首页标题上悬停显示 `⛶` 按钮
- 点击后标题放大到占满屏幕
- 点击任意处或 `×` 按钮退出

### 3. 整个网页全屏
- 点击导航栏右上角 `⛶` 按钮
- 网页铺满整个屏幕（隐藏浏览器工具栏）
- 点击 `⛶ 退出` 或按 ESC 键退出

---

北辰笔记 © 2026
