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
import { AnalyticsPage } from "../../pages/AnalyticsPage";
import { OrdersPage } from "../../pages/OrdersPage";
import { SearchPage } from "../../pages/SearchPage";
import { ShopPage } from "../../pages/ShopPage";
import { useAuthStore } from "../../store/authStore";

export function ProtectedRoutes() {
  const { user, accessToken, setAuth, logout } = useAuthStore();
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  const TAB_MAP: Record<string, string> = {
    "/": "shop",
    "/shop": "shop",
    "/orders": "orders",
    "/analytics": "analytics",
    "/search": "search",
  };

  const activeTab = TAB_MAP[location.pathname] ?? "shop";

  const handleTabChange = (tab: string) => {
    navigate(tab === "shop" ? "/" : `/${tab}`);
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/shop" element={<Navigate to="/" replace />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
