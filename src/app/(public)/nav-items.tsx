"use client";
import { useAppContext } from "@/components/app-provider";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import { cookies } from "next/headers";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu",
  },
  {
    title: "Đơn hàng",
    href: "/orders",
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true,
  },
];

export default function NavItems({ className }: { className?: string }) {
  // const cookieStore = cookies();
  // const accessToken = cookieStore.get("accessToken");
  // const isClient = Boolean(accessToken);
  // console.log("accessToken", accessToken);
  const { isAuth } = useAppContext();

  return menuItems.map((item) => {
    if (
      (isAuth && item.authRequired === false) ||
      (item.authRequired === true && !isAuth)
    ) {
      return null;
    }
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}