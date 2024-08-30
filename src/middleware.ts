import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/manage"];
const authPaths = ["/login", "/register"];

const productEditRegex = /^\/products\/\d+\/edit$/;
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const accessToken = request.cookies.get("accessToken")?.value;

  // Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearToken", "true");
    return NextResponse.redirect(url);
  }
  // Đăng nhập rồi mà accessToken hết hạn và còn refreshToken thì cho logout
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !accessToken &&
    refreshToken
  ) {
    const url = new URL("/refresh-token", request.url);
    url.searchParams.set("refreshToken", refreshToken ?? "");
    url.searchParams.set("redirect", pathname ?? "");
    return NextResponse.redirect(url);
  }
  // Đăng nhập rồi thì không cho vào login/register nữa
  if (authPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/me", "/login", "/register", "/manage/:path*", "/"],
};
