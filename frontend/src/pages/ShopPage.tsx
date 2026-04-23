import { useEffect, useState } from "react";
import type { Product } from "../api/products";
import { productsApi } from "../api/products";
import { CartSidebar } from "../components/cart/CartSidebar";
import { CategoryFilter } from "../components/shop/CategoryFilter";
import { ProductCard } from "../components/shop/ProductCard";

const CATEGORIES_ALL = "All";

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(CATEGORIES_ALL);

  useEffect(() => {
    productsApi
      .list()
      .then((res) => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    CATEGORIES_ALL,
    ...Array.from(new Set(products.map((p) => p.category))),
  ];
  const filtered =
    category === CATEGORIES_ALL
      ? products
      : products.filter((p) => p.category === category);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-3">🛍️</div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <CategoryFilter
        categories={categories}
        activeCategory={category}
        onSelectCategory={setCategory}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p>No products</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <CartSidebar />
    </>
  );
}
