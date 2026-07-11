import { useEffect } from "react";
import { meApi } from "../../api/auth/authApi";
import { useAuthStore } from "../../store/auth/authStore";

const AuthInitializer = ({ children }) => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await meApi();

        setAuth({
          user: res.data.user,
          accessToken: res.data.accessToken,
        });
      } catch {
        clearAuth();
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [setAuth, clearAuth, setAuthLoading]);

  return children;
};

export default AuthInitializer;
