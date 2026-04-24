FROM node:20-alpine AS builder
WORKDIR /app
COPY shared/ ./shared/
COPY package.json tsconfig.json ./
COPY services/product-service/package.json ./services/product-service/
COPY services/product-service/tsconfig.json ./services/product-service/
RUN npm install --workspace=shared --workspace=services/product-service
COPY services/product-service/src ./services/product-service/src
RUN npm run build --workspace=shared && npm run build --workspace=services/product-service

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared/generated ./shared/generated
COPY --from=builder /app/services/product-service/dist ./dist
COPY --from=builder /app/services/product-service/package.json ./
ENV NODE_ENV=production
EXPOSE 3007
CMD ["node", "dist/index.js"]
