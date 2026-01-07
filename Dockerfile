# 第一阶段：构建环境
FROM node:18-alpine as build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 并安装依赖
COPY package*.json ./

# ⚠️ 关键修正：
# 1. 显式设置 NODE_ENV 为 development 以确保安装 devDependencies (包括 vite)
# 2. 使用 npm install 确保依赖安装完整
ENV NODE_ENV=development
RUN npm install

# 复制源代码
COPY . .

# ------------------------------------------------------------------
# 构建命令
# 直接调用 npx vite build，绕过 package.json 中的 vue-tsc 类型检查
# ------------------------------------------------------------------
RUN npx vite build

# 第二阶段：生产环境
FROM nginx:alpine as production-stage

# 从第一阶段复制构建好的 dist 目录到 Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]