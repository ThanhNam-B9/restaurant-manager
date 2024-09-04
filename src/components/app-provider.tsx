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
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeAccessAndRefreshTokenInLocalStorage,
} from "@/lib/utils";
import { RoleType } from "@/app/types/jwt.types";

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
  isRoles: undefined as RoleType | undefined,
  setRoles: (value?: RoleType | undefined) => {},
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
  const [isRoles, setRolesState] = useState<RoleType | undefined>();
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const { role } = decodeToken(accessToken);
      setRolesState(role);
    }
  }, []);
  const setRoles = useCallback((role?: RoleType | undefined) => {
    setRolesState(role);
    if (!role) {
      removeAccessAndRefreshTokenInLocalStorage();
    }
  }, []);

  return (
    // Provide the client to your App
    //Nếu dùng react 19 và  next 15 thì không còn .Provider
    <AppContext.Provider value={{ isRoles, setRoles }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
