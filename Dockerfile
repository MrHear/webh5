# 第一阶段：构建
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
# 如果构建很慢，可以把下面这行换成 npm install --registry=https://registry.npmmirror.com
RUN npm install
COPY . .
RUN npm run build

# 第二阶段：运行
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]