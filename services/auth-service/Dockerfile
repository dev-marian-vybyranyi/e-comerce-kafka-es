FROM node:20-alpine AS builder
WORKDIR /app
COPY shared/ ./shared/
COPY package.json tsconfig.json ./
COPY services/auth-service/package.json ./services/auth-service/
COPY services/auth-service/tsconfig.json ./services/auth-service/
RUN npm install --workspace=shared --workspace=services/auth-service
COPY services/auth-service/src ./services/auth-service/src
RUN npm run build --workspace=shared && npm run build --workspace=services/auth-service

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared/generated ./shared/generated
COPY --from=builder /app/services/auth-service/dist ./dist
COPY --from=builder /app/services/auth-service/package.json ./
ENV NODE_ENV=production
EXPOSE 3006
CMD ["node", "dist/index.js"]
