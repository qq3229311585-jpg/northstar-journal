# 快速参考

## 项目概览

**北辰笔记** - 克制式中文个人博客  
**框架**: Next.js 16 + vinext + Cloudflare Workers  
**数据源**: 静态文件 (`app/content.ts`) 或 D1 数据库  
**部署**: VPS 自托管 或 Cloudflare Workers  

---

## 文件结构速查

| 文件 | 用途 |
|------|------|
| `app/page.tsx` | 首页 |
| `app/posts/[slug]/page.tsx` | 文章详情页 |
| `app/content.ts` | 所有文章数据（VPS 用） |
| `app/components/*.tsx` | 全屏、导航等组件 |
| `app/globals.css` | 全局样式 |
| `start-server.mjs` | VPS 启动脚本 |
| `DEPLOYMENT.md` | 部署指南 |
| `README.md` | 项目说明 |

---

## 常用命令

### 开发

```bash
npm run dev           # 启动开发服务器 (localhost:3000)
npm run build         # 构建生产版本
npm run start         # 本地运行生产版本 (localhost:3000)
npm run type-check    # TypeScript 类型检查
```

### VPS 部署

```bash
# 快速脚本（需要创建 deploy-to-vps.sh）
./deploy-to-vps.sh

# 或手动步骤
npm run build
tar czf dist.tar.gz dist/
scp -P 53471 dist.tar.gz root@38.150.33.206:/opt/northstar-journal-zh/
ssh -p 53471 root@38.150.33.206 "cd /opt/northstar-journal-zh && tar xzf dist.tar.gz && rm dist.tar.gz && systemctl restart northstar-journal-zh"
```

### Git 操作

```bash
git add .
git commit -m "feat: 描述改动"
git push origin main
```

### 监控 VPS

```bash
# 实时日志
journalctl -u northstar-journal-zh -f

# 服务状态
systemctl status northstar-journal-zh

# 重启服务
systemctl restart northstar-journal-zh
```

---

## 关键配置

### VPS IP & 凭证
- **IP**: 38.150.33.206
- **Port**: 53471
- **User**: root
- **Password**: BUye697mc1
- **App Path**: /opt/northstar-journal-zh
- **App Port**: 8091

### Cloudflare
- **Domain**: blog.jiecaisongai.shop
- **SSL Mode**: Flexible
- **DNS**: A 记录指向 38.150.33.206

### 本地开发环境
- **Node**: 18+
- **npm**: 9+
- **Port**: 3000 (默认)

---

## 全屏功能

| 功能 | 按钮 | 退出方式 |
|------|------|--------|
| 文章阅读全屏 | 文章右上 `⛶` | `↙` 或 ESC |
| 标题全屏 | 标题悬停 `⛶` | 任意处或 `×` |
| 整页全屏 | 导航栏右 `⛶` | `⛶ 退出` 或 ESC |

---

## 数据更新

### 更新文章（VPS）

编辑 `app/content.ts`，然后：

```bash
npm run build
./deploy-to-vps.sh
```

### 从日记生成文章

```bash
python3 extract-diary.py <日记文件>
# 更新 app/content.ts
```

---

## 故障排查

| 症状 | 原因 | 解决 |
|------|------|------|
| VPS 无法启动 | Node.js 错误 | 检查日志 `journalctl -u northstar-journal-zh` |
| 页面 404 | 路由不存在 | 检查 `app/posts/[slug]/page.tsx` |
| HTTPS 失败 | DNS/SSL 设置 | 检查 Cloudflare DNS 和 SSL 模式 |
| 样式不对 | CSS 未加载 | 清缓存、重新构建 |
| npm install 失败 | 版本冲突 | 删除 `node_modules` 和 `package-lock.json`，重新安装 |

---

## 性能优化

```javascript
// app/globals.css - 已应用
- 使用 100svh（小视口高度） 替代 100vh
- 延迟加载字体（@import in globals.css）
- 条件 CSS（@media 查询）
- 全屏模式隐藏不必要元素
```

---

## 安全检查清单

- [ ] 删除敏感文件（token、密码）
- [ ] .gitignore 包含 `.env` 和 `dist/`
- [ ] 不在代码中硬写 API 密钥
- [ ] 定期更新依赖：`npm audit`
- [ ] VPS 防火墙只开放必要端口

---

## 版本信息

| 组件 | 版本 |
|------|------|
| Next.js | 16 |
| Node | 18+ |
| npm | 9+ |
| vinext | 0.1.x |
| Drizzle | Latest |
| Tailwind CSS | Latest |

---

## 联系和支持

- GitHub: [你的仓库链接]
- 博客: https://blog.jiecaisongai.shop
- 问题: GitHub Issues
- 邮件: [你的邮箱]

---

**最后更新**: 2026-06-12  
**维护者**: @你的用户名  
**许可证**: MIT
