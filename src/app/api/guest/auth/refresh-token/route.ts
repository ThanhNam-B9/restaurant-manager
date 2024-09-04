import guestApiRequest from "@/apiRequest/guest";
import { HttpError } from "@/lib/http";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const refresh_token = cookieStore.get("refreshToken")?.value!;
  if (!refresh_token) {
    return Response.json(
      {
        message: "Không nhận refreshToken, buộc đăng xuất !",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const { payload } = await guestApiRequest.sRefreshToken(refresh_token);
    const { accessToken, refreshToken } = payload.data;
    const { exp: expAccestoken } = decode(accessToken) as { exp: number };
    const { exp: expRefreshToken } = decode(refreshToken) as { exp: number };
    console.log("exp ", expRefreshToken);

    cookieStore.set("accessToken", accessToken, {
      expires: expAccestoken * 1000,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
    cookieStore.set("refreshToken", refreshToken, {
      expires: expRefreshToken * 1000,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: 401,
      });
    } else {
      return Response.json({
        message: "Có lỗi xảy ra !",
      });
    }
  }
}
