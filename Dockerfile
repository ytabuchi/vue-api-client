# 参照：https://jp.vuejs.org/v2/cookbook/dockerize-vuejs-app.html#%E7%8F%BE%E5%AE%9F%E3%81%AE%E4%BE%8B
# ビルド環境
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 本番環境
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]