import authApiRequest from "@/apiRequest/auth";
import { HttpError } from "@/lib/http";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const body = (await request.json()) as LoginBodyType;
  try {
    const { payload } = await authApiRequest.slogin(body);
    console.log("====================================");
    console.log(payload);
    console.log("====================================");
    const { accessToken, refreshToken } = payload.data;
    const { exp: expAccestoken } = decode(accessToken) as { exp: number };
    const { exp: expRefreshToken } = decode(refreshToken) as { exp: number };
    console.log("exp ", expAccestoken);

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
        status: error.status,
      });
    } else {
      return Response.json({
        message: "Có lỗi xảy ra !",
      });
    }
  }
}
