import "dotenv/config";
import { prisma } from "@ecommerce/shared";

const PRODUCTS = [
  {
    name: "iPhone 15",
    description: "Apple iPhone 15 128GB",
    price: 999.99,
    category: "Смартфони",
    emoji: "📱",
  },
  {
    name: "iPhone 15 Pro",
    description: "Apple iPhone 15 Pro 256GB",
    price: 1199.99,
    category: "Смартфони",
    emoji: "📱",
  },
  {
    name: "MacBook Air M2",
    description: 'Apple MacBook Air 13" M2 8GB',
    price: 1299.99,
    category: "Ноутбуки",
    emoji: "💻",
  },
  {
    name: "MacBook Pro M3",
    description: 'Apple MacBook Pro 14" M3 16GB',
    price: 1999.99,
    category: "Ноутбуки",
    emoji: "💻",
  },
  {
    name: "AirPods Pro",
    description: "Apple AirPods Pro 2nd Gen",
    price: 249.99,
    category: "Аудіо",
    emoji: "🎧",
  },
  {
    name: "AirPods Max",
    description: "Apple AirPods Max Space Gray",
    price: 549.99,
    category: "Аудіо",
    emoji: "🎧",
  },
  {
    name: "iPad Mini",
    description: "Apple iPad Mini 6th Gen 64GB",
    price: 499.99,
    category: "Планшети",
    emoji: "📟",
  },
  {
    name: "iPad Pro M4",
    description: 'Apple iPad Pro 11" M4 128GB',
    price: 1099.99,
    category: "Планшети",
    emoji: "📟",
  },
  {
    name: "Apple Watch S9",
    description: "Apple Watch Series 9 41mm",
    price: 399.99,
    category: "Годинники",
    emoji: "⌚",
  },
  {
    name: "Apple Watch Ultra",
    description: "Apple Watch Ultra 2 49mm",
    price: 799.99,
    category: "Годинники",
    emoji: "⌚",
  },
];

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log(`Products already exist (${count}), skipping seed`);
    return;
  }

  for (const p of PRODUCTS) {
    await prisma.product.create({ data: p });
    console.log(`Created: ${p.name}`);
  }

  console.log("Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
