import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
  refreshTokenA: null as null | Promise<{
    status: number;
    payload: RefreshTokenResType;
  }>,
  slogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
  slogout: (
    body: LogoutBodyType & {
      accessToken: string;
    }
  ) =>
    http.post<{ message: string }>(
      "/auth/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
          // Cookie: `sessionToken=${accessToken}`,
        },
      }
    ),
  logout: () =>
    http.post<{ message: string }>("/api/auth/logout", null, {
      baseUrl: "",
    }),
  sRefreshToken: (refreshToken: string) =>
    http.post<RefreshTokenResType>("/auth/refresh-token", {
      refreshToken,
    }),
  async refreshToken() {
    if (this.refreshTokenA) {
      return this.refreshTokenA;
    }
    this.refreshTokenA = http.post<RefreshTokenResType>(
      "/api/auth/refresh-token",
      null,
      {
        baseUrl: "",
      }
    );
    const res = await this.refreshTokenA;
    this.refreshTokenA = null;
    return res;
  },
};

export default authApiRequest;
