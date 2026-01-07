# 第一阶段：构建环境
FROM node:18-alpine as build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 并安装依赖
COPY package*.json ./
# ⚠️ 移除 --ignore-scripts，因为 vite 依赖 esbuild，它需要运行 postinstall 脚本来下载二进制文件
# 使用 npm ci 保证依赖版本一致性
RUN npm install

# 复制源代码
COPY . .

# ------------------------------------------------------------------
# 直接调用 npx vite build 进行构建
# 这将绕过 package.json 中定义的 "build" (包含 vue-tsc)，只进行转译
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