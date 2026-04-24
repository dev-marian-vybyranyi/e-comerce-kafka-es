FROM node:20-alpine AS builder
WORKDIR /app
COPY shared/ ./shared/
COPY package.json tsconfig.json ./
COPY services/product-service/package.json ./services/product-service/
COPY services/product-service/tsconfig.json ./services/product-service/
RUN npm install --workspace=shared --workspace=services/product-service
COPY services/product-service/src ./services/product-service/src
RUN cd shared && npx prisma generate && cd ..
RUN npm run build --workspace=shared && npm run build --workspace=services/product-service

FROM node:20-alpine
RUN apk add --no-cache openssl curl
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/dist ./node_modules/@ecommerce/shared/dist
COPY --from=builder /app/shared/generated ./node_modules/@ecommerce/shared/generated
COPY --from=builder /app/shared/package.json ./node_modules/@ecommerce/shared/package.json
COPY --from=builder /app/services/product-service/dist ./dist
COPY --from=builder /app/services/product-service/package.json ./
ENV NODE_ENV=production
EXPOSE 3007
CMD ["node", "dist/index.js"]
