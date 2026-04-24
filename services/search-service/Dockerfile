FROM node:20-alpine AS builder
WORKDIR /app
COPY shared/ ./shared/
COPY package.json tsconfig.json ./
COPY services/search-service/package.json ./services/search-service/
COPY services/search-service/tsconfig.json ./services/search-service/
RUN npm install --workspace=shared --workspace=services/search-service
COPY services/search-service/src ./services/search-service/src
RUN npm run build --workspace=shared && npm run build --workspace=services/search-service

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/dist ./node_modules/@ecommerce/shared/dist
COPY --from=builder /app/shared/generated ./node_modules/@ecommerce/shared/generated
COPY --from=builder /app/shared/package.json ./node_modules/@ecommerce/shared/package.json
COPY --from=builder /app/services/search-service/dist ./dist
COPY --from=builder /app/services/search-service/package.json ./
ENV NODE_ENV=production
EXPOSE 3005
CMD ["node", "dist/index.js"]
