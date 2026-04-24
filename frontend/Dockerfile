FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY frontend/package.json ./frontend/
RUN npm install --workspace=frontend
COPY frontend/ ./frontend/

ENV VITE_API_URL=http://api-gateway:8000

RUN npm run build --workspace=frontend

FROM nginx:alpine
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
