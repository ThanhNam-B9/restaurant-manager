"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "@/components/refresh-token";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  getConnectSocketInstan,
  removeAccessAndRefreshTokenInLocalStorage,
} from "@/lib/utils";
import { RoleType } from "@/app/types/jwt.types";
import { create } from "zustand";
import { Socket } from "socket.io-client";
import ListenLogoutSocket from "./listen-logout-socket";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // refetchOnMount: false, cho k refresh lại
    },
  },
});
interface useAppStoreType {
  isAuth: boolean;
  isRoles: RoleType | undefined;
  setRoles: (value?: RoleType | undefined) => void;
  socket: Socket | undefined;
  setSocket: (socket: Socket | undefined) => void;
  disconnectSocket: () => void;
}
// const AppContext = createContext({
//   isRoles: undefined as RoleType | undefined,
//   setRoles: (value?: RoleType | undefined) => {},
//   socket: undefined as Socket | undefined,
//   setSocket: (socket: Socket | undefined) => {},
//   disconnectSocket: () => {},
// });

export const useAppStore = create<useAppStoreType>()((set) => ({
  isAuth: false,
  isRoles: undefined as RoleType | undefined,
  setRoles: (isRoles?: RoleType | undefined) => {
    set({ isRoles });
    if (!isRoles) {
      removeAccessAndRefreshTokenInLocalStorage();
    }
  },
  socket: undefined as Socket | undefined,
  setSocket: (socket: Socket | undefined) => {
    set({ socket });
  },
  disconnectSocket: () => {
    set((state: any) => {
      state.socket?.disconnect();
      return { socket: undefined };
    });
  },
}));

// export const useAppStore = () => {
//   const context = useContext(AppContext);
//   return context;
// };
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [isRoles, setRolesState] = useState<RoleType | undefined>();
  // const [socket, setSocket] = useState<Socket | undefined>();
  const setSocket = useAppStore((state) => state.setSocket);
  const setRoles = useAppStore((state) => state.setRoles);

  const count = useRef(0);
  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage();
      if (accessToken) {
        const { role } = decodeToken(accessToken);
        setRoles(role);
        setSocket(getConnectSocketInstan(accessToken));
      }
      count.current++;
    }
  }, [setRoles, setSocket]);
  // const setRoles = useCallback((role?: RoleType | undefined) => {
  //   setRolesState(role);
  //   if (!role) {
  //     removeAccessAndRefreshTokenInLocalStorage();
  //   }
  // }, []);
  // const disconnectSocket = useCallback(() => {
  //   socket?.disconnect();
  //   setSocket(undefined);
  // }, [socket]);

  return (
    // Provide the client to your App
    //Nếu dùng react 19 và  next 15 thì không còn .Provider
    // <AppContext.Provider
    //   value={{ isRoles, setRoles, socket, setSocket, disconnectSocket }}
    // >
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ListenLogoutSocket />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    // </AppContext.Provider>
  );
}
