import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store";
import AppRoutes from "./routing/AppRoutes";
import Toast from "./components/toast";
function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <AppRoutes />
      <Toast />
    </>
  );
}

export default App;
