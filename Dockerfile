# 第一阶段：构建环境
# ⚠️ 换用 node:18 (Debian)，放弃 Alpine，解决潜在的二进制依赖问题
FROM node:18 as build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
# ⚠️ 使用 npm install 而不是 ci，并且不忽略脚本
# ⚠️ 显式安装 typescript 和 vite，防止因为路径问题找不到
RUN npm install
RUN npm install -D typescript vite

# 复制源代码
COPY . .

# ------------------------------------------------------------------
# 构建命令
# 1. 增加内存限制 (--max-old-space-size=4096)
# 2. 显式调用 node_modules 里的 vite
# 3. 加上 --debug 参数，万一失败了方便看日志 (虽然这里看不到)
# ------------------------------------------------------------------
ENV NODE_ENV=production
RUN node --max-old-space-size=4096 ./node_modules/.bin/vite build

# 第二阶段：生产环境
# Nginx 这里可以用 alpine，因为它只负责静态文件，不涉及构建
FROM nginx:alpine as production-stage

# 从第一阶段复制构建好的 dist 目录到 Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]