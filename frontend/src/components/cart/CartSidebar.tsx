import { ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { ordersApi } from "../../api/orders";
import { formatCurrency } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { Button } from "../ui/Button";
import { CartItem } from "./CartItem";

export function CartSidebar() {
  const { items, isOpen, closeCart, clearCart, total, count } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    orderId: string;
    amount: number;
  } | null>(null);

  if (!isOpen) return null;

  const placeOrder = async () => {
    if (!user || items.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const orderItems = items.map(({ productId, quantity, price }) => ({
        productId,
        quantity,
        price,
      }));
      const res = await ordersApi.create({
        userId: user.id,
        items: orderItems,
      });
      setSuccess({ orderId: res.data.orderId, amount: res.data.totalAmount });
      clearCart();
    } catch {
      setError("Order creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeCart}
      />

      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-gray-700" />
            <h2 className="text-lg font-semibold">Cart</h2>
            {count() > 0 && (
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {count()}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Order placed successfully!
              </h3>
              <p className="text-sm text-gray-500 font-mono mb-1">
                {success.orderId.slice(0, 16)}...
              </p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(success.amount)}
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Follow the status in the "Orders" section
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSuccess(null);
                  closeCart();
                }}
                className="mt-4"
              >
                Close
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-gray-500">Cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">
                Add items from the catalog
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && !success && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">Total:</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(total())}
              </span>
            </div>
            {error && (
              <p className="text-sm text-red-500 mb-3 bg-red-50 p-2 rounded-lg">
                {error}
              </p>
            )}
            <Button
              onClick={placeOrder}
              loading={loading}
              className="w-full"
              size="lg"
            >
              Place order
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
