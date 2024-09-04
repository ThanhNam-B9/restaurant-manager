"use client";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { socket } from "@/lib/socket";

import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGetGuestListMutation } from "@/queries/useGuest";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

export default function CartOrders() {
  const { data, refetch } = useGetGuestListMutation();
  const listOrders = useMemo(() => data?.payload.data || [], [data]);

  const totalOrders = useMemo(() => {
    return listOrders.reduce((result, order) => {
      return result + order.quantity * order.dishSnapshot.price;
    }, 0);
  }, [listOrders]);
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("connect", socket.id);
    }
    function onDisconnect() {
      console.log("disconnect");
    }
    function updateOrders(data: UpdateOrderResType["data"]) {
      const {
        dishSnapshot: { name, price },
        status,
        quantity,
      } = data;
      toast({
        description: `Món ${name}(SL: ${quantity}) vừa được cập nhật trạng thái thành "${getVietnameseOrderStatus(
          status
        )}"`,
      });
      refetch();
    }
    socket.on("update-order", updateOrders);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", updateOrders);
    };
  }, [refetch]);
  return (
    <>
      {listOrders.map((order) => (
        <div key={order.id} className="flex gap-4">
          <div className="flex-shrink-0">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm ">{order.dishSnapshot.name}</h3>
            <p className="text-xs">{order.dishSnapshot.description}</p>
            <p className="text-xs font-semibold">
              {formatCurrency(order.dishSnapshot.price)}
            </p>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-between items-center flex-col">
            <Badge className="flex gap-1 ">
              {getVietnameseOrderStatus(order.status)}
            </Badge>

            <div className="flex gap-1 ">x{order.quantity}</div>
          </div>
        </div>
      ))}
      <div className="sticky bottom-0">
        <div className="w-full  flex justify-between items-center">
          <span>Giá · {listOrders.length} món</span>
          <span>{formatCurrency(totalOrders)}</span>
        </div>
      </div>
    </>
  );
}
