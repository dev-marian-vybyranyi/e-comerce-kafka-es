FROM node:20-alpine AS builder
WORKDIR /app
COPY shared/ ./shared/
COPY package.json tsconfig.json ./
COPY services/order-service/package.json ./services/order-service/
COPY services/order-service/tsconfig.json ./services/order-service/
RUN npm install --workspace=shared --workspace=services/order-service
COPY services/order-service/src ./services/order-service/src
RUN cd shared && npx prisma generate && cd ..
RUN npm run build --workspace=shared && npm run build --workspace=services/order-service

FROM node:20-alpine
RUN apk add --no-cache openssl curl
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/dist ./node_modules/@ecommerce/shared/dist
COPY --from=builder /app/shared/generated ./node_modules/@ecommerce/shared/generated
COPY --from=builder /app/shared/package.json ./node_modules/@ecommerce/shared/package.json
COPY --from=builder /app/services/order-service/dist ./dist
COPY --from=builder /app/services/order-service/package.json ./
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/index.js"]
