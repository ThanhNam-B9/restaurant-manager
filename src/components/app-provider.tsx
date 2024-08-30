"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "@/components/refresh-token";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getAccessTokenFromLocalStorage,
  removeAccessAndRefreshTokenInLocalStorage,
} from "@/lib/utils";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});
const AppContext = createContext({
  isAuth: false,
  setAuth: (value: boolean) => {},
});
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuth, setAuthState] = useState(false);
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      setAuthState(true);
    }
  }, []);
  const setAuth = useCallback((isCheckAuth: boolean) => {
    if (isCheckAuth) {
      setAuthState(true);
    } else {
      setAuthState(false);
      removeAccessAndRefreshTokenInLocalStorage();
    }
  }, []);

  return (
    // Provide the client to your App
    //Nếu dùng react 19 và  next 15 thì không còn .Provider
    <AppContext.Provider value={{ isAuth, setAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
