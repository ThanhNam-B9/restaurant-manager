"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  UpdateMeBody,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAccountMe, useUpdateMe, useUploadImg } from "@/queries/useAccount";
import { handleErrorApi } from "@/lib/utils";
import accountApiRequest from "@/apiRequest/account";
import { toast } from "@/components/ui/use-toast";

export default function UpdateProfileForm() {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const uploadImgMutation = useUploadImg();
  const { data, refetch } = useAccountMe();
  const updateMeMutation = useUpdateMe();
  // if (data) {
  //   form.reset({
  //     name: data.payload.data.name,
  //     avatar: data.payload.data.avatar ?? "",
  //   });
  // }
  /// bị do Header cũng dung chung mutation nên bị caching nên cái thứ 2 sẽ không gọi lại

  const [file, setFile] = useState<File | null>(null);
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: "",
      avatar: undefined,
    },
  });
  const avatar = form.watch("avatar");
  console.log("ava", avatar);

  const preveiwAvatar = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return avatar;
  }, [file, avatar]);
  // const abc = useUploadImg();
  async function onSubmit(values: UpdateMeBodyType) {
    if (updateMeMutation.isPending) return;
    try {
      let body = values;

      if (file) {
        const formData = new FormData();
        formData.append("file", file as Blob);
        const uploadAvatar = await uploadImgMutation.mutateAsync(formData);

        const avatar = uploadAvatar.payload.data;
        body = {
          ...values,
          avatar,
        };
      }
      const res = await updateMeMutation.mutateAsync(body);
      toast({
        description: res.payload.message,
      });
      refetch();
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  }

  const reset = () => {
    form.reset();
    setFile(null);
  };
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.payload.data.name,
        avatar: data.payload.data.avatar ?? undefined,
      });
    }
  }, [data, form]);
  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onSubmit={form.handleSubmit(onSubmit, (err) => {
          console.log("err", err);
        })}
        onReset={reset}
      >
        <Card x-chunk="dashboard-07-chunk-0">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={preveiwAvatar} />
                        <AvatarFallback className="rounded-none">
                          {"duoc"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target?.files?.[0];
                          console.log("sss", file);
                          if (file) {
                            // form.setValue(
                            //   "avatar",
                            //   `http://localhost:3000/${file.name}`
                            // );
                            setFile(file);
                            field.onChange(
                              `http://localhost:3000/${field.name}`
                            );
                          }
                        }}
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="name">Tên</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=" items-center gap-2 md:ml-auto flex">
                <Button variant="outline" size="sm" type="reset">
                  Hủy
                </Button>
                <Button size="sm" type="submit">
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
