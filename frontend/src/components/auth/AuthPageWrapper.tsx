import { useEffect } from "react";
import { type Location, useLocation, useNavigate } from "react-router-dom";
import { AuthPage } from "../../pages/AuthPage";
import { useAuthStore } from "../../store/authStore";

export function AuthPageWrapper() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const from =
        (location.state as { from?: Location })?.from?.pathname ?? "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  return <AuthPage />;
}
