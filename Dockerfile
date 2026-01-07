# 第一阶段：构建环境
FROM node:18-alpine as build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
# 注意：这里我们复制 lock 文件以确保版本一致性
COPY package*.json ./

# 安装依赖
# 使用 npm ci (clean install) 确保完全一致的依赖树
# --legacy-peer-deps 有时候能救命，防止 peer dependency 冲突
RUN npm ci --legacy-peer-deps

# 复制源代码
COPY . .

# ------------------------------------------------------------------
# 构建命令
# 显式设置 NODE_ENV 为 production (虽然 vite build 默认就是 prod，但有些库依赖这个环境变量)
# 直接调用 npx vite build
# ------------------------------------------------------------------
ENV NODE_ENV=production
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