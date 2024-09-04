import http from "@/lib/http";
import {
  LogoutBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import {
  GuestCreateOrdersBodyType,
  GuestCreateOrdersResType,
  GuestGetOrdersResType,
  GuestLoginBodyType,
  GuestLoginResType,
} from "@/schemaValidations/guest.schema";

const guestApiRequest = {
  refreshTokenA: null as null | Promise<{
    status: number;
    payload: RefreshTokenResType;
  }>,
  slogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("guest/auth/login", body),
  login: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/api/guest/auth/login", body, {
      baseUrl: "",
    }),
  slogout: (
    body: LogoutBodyType & {
      accessToken: string;
    }
  ) =>
    http.post<{ message: string }>(
      "guest/auth/logout",
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
    http.post<{ message: string }>("/api/guest/auth/logout", null, {
      baseUrl: "",
    }),
  sRefreshToken: (refreshToken: string) =>
    http.post<RefreshTokenResType>("guest/auth/refresh-token", {
      refreshToken,
    }),
  async refreshToken() {
    if (this.refreshTokenA) {
      return this.refreshTokenA;
    }
    this.refreshTokenA = http.post<RefreshTokenResType>(
      "/api/guest/auth/refresh-token",
      null,
      {
        baseUrl: "",
      }
    );
    const res = await this.refreshTokenA;
    this.refreshTokenA = null;
    return res;
  },
  orders: (body: GuestCreateOrdersBodyType) =>
    http.post<GuestCreateOrdersResType>("guest/orders", body),

  getOrdersList: () =>
    http.get<GuestGetOrdersResType>("guest/orders", {
      next: { tags: ["orders-guest"] },
      cache: "no-cache",
    }),
};

export default guestApiRequest;
