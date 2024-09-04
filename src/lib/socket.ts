import evnClientConfig from "@/config";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import { io } from "socket.io-client";
export const socket = io(evnClientConfig.NEXT_PUBLIC_API_ENDPOINT, {
  auth: {
    Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
  },
});
