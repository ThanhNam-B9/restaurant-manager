"use client";
import { RoleType } from "@/app/types/jwt.types";
import { useAppContext } from "@/components/app-provider";
import { toast } from "@/components/ui/use-toast";
import { Role } from "@/constants/type";
import { getAccessTokenFromLocalStorage, handleErrorApi } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { cookies } from "next/headers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
const menuItems: {
  title: string;
  href: string;
  role?: RoleType[];
  hideWhenLogin?: boolean;
}[] = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Menu",
    href: "/guest/menu",
    role: [Role.Guest],
  },
  {
    title: "Đơn hàng",
    href: "/guest/orders",
    role: [Role.Guest],
  },
  {
    title: "Đăng nhập",
    href: "/login",
    hideWhenLogin: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    role: [Role.Owner, Role.Employee],
  },
];

export default function NavItems({ className }: { className?: string }) {
  // const cookieStore = cookies();
  // const accessToken = cookieStore.get("accessToken");
  // const isClient = Boolean(accessToken);
  // console.log("accessToken", accessToken);
  const router = useRouter();
  const logoutMatation = useLogoutMutation();
  const { isRoles, setRoles } = useAppContext();
  const logout = async () => {
    try {
      const { payload } = await logoutMatation.mutateAsync();
      setRoles();
      router.push("/");
      toast({
        description: payload.message,
      });
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };
  return (
    <>
      {menuItems.map((item) => {
        const isAuth = isRoles && item.role && item.role.includes(isRoles);
        const autoShow = !item.role && !item.hideWhenLogin;
        const hideWhenLogin = !isRoles && !item.role && item.hideWhenLogin;
        if (isAuth || autoShow || hideWhenLogin) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          );
        }
        return null;
      })}
      {isRoles && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="cursor-pointer text-muted-foreground ">
              Đăng xuất
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn chắc chắn muốn đăng xuất?</AlertDialogTitle>
              {isRoles === Role.Guest && (
                <AlertDialogDescription>
                  Lưu ý: Nếu bạn đăng xuất sẽ bị mất đơn hàng hiện tại !
                </AlertDialogDescription>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>Đồng ý</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
