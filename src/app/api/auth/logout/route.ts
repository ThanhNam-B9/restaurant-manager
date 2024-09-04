import authApiRequest from "@/apiRequest/auth";
import { HttpError } from "@/lib/http";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  console.log("accessToken", accessToken);
  console.log("refreshToken", refreshToken);

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: "Không nhận accessToken và refreshToken, buộc đăng xuất !",
      },
      {
        status: 200,
      }
    );
  }

  const body = {
    refreshToken,
    accessToken,
  };
  try {
    const res = await authApiRequest.slogout(body);
    console.log("asss", res);
    return Response.json(res.payload);
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
