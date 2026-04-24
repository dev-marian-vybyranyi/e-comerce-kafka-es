FROM node:20-alpine AS builder
WORKDIR /app
COPY shared/ ./shared/
COPY package.json tsconfig.json ./
COPY services/payment-service/package.json ./services/payment-service/
COPY services/payment-service/tsconfig.json ./services/payment-service/
RUN npm install --workspace=shared --workspace=services/payment-service
COPY services/payment-service/src ./services/payment-service/src
RUN npm run build --workspace=shared && npm run build --workspace=services/payment-service

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/services/payment-service/dist ./dist
COPY --from=builder /app/services/payment-service/package.json ./
ENV NODE_ENV=production
EXPOSE 3002
CMD ["node", "dist/index.js"]
