import type { Product } from "../../api/products";
import { ProductCard } from "../shop/ProductCard";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  total: number;
}

export function ProductGrid({ products, loading, total }: ProductGridProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Found: <strong className="text-gray-900">{total}</strong> products
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <div className="text-center">
            <div className="text-3xl mb-2">⏳</div>
            <p>Searching...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">😕</p>
          <p className="font-medium">No results found</p>
          <p className="text-sm mt-1">
            Try changing your search query or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
