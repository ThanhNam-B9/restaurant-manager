"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/queries/useAuth";
import { toast } from "@/components/ui/use-toast";
import { getConnectSocketInstan, handleErrorApi } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAppStore } from "@/components/app-provider";
import evnClientConfig from "@/config";
import Link from "next/link";

export default function LoginForm() {
  const loginMutation = useLoginMutation();
  const router = useRouter();
  const setRoles = useAppStore((state) => state.setRoles);
  const setSocket = useAppStore((state) => state.setSocket);
  const searchParams = useSearchParams();
  const clearToken = searchParams.get("clearToken");
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "admin@order.com",
      password: "123456",
    },
  });
  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return;
    try {
      const result = await loginMutation.mutateAsync(data);
      toast({
        description: result.payload.message,
      });
      setRoles(result.payload.data.account.role);
      setSocket(getConnectSocketInstan(result.payload.data.accessToken));
      router.push("/");
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };
  const getOauthGoogleUrl = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: evnClientConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
      client_id: evnClientConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };
    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
  };
  console.log(
    "abc",
    evnClientConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
    "ssss",
    evnClientConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  );
  const googleOauthUrl = getOauthGoogleUrl();
  useEffect(() => {
    if (clearToken) {
      setRoles();
    }
  }, [clearToken, setRoles]);
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log("error", err);
            })}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
              <Link href={googleOauthUrl}>
                <Button variant="outline" className="w-full" type="button">
                  Đăng nhập bằng Google
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
