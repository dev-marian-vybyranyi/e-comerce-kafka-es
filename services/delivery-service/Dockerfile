FROM node:20-alpine AS builder
WORKDIR /app
COPY shared/ ./shared/
COPY package.json tsconfig.json ./
COPY services/delivery-service/package.json ./services/delivery-service/
COPY services/delivery-service/tsconfig.json ./services/delivery-service/
RUN npm install --workspace=shared --workspace=services/delivery-service
RUN npx prisma generate --schema=shared/prisma/schema.prisma
COPY services/delivery-service/src ./services/delivery-service/src
RUN npm run build --workspace=shared && npm run build --workspace=services/delivery-service

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/dist ./node_modules/@ecommerce/shared/dist
COPY --from=builder /app/shared/generated ./node_modules/@ecommerce/shared/generated
COPY --from=builder /app/shared/package.json ./node_modules/@ecommerce/shared/package.json
COPY --from=builder /app/services/delivery-service/dist ./dist
COPY --from=builder /app/services/delivery-service/package.json ./
ENV NODE_ENV=production
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/shared/generated/prisma/libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node
EXPOSE 3003
CMD ["node", "dist/index.js"]
