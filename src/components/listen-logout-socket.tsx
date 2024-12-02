"use client";
import { useAppStore } from "@/components/app-provider";

import { usePathname, useRouter } from "next/navigation";
import { useLogoutMutation } from "@/queries/useAuth";
import React, { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
const UAUTHENTICATED_PATH = ["/login", "/register", "/refresh-token"];
function ListenLogoutSocket() {
  const router = useRouter();
  const { mutateAsync, isPending } = useLogoutMutation();

  const pathNameUrl = usePathname();

  const disconnectSocket = useAppStore((state) => state.disconnectSocket);
  const setRoles = useAppStore((state) => state.setRoles);
  const socket = useAppStore((state) => state.socket);

  useEffect(() => {
    if (UAUTHENTICATED_PATH.includes(pathNameUrl) || isPending) return;

    async function onLogoutSocket() {
      try {
        const { payload } = await mutateAsync();
        console.log(2);

        setRoles();
        router.push("/");
        toast({
          description: payload.message,
        });
        disconnectSocket();
      } catch (error) {
        handleErrorApi({
          error,
        });
      }
    }

    socket?.on("logout", onLogoutSocket);
    return () => {
      socket?.off("logout", onLogoutSocket);
    };
  }, [
    pathNameUrl,
    router,
    socket,
    disconnectSocket,
    setRoles,
    isPending,
    mutateAsync,
  ]);

  return null;
}

export default ListenLogoutSocket;
