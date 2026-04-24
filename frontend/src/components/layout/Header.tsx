import { ShoppingCart } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { authApi } from "../../api/auth";
import { Button } from "../ui/Button";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const USER_TABS = [
  { id: "shop", label: "Shop" },
  { id: "orders", label: "Orders" },
  { id: "search", label: "Search" },
];

const ADMIN_TABS = [
  { id: "orders", label: "All orders" },
  { id: "analytics", label: "Analytics" },
  { id: "search", label: "Search orders" },
  { id: "products", label: "Products" },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { user, refreshToken, logout, isAdmin } = useAuthStore();
  const { count, openCart } = useCartStore();
  const cartCount = count();
  const admin = isAdmin();
  const tabs = admin ? ADMIN_TABS : USER_TABS;

  const handleLogout = async () => {
    if (refreshToken) await authApi.logout(refreshToken).catch(() => {});
    logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">Micro Shop</span>
            {admin && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                Admin
              </span>
            )}
          </div>

          <nav className="hidden md:flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    activeTab === tab.id
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {!admin &&
            (activeTab === "shop" || activeTab === "product-search") && (
              <button
                onClick={openCart}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-900 leading-tight">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400">@{user?.username}</p>
          </div>

          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex gap-1 px-4 pb-3 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors
              ${activeTab === tab.id ? "bg-gray-900 text-white" : "text-gray-500 bg-gray-100"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
}
