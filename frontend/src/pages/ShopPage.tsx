import { useState } from "react";
import { CartSidebar } from "../components/cart/CartSidebar";
import { CategoryFilter } from "../components/shop/CategoryFilter";
import { type Product, ProductCard } from "../components/shop/ProductCard";

export const PRODUCTS: Product[] = [
  {
    id: "iphone-15",
    name: "iPhone 15",
    price: 999.99,
    category: "Smartphones",
    emoji: "📱",
  },
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    price: 1199.99,
    category: "Smartphones",
    emoji: "📱",
  },
  {
    id: "macbook-air",
    name: "MacBook Air M2",
    price: 1299.99,
    category: "Notebooks",
    emoji: "💻",
  },
  {
    id: "macbook-pro",
    name: "MacBook Pro M3",
    price: 1999.99,
    category: "Notebooks",
    emoji: "💻",
  },
  {
    id: "airpods-pro",
    name: "AirPods Pro",
    price: 249.99,
    category: "Audio",
    emoji: "🎧",
  },
  {
    id: "airpods-max",
    name: "AirPods Max",
    price: 549.99,
    category: "Audio",
    emoji: "🎧",
  },
  {
    id: "ipad-mini",
    name: "iPad Mini",
    price: 499.99,
    category: "Tablets",
    emoji: "📱",
  },
  {
    id: "ipad-pro",
    name: "iPad Pro M4",
    price: 1099.99,
    category: "Tablets",
    emoji: "📟",
  },
  {
    id: "apple-watch",
    name: "Apple Watch S9",
    price: 399.99,
    category: "Watches",
    emoji: "⌚",
  },
  {
    id: "apple-watch-u",
    name: "Apple Watch Ultra",
    price: 799.99,
    category: "Watches",
    emoji: "⌚",
  },
];

const CATEGORIES = [
  "All",
  ...Array.from(new Set(PRODUCTS.map((p) => p.category))),
];

export function ShopPage() {
  const [category, setCategory] = useState("All");

  const filtered =
    category === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === category);

  return (
    <>
      <CategoryFilter
        categories={CATEGORIES}
        activeCategory={category}
        onSelectCategory={setCategory}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <CartSidebar />
    </>
  );
}
