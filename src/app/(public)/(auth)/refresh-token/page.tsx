"use client";
import {
  checkAndRefreshToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
function RefreshToken() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenParamsUrl = searchParams.get("refreshToken");
  const redirectParamUrl = searchParams.get("redirect") as string;

  const { mutateAsync } = useLogoutMutation();

  useEffect(() => {
    if (
      refreshTokenParamsUrl &&
      refreshTokenParamsUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectParamUrl || "/");
        },
      });
    } else {
      router.push("/");
    }
  }, [mutateAsync, router, refreshTokenParamsUrl, redirectParamUrl]);
  return <div>Refresh token...</div>;
}
function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshToken />
    </Suspense>
  );
}

export default RefreshTokenPage;
