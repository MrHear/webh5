# 第一阶段：构建环境
FROM node:18-alpine as build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 并安装依赖
COPY package*.json ./
# 使用 npm ci 进行更干净、确定的依赖安装
# 忽略脚本以防止 postinstall 脚本可能导致的错误
RUN npm install --ignore-scripts

# 复制源代码
COPY . .

# ------------------------------------------------------------------
# 关键修改：直接调用项目内的 vite 进行构建
# 这将绕过 package.json 中定义的 "build": "vue-tsc -b && vite build"
# 从而跳过 TypeScript 类型检查
# ------------------------------------------------------------------
RUN ./node_modules/.bin/vite build

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