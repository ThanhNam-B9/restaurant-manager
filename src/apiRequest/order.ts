import http from "@/lib/http";
import {
  GetOrderDetailResType,
  GetOrdersResType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";

const ORDERSTPATH = "/orders";
const orderApiRequest = {
  getOrderList: () => http.get<GetOrdersResType>(ORDERSTPATH),

  updateOrder: ({ id, body }: { id: number; body: UpdateOrderBodyType }) =>
    http.put<GetOrderDetailResType>(`${ORDERSTPATH}/${id}`, body),
};
export default orderApiRequest;
