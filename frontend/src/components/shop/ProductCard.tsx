import type { Product } from "../../api/products";
import { formatCurrency } from "../../lib/utils";
import { useCartStore } from "../../store/cartStore";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem } = useCartStore();
  const inCart = items.find((i) => i.productId === product.id);

  return (
    <div
      className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all
        ${!product.inStock ? "opacity-60" : "border-gray-200"}`}
    >
      <div className="text-4xl text-center py-5 bg-gray-50 rounded-xl mb-3">
        {product.emoji}
      </div>
      <p className="text-xs text-gray-400 mb-0.5">{product.category}</p>
      <p className="font-semibold text-sm text-gray-900 leading-tight mb-1">
        {product.name}
      </p>
      {product.description && (
        <p className="text-xs text-gray-400 mb-1 line-clamp-2">
          {product.description}
        </p>
      )}
      <p className="font-bold text-gray-900 mb-3">
        {formatCurrency(product.price)}
      </p>

      {product.inStock ? (
        <button
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              emoji: product.emoji,
              price: product.price,
            })
          }
          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors
            ${
              inCart
                ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
        >
          {inCart ? `In Cart (${inCart.quantity})` : "+ Add"}
        </button>
      ) : (
        <div className="w-full py-2 rounded-lg text-sm font-medium text-center bg-gray-100 text-gray-400">
          Out of stock
        </div>
      )}
    </div>
  );
}
