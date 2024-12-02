"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "@/schemaValidations/guest.schema";
import { useGuestLoginMutation } from "@/queries/useGuest";
import { useParams, useSearchParams } from "next/navigation";
import { getConnectSocketInstan, handleErrorApi } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/components/app-provider";

export default function GuestLoginForm() {
  const searchParams = useSearchParams();
  const guestLoginMutation = useGuestLoginMutation();
  const tokenParams = searchParams.get("token");
  const router = useRouter();
  // const { setRoles } = ();
  const setRoles = useAppStore((state) => state.setRoles);
  const setSocket = useAppStore((state) => state.setSocket);

  const { number } = useParams<{ number: string }>();
  const numberTable = Number(number);
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      token: tokenParams ?? "",
      tableNumber: numberTable ?? 0,
    },
  });

  const onSunmit = async (values: GuestLoginBodyType) => {
    if (guestLoginMutation.isPending) return;

    try {
      const res = await guestLoginMutation.mutateAsync(values);
      toast({
        description: res.payload.message,
      });
      setRoles(res.payload.data.guest.role);
      setSocket(getConnectSocketInstan(res.payload.data.accessToken));
      router.push("/guest/menu");
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSunmit)}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Tên khách hàng</Label>
                      <Input id="name" type="text" required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
