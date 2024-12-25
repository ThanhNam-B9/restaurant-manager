import jwt from "jsonwebtoken";
import { Role } from "@/constants/type";
// import { decodeToken } from "@/lib/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TokenPayload } from "./app/types/jwt.types";
const managePaths = ["/manage"];
const guestPaths = ["/guest"];
const privatePaths = [...managePaths, ...guestPaths];
const authPaths = ["/login", "/register"];
const onlyOwnerPaths = ["/manage/accounts"];
const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};
const productEditRegex = /^\/products\/\d+\/edit$/;
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const accessToken = request.cookies.get("accessToken")?.value;
  //1. Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearToken", "true");
    return NextResponse.redirect(url);
  }
  //2  Đăng nhập rồi mà accessToken hết hạn và còn refreshToken thì cho logout
  if (refreshToken) {
    const { role } = decodeToken(refreshToken);
    // Đăng nhập rồi thì không cho vào login/register nữa
    if (authPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Đăng nhập nhưng accessToken hết hạn , làm mới accessToken
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken ?? "");
      url.searchParams.set("redirect", pathname ?? "");
      return NextResponse.redirect(url);
    }
    // Đăng nhập nhưng nhưng truy cập vào những Paths không được phân quyền trở về trang chủ
    const isGuestGotoPathUrl =
      role === Role.Guest &&
      managePaths.some((path) => pathname.startsWith(path));
    const isNotGuestGoToPathUrl =
      role !== Role.Guest &&
      guestPaths.some((path) => pathname.startsWith(path));
    const isNotOwnerGotoPathUrl =
      role !== Role.Owner && onlyOwnerPaths.some((path) => pathname === path);
    if (isGuestGotoPathUrl || isNotGuestGoToPathUrl || isNotOwnerGotoPathUrl) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/register", "/manage/:path*", "/guest/:path*"],
};
