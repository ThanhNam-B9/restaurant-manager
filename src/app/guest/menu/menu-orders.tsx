"use client";
import revalidateApiRequest from "@/apiRequest/revalidate";
import Quantity from "@/app/guest/menu/quantity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { DishStatus } from "@/constants/type";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import { useDishesList } from "@/queries/useDish";
import { useGuestOrderMutation } from "@/queries/useGuest";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { Minus, Plus, Route } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

export default function MenuOrders() {
  const { data } = useDishesList();
  const guestOrderMutation = useGuestOrderMutation();
  const route = useRouter();
  const dishes = useMemo(() => data?.payload.data || [], [data]);
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);
  const totalOrders = useMemo(() => {
    return dishes.reduce((result, dishe) => {
      const order = orders.find((order) => order.dishId === dishe.id);
      if (!order) return result;
      return result + order.quantity * dishe.price;
    }, 0);
  }, [dishes, orders]);
  const handleOnchangeQuantity = (idDish: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== idDish);
      }
      const index = prevOrders.findIndex((order) => order.dishId === idDish);
      if (index === -1) {
        return [...prevOrders, { dishId: idDish, quantity }];
      }
      const newPrevOrders = [...prevOrders];
      newPrevOrders[index] = { ...newPrevOrders[index], quantity };
      return newPrevOrders;
    });
  };
  console.log(orders);
  const handleOrderDish = async () => {
    if (guestOrderMutation.isPending) return;
    try {
      const res = await guestOrderMutation.mutateAsync(orders);
      await revalidateApiRequest("orders-guest");
      toast({
        description: res.payload.message,
      });
      route.push("/guest/orders");
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <>
      {dishes.length > 0 &&
        dishes
          .filter((item) => item.status !== DishStatus.Hidden)
          .map((dish) => (
            <div
              key={dish.id}
              className={cn(
                "flex gap-4 ",
                dish.status == DishStatus.Unavailable
                  ? "pointer-events-none"
                  : ""
              )}
            >
              <div className="flex-shrink-0 relative">
                {dish.status === DishStatus.Unavailable && (
                  <div className="absolute pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">
                    Hết hàng
                  </div>
                )}
                <Image
                  src={dish.image}
                  alt={dish.name}
                  height={100}
                  width={100}
                  quality={100}
                  className="object-cover w-[80px] h-[80px] rounded-md"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm">{dish.name}</h3>
                <p className="text-xs">{dish.description}</p>
                <p className="text-xs font-semibold">
                  {formatCurrency(dish.price)}
                </p>
              </div>
              <div className="flex-shrink-0 ml-auto flex justify-center items-center">
                <div className="flex gap-1 ">
                  <Quantity
                    value={
                      orders.find((order) => order.dishId === dish.id)
                        ?.quantity ?? 0
                    }
                    onChange={(value) => handleOnchangeQuantity(dish.id, value)}
                  />
                </div>
              </div>
            </div>
          ))}
      <div className="sticky bottom-0">
        <Button
          className="w-full justify-between"
          onClick={handleOrderDish}
          disabled={Boolean(orders.length === 0)}
        >
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalOrders)}</span>
        </Button>
      </div>
    </>
  );
}
