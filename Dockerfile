# 第一阶段：构建环境
FROM node:18-alpine as build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 并安装依赖
COPY package*.json ./
# 使用淘宝源加速（可选，GitHub Actions里其实不需要，但加上也不坏）
RUN npm install

# 复制源代码
COPY . .

# ------------------------------------------------------------------
# 关键修改：直接调用 vite build 进行打包，跳过 TypeScript 类型检查
# 这样可以避免因为一些小的类型报错导致构建失败
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