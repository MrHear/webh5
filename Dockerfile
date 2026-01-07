# 1. 升级基础镜像：Vite 7+ 和新版 TS 建议使用 Node 20 或 22 (LTS)
# 使用 alpine 版本体积更小
FROM node:22-alpine as build-stage

WORKDIR /app

# 2. 复制依赖定义
COPY package*.json ./

# 3. 安装依赖
# npm install 会默认安装 devDependencies (包含 vite, typescript)，这是构建所必需的
# 不需要额外单独 install vite
RUN npm install

# 4. 复制源码
COPY . .

# 5. 设置环境变量和内存限制
# 使用 NODE_OPTIONS 全局控制内存，比在命令里写更通用
ENV NODE_OPTIONS="--max-old-space-size=4096"

# 6. 执行构建
# 推荐直接使用 package.json 中的 build 脚本，它包含了 vue-tsc 类型检查
# 如果 "vue-tsc" 报错导致构建失败，且你想忽略类型错误，可以改为: RUN npx vite build
RUN npm run build

# --- 生产环境阶段 ---
FROM nginx:alpine as production-stage

# 复制构建产物
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]