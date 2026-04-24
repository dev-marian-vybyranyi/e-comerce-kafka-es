import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { authApi } from "../../api/auth";
import { Layout } from "../layout/Layout";
import { AdminProductsPage } from "../../pages/AdminProductsPage";
import { AnalyticsPage } from "../../pages/AnalyticsPage";
import { OrdersPage } from "../../pages/OrdersPage";
import { SearchPage } from "../../pages/SearchPage";
import { ProductSearchPage } from "../../pages/ProductSearchPage";
import { ShopPage } from "../../pages/ShopPage";
import { useAuthStore } from "../../store/authStore";

export function ProtectedRoutes() {
  const { user, accessToken, setAuth, logout, isAdmin } = useAuthStore();
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const admin = isAdmin();

  useEffect(() => {
    if (!accessToken) {
      setInitializing(false);
      return;
    }
    authApi
      .me()
      .then((res) =>
        setAuth(
          res.data.user,
          accessToken,
          useAuthStore.getState().refreshToken!,
        ),
      )
      .catch(() => {
        logout();
        navigate("/login");
      })
      .finally(() => setInitializing(false));
  }, []);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🛍️</div>
          <div className="text-gray-400 text-sm">Завантаження...</div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  const TAB_MAP: Record<string, string> = {
    "/": admin ? "orders" : "shop",
    "/shop": "shop",
    "/orders": "orders",
    "/analytics": "analytics",
    "/search": "search",
    "/product-search": "product-search",
    "/products": "products",
  };

  const activeTab = TAB_MAP[location.pathname] ?? (admin ? "orders" : "shop");

  const handleTabChange = (tab: string) => {
    const routes: Record<string, string> = {
      shop: "/",
      orders: "/orders",
      analytics: "/analytics",
      search: "/search",
      "product-search": "/product-search",
      products: "/products",
    };
    navigate(routes[tab] ?? "/");
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      <Routes>
        <Route
          path="/"
          element={admin ? <Navigate to="/orders" replace /> : <ShopPage />}
        />
        <Route
          path="/shop"
          element={admin ? <Navigate to="/orders" replace /> : <ShopPage />}
        />
        <Route path="/orders" element={<OrdersPage />} />
        <Route
          path="/analytics"
          element={admin ? <AnalyticsPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/search"
          element={
            admin ? <SearchPage /> : <Navigate to="/product-search" replace />
          }
        />
        <Route
          path="/product-search"
          element={
            !admin ? <ProductSearchPage /> : <Navigate to="/search" replace />
          }
        />
        <Route
          path="/products"
          element={admin ? <AdminProductsPage /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
