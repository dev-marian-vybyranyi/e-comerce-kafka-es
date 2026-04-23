import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import {
  type CartItem as CartItemType,
  useCartStore,
} from "../../store/cartStore";

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQty, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <span className="text-2xl shrink-0">{item.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {item.name}
        </p>
        <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => updateQty(item.productId, -1)}
          className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="w-6 text-center text-sm font-semibold">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQty(item.productId, 1)}
          className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Plus size={12} />
        </button>
        <button
          onClick={() => removeItem(item.productId)}
          className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors ml-1"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
