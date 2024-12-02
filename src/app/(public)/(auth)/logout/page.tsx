"use client";
import { useAppStore } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
function Logout() {
  const router = useRouter();
  const ref = useRef<any>(null);
  const searchParams = useSearchParams();
  const refreshTokenParamsUrl = searchParams.get("refreshToken");
  const accessTokenParamUrl = searchParams.get("accessToken");
  // const { setRoles } = ();
  const setRoles = useAppStore((state) => state.setRoles);
  const { mutateAsync } = useLogoutMutation();
  useEffect(() => {
    if (
      !ref.current ||
      (refreshTokenParamsUrl &&
        refreshTokenParamsUrl === getRefreshTokenFromLocalStorage()) ||
      (accessTokenParamUrl &&
        accessTokenParamUrl === getAccessTokenFromLocalStorage())
    ) {
      ref.current = mutateAsync;
      mutateAsync().then((res) => {
        setTimeout(() => {
          ref.current = null;
        });
        setRoles();
        console.log("abc");
        router.push("/login");
      });
    } else {
      router.push("/");
    }
  }, [
    mutateAsync,
    router,
    refreshTokenParamsUrl,
    accessTokenParamUrl,
    setRoles,
  ]);
  return <div>Logout...</div>;
}
function LogoutPage() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Logout />
    </Suspense>
  );
}

export default LogoutPage;
