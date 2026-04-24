#!/bin/bash
set -e

echo "Waiting for services to be ready..."
sleep 10

echo "Running database migrations..."
cd /app && npx prisma db push --schema=shared/prisma/schema.prisma

echo "Seeding admin user..."
cd /app && npx ts-node services/auth-service/prisma/seed.ts

echo "Seeding products..."
cd /app && npx ts-node services/product-service/src/seed.ts

echo "Init complete!"
