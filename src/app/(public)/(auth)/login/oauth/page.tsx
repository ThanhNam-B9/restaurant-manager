"use client";
import { useAppStore } from "@/components/app-provider";
import { toast } from "@/components/ui/use-toast";
import { decodeToken, getConnectSocketInstan } from "@/lib/utils";
import { useOauthLoginMutation } from "@/queries/useOauth";

import { useRouter, useSearchParams } from "next/navigation";
import { MutableRefObject, useEffect, useRef } from "react";

function LoginAuthGGPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const countRef = useRef(0);
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const message = searchParams.get("message");
  // const { setRoles, setSocket } = ();
  const setRoles = useAppStore((state) => state.setRoles);
  const setSocket = useAppStore((state) => state.setSocket);

  const { mutateAsync } = useOauthLoginMutation();
  useEffect(() => {
    if (countRef.current === 0) {
      if (accessToken && refreshToken) {
        mutateAsync({ accessToken, refreshToken }).then((data) => {
          const { role } = decodeToken(data.payload.refreshToken);
          setRoles(role);
          setSocket(getConnectSocketInstan(data.payload.refreshToken));
          router.push("/manage/orders");
        });
        countRef.current++;
      } else {
        console.log("sss");
        if (countRef.current === 0) {
          const timeout = setTimeout(() => {
            toast({
              description: message ?? "Đã có lỗi xãy ra!",
            });
          });
          countRef.current++;
        }
        // Không phải clearTimeout do chắc chắn nó chỉ chạy 1 lần countRef.current === 0
        // return () => timeout && clearTimeout(timeout);

        // router.push("/login");
      }
    }
  }, [
    router,
    mutateAsync,
    accessToken,
    refreshToken,
    message,
    setRoles,
    setSocket,
  ]);

  return null;
}

export default LoginAuthGGPage;
