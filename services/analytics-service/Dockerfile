FROM node:20-alpine AS builder
WORKDIR /app
COPY shared/ ./shared/
COPY package.json tsconfig.json ./
COPY services/analytics-service/package.json ./services/analytics-service/
COPY services/analytics-service/tsconfig.json ./services/analytics-service/
RUN npm install --workspace=shared --workspace=services/analytics-service
RUN npx prisma generate --schema=shared/prisma/schema.prisma
COPY services/analytics-service/src ./services/analytics-service/src
RUN npm run build --workspace=shared && npm run build --workspace=services/analytics-service

FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/dist ./node_modules/@ecommerce/shared/dist
COPY --from=builder /app/shared/generated ./node_modules/@ecommerce/shared/generated
COPY --from=builder /app/shared/package.json ./node_modules/@ecommerce/shared/package.json
COPY --from=builder /app/services/analytics-service/dist ./dist
COPY --from=builder /app/services/analytics-service/package.json ./
ENV NODE_ENV=production
EXPOSE 3004
CMD ["node", "dist/index.js"]
