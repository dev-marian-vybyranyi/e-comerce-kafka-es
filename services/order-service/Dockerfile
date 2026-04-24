FROM node:20-alpine AS builder
WORKDIR /app
COPY shared/ ./shared/
COPY package.json tsconfig.json ./
COPY services/order-service/package.json ./services/order-service/
COPY services/order-service/tsconfig.json ./services/order-service/
RUN npm install --workspace=shared --workspace=services/order-service
COPY services/order-service/src ./services/order-service/src
RUN npm run build --workspace=shared && npm run build --workspace=services/order-service

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared/generated ./shared/generated
COPY --from=builder /app/services/order-service/dist ./dist
COPY --from=builder /app/services/order-service/package.json ./
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/index.js"]
