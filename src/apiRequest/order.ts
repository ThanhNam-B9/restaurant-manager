import http from "@/lib/http";
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import queryString from "query-string";
const ORDERSTPATH = "/orders";
const orderApiRequest = {
  getOrderList: (queryParams: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(
      `${ORDERSTPATH}?` +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString(),
        })
    ),

  updateOrder: ({ id, body }: { id: number; body: UpdateOrderBodyType }) =>
    http.put<GetOrderDetailResType>(`${ORDERSTPATH}/${id}`, body),
  getOrderDetail: (orderId: number) =>
    http.get<GetOrderDetailResType>(`${ORDERSTPATH}/${orderId}`),
  paymentOrder: (body: PayGuestOrdersBodyType) =>
    http.post<PayGuestOrdersResType>(`${ORDERSTPATH}/pay`, body),
  createOrder: (body: CreateOrdersBodyType) =>
    http.post<CreateOrdersResType>(`${ORDERSTPATH}`, body),
};
export default orderApiRequest;
