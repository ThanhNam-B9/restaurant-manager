"use client";
import authApiRequest from "@/apiRequest/auth";
import { checkAndRefreshToken } from "@/lib/utils";
import { decode } from "jsonwebtoken";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
const UAUTHENTICATED_PATH = ["/login", "/register", "/refresh-token"];
function RefreshToken() {
  const router = useRouter();
  const pathNameUrl = usePathname();
  useEffect(() => {
    if (UAUTHENTICATED_PATH.includes(pathNameUrl)) return;
    let interval: any = null;
    // Do interval sau khoảng thời gian mới chạy lần đầu nên phải gọi lần đầu luôn để check
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        router.push("/login");
      },
    });
    // Timeout phải bé hơn thời gian hết hạn của access token
    // Vd : thời gian hết hạn của access là 10s thì phải check 1s
    const TIMEOUT = 1000;
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            clearInterval(interval);
            router.push("/login");
          },
        }),
      TIMEOUT
    );
    return () => {
      clearInterval(interval);
    };
  }, [pathNameUrl, router]);

  return null;
}

export default RefreshToken;
