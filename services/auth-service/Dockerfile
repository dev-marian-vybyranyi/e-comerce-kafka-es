FROM node:20-alpine AS builder
WORKDIR /app
COPY shared/ ./shared/
COPY package.json tsconfig.json ./
COPY services/auth-service/package.json ./services/auth-service/
COPY services/auth-service/tsconfig.json ./services/auth-service/
RUN npm install --workspace=shared --workspace=services/auth-service
COPY services/auth-service/src ./services/auth-service/src
RUN cd shared && npx prisma generate && cd ..
RUN npm run build --workspace=shared && npm run build --workspace=services/auth-service

FROM node:20-alpine
RUN apk add --no-cache openssl curl
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/dist ./node_modules/@ecommerce/shared/dist
COPY --from=builder /app/shared/generated ./node_modules/@ecommerce/shared/generated
COPY --from=builder /app/shared/package.json ./node_modules/@ecommerce/shared/package.json
COPY --from=builder /app/services/auth-service/dist ./dist
COPY --from=builder /app/services/auth-service/package.json ./
ENV NODE_ENV=production
EXPOSE 3006
CMD ["node", "dist/index.js"]
