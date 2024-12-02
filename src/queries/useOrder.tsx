import orderApiRequest from "@/apiRequest/order";
import {
  GetOrdersQueryParamsType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetOrderList = (queryParams: GetOrdersQueryParamsType) => {
  {
    return useQuery({
      queryKey: ["orders", queryParams],
      queryFn: () => orderApiRequest.getOrderList(queryParams),
    });
  }
};

export const useOrdersDetail = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  {
    return useQuery({
      queryKey: ["orders", id],
      queryFn: () => orderApiRequest.getOrderDetail(id),
      enabled,
    });
  }
};
export const useUpdateOrder = () => {
  {
    return useMutation({
      mutationFn: ({ id, body }: { body: UpdateOrderBodyType; id: number }) =>
        orderApiRequest.updateOrder({ body, id }),
    });
  }
};

export const usePaymentOrders = () => {
  {
    return useMutation({
      mutationFn: orderApiRequest.paymentOrder,
    });
  }
};
export const useCreateOrder = () => {
  {
    return useMutation({
      mutationFn: orderApiRequest.createOrder,
    });
  }
};
