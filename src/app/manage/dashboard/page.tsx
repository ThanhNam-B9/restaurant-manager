import accountApiRequest from "@/apiRequest/account";
import { cookies } from "next/headers";
import React from "react";

export default async function DashBoardPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value!;
  let name = "";

  try {
    const res = await accountApiRequest.sMe(accessToken);
    name = res.payload.data.name;
  } catch (error: any) {
    // try catch mà có redirect thì sẽ bị lỗi NEXT_REDIRECT do try catch vẫn cho page đó chạy return
    // nên 1 phải dòng này để nó throww hay là không dùng try cacth
    if (error.digest.includes("NEXT_REDIRECT")) {
      throw error;
    }
  }
  return <div>DashBoardPag {name}</div>;
}
