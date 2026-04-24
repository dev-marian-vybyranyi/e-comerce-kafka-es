FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json ./
COPY services/api-gateway/package.json ./services/api-gateway/
COPY services/api-gateway/tsconfig.json ./services/api-gateway/
RUN npm install --workspace=services/api-gateway
COPY services/api-gateway/src ./services/api-gateway/src
RUN npm run build --workspace=services/api-gateway

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/api-gateway/dist ./dist
COPY --from=builder /app/services/api-gateway/package.json ./
ENV NODE_ENV=production
EXPOSE 8000
CMD ["node", "dist/index.js"]
