import orderApiRequest from "@/apiRequest/order";
import { UpdateOrderBodyType } from "@/schemaValidations/order.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDishesList = () => {
  {
    return useQuery({
      queryKey: ["orders"],
      queryFn: orderApiRequest.getOrderList,
    });
  }
};
// export const useCreateDish = () => {
//   const queryClient = useQueryClient();
//   {
//     return useMutation({
//       mutationFn: (body: CreateDishBodyType) =>
//         dishesApiRequest.createDish(body),
//       onSuccess: () => {
//         queryClient.invalidateQueries({
//           queryKey: ["dishes"],
//         });
//       },
//     });
//   }
// };
// export const useDishDetail = ({
//   id,
//   enabled,
// }: {
//   id: number;
//   enabled: boolean;
// }) => {
//   {
//     return useQuery({
//       queryKey: ["dishes", id],
//       queryFn: () => dishesApiRequest.getDishDetail(id),
//       enabled,
//     });
//   }
// };
export const useUpdateDish = () => {
  {
    return useMutation({
      mutationFn: ({ id, body }: { body: UpdateOrderBodyType; id: number }) =>
        orderApiRequest.updateOrder({ body, id }),
    });
  }
};

// export const useDeleteDish = () => {
//   const queryClient = useQueryClient();

//   {
//     return useMutation({
//       mutationFn: dishesApiRequest.deleteDish,
//       onSuccess: () => {
//         queryClient.invalidateQueries({
//           queryKey: ["dishes"],
//         });
//       },
//     });
//   }
// };
