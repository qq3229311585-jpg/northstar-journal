# 北辰笔记 - 部署指南

本文档说明如何部署博客到 VPS 和 Cloudflare Workers。

## 目录
1. [VPS 部署（推荐）](#vps-部署)
2. [Cloudflare Workers 部署](#cloudflare-workers-部署)
3. [常见问题](#常见问题)

---

## VPS 部署

### 前置条件
- VPS（本例为 Debian 11）
- Node.js 18+
- nginx 或其他反向代理
- Cloudflare（用于 HTTPS）

### 步骤 1: 初始化 VPS

```bash
# SSH 连接到 VPS
ssh -p <port> root@<ip>

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# 创建博客目录
mkdir -p /opt/northstar-journal-zh
cd /opt/northstar-journal-zh
```

### 步骤 2: 上传并构建项目

在本地机器上：

```bash
# 构建项目
npm run build

# 打包 dist 目录
tar czf dist.tar.gz dist/

# 上传到 VPS（使用你的 VPS 凭证）
scp -P 53471 dist.tar.gz root@38.150.33.206:/opt/northstar-journal-zh/
scp -P 53471 start-server.mjs root@38.150.33.206:/opt/northstar-journal-zh/
scp -P 53471 package.json root@38.150.33.206:/opt/northstar-journal-zh/
scp -P 53471 package-lock.json root@38.150.33.206:/opt/northstar-journal-zh/
```

### 步骤 3: VPS 上部署

```bash
# 连接到 VPS
ssh -p 53471 root@38.150.33.206

# 进入目录
cd /opt/northstar-journal-zh

# 解包 dist
tar xzf dist.tar.gz
rm dist.tar.gz

# 安装依赖（仅生产依赖）
npm install --omit=dev

# 确保 start-server.mjs 有执行权限
chmod +x start-server.mjs
```

### 步骤 4: 配置 Systemd 服务

创建 `/etc/systemd/system/northstar-journal-zh.service`：

```ini
[Unit]
Description=Northstar Journal Chinese Edition
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/northstar-journal-zh
ExecStart=node /opt/northstar-journal-zh/start-server.mjs
Restart=always
RestartSec=10
Environment=PORT=8091
StandardOutput=journal
StandardError=journal
SyslogIdentifier=northstar-journal-zh

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
systemctl daemon-reload
systemctl enable northstar-journal-zh
systemctl start northstar-journal-zh
systemctl status northstar-journal-zh
```

### 步骤 5: 配置 nginx 反向代理

创建 `/etc/nginx/sites-available/blog.conf`：

```nginx
server {
    listen 80;
    server_name blog.jiecaisongai.shop;

    location / {
        proxy_pass http://localhost:8091;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用：

```bash
ln -s /etc/nginx/sites-available/blog.conf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 步骤 6: 配置 HTTPS（Cloudflare）

在 Cloudflare 仪表板上：

1. **DNS 记录**
   - Type: `A`
   - Name: `blog`
   - Content: `38.150.33.206`（VPS IP）
   - Proxy: `已启用`（橙色云）

2. **SSL/TLS 设置**
   - 模式：`灵活`（Flexible）
   - 原因：VPS 端口 443 被 xray VPN 占用，由 Cloudflare 处理 HTTPS 终止

3. **规则**（可选）
   - 重定向 HTTP 到 HTTPS

### 步骤 7: 验证部署

```bash
# 检查服务状态
systemctl status northstar-journal-zh

# 查看日志
journalctl -u northstar-journal-zh -f

# 测试本地连接
curl http://localhost:8091

# 测试通过 nginx
curl http://localhost

# 测试 HTTPS（外部）
curl https://blog.jiecaisongai.shop
```

---

## 自动化部署脚本

创建 `deploy-to-vps.sh` 简化部署流程：

```bash
#!/bin/bash

set -e

# 配置
VPS_USER="root"
VPS_IP="38.150.33.206"
VPS_PORT="53471"
VPS_PATH="/opt/northstar-journal-zh"
TEMP_DIR="/tmp/blog-deploy"

echo "📦 构建项目..."
npm run build

echo "📦 打包文件..."
mkdir -p $TEMP_DIR
tar czf $TEMP_DIR/dist.tar.gz dist/
cp start-server.mjs $TEMP_DIR/

echo "📤 上传到 VPS..."
scp -P $VPS_PORT -r $TEMP_DIR/* $VPS_USER@$VPS_IP:$VPS_PATH/

echo "🚀 VPS 上部署..."
ssh -p $VPS_PORT $VPS_USER@$VPS_IP << 'DEPLOY'
cd /opt/northstar-journal-zh
tar xzf dist.tar.gz
rm dist.tar.gz
systemctl restart northstar-journal-zh
sleep 2
systemctl status northstar-journal-zh --no-pager | tail -5
DEPLOY

echo "✅ 部署完成！"
echo "访问：https://blog.jiecaisongai.shop"

# 清理
rm -rf $TEMP_DIR
```

使用方法：

```bash
chmod +x deploy-to-vps.sh
./deploy-to-vps.sh
```

---

## Cloudflare Workers 部署

### 前置条件
- Cloudflare 账户
- OpenAI Sites 项目（内置 vinext 支持）
- D1 数据库

### 配置文件：`.openai/hosting.json`

```json
{
  "d1": "DB",
  "kv": {
    "namespace_id": "your_kv_id"
  }
}
```

### 部署命令

```bash
npm run deploy
```

---

## 常见问题

### Q: VPS 启动脚本 `start-server.mjs` 是什么？

A: 这个脚本绕过 vinext CLI，直接加载生产服务器模块。原因：
- vinext CLI 会加载 Vite，Vite 加载内部 LightningCSS 库
- 旧版 LightningCSS 的二进制文件在某些 CPU 架构上崩溃
- 直接调用 `startProdServer` 避免这个问题

### Q: 如何更新博客文章？

#### 方式 1: 编辑 `app/content.ts`（静态数据，VPS 适用）

```typescript
export const staticPosts: Post[] = [
  {
    slug: "my-post",
    kind: "diary",
    category: "日记",
    title: "我的新文章",
    summary: "这是摘要",
    date: "2026-06-12",
    readTime: "5 分钟",
    kicker: "标签",
    body: ["第一段", "第二段"]
  },
  // ... 更多文章
];
```

然后重新构建和部署：

```bash
npm run build
./deploy-to-vps.sh  # 或手动上传 dist
```

#### 方式 2: 使用管理后台（Cloudflare Workers）

在 OpenAI Sites 部署上，访问 `/admin` 编辑文章。

### Q: 怎样替换所有文章？

见根目录的 `app/content.ts`。提供的脚本可以从微信日记存档自动提取 60 篇文章：

```bash
python3 extract-diary-to-articles.py
```

### Q: VPS 上能不能用 D1 数据库？

不能。D1 是 Cloudflare 专有服务，仅在 Workers 环境可用。VPS 上使用 `app/content.ts` 中的静态数据。

如需动态数据库，考虑：
- 自建 PostgreSQL/MySQL
- 修改 `db-posts.ts` 以适配新数据库

### Q: 怎样监控 VPS 上的服务？

```bash
# 查看实时日志
journalctl -u northstar-journal-zh -f

# 查看最后 50 行
journalctl -u northstar-journal-zh -n 50

# 重启服务
systemctl restart northstar-journal-zh

# 检查内存占用
ps aux | grep node
```

### Q: 部署后 HTTPS 出错（Error 1034）？

检查：
1. Cloudflare DNS 记录是否指向正确的 VPS IP
2. Cloudflare SSL 模式是否为"灵活"（Flexible）
3. nginx 是否在运行

```bash
# 检查 nginx
systemctl status nginx
curl http://localhost  # 应该能连接到本地 8091

# 检查 DNS 解析
nslookup blog.jiecaisongai.shop
```

### Q: 怎样备份文章？

```bash
# 备份 content.ts（VPS 上的文章数据）
scp -P 53471 root@38.150.33.206:/opt/northstar-journal-zh/app/content.ts backup-content.ts

# 备份整个项目
tar czf blog-backup-$(date +%Y%m%d).tar.gz /opt/northstar-journal-zh
```

---

## 回滚部署

如果新版本有问题，快速回滚：

```bash
# 保存旧 dist 的备份
cp -r /opt/northstar-journal-zh/dist /opt/northstar-journal-zh/dist.backup

# 恢复
cp -r /opt/northstar-journal-zh/dist.backup /opt/northstar-journal-zh/dist
systemctl restart northstar-journal-zh
```

---

**最后更新**: 2026-06-12  
**部署状态**: ✅ 在线 https://blog.jiecaisongai.shop
