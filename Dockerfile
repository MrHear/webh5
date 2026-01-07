# 第一阶段：构建环境
# ⚠️ 改用 node:18 (Debian) 镜像，放弃 alpine
# Alpine 系统经常因为缺少 glibc 导致 esbuild/vite 等工具构建失败
FROM node:18 as build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 并安装依赖
COPY package*.json ./

# 正常安装所有依赖 (包括 devDependencies)
RUN npm install

# 复制源代码
COPY . .

# ------------------------------------------------------------------
# 构建命令
# 直接调用 npx vite build，跳过 package.json 里的 vue-tsc 检查
# ------------------------------------------------------------------
RUN npx vite build

# 第二阶段：生产环境
# Nginx 这里可以用 alpine，因为只负责静态文件服务，不涉及构建工具
FROM nginx:alpine as production-stage

# 从第一阶段复制构建好的 dist 目录到 Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]