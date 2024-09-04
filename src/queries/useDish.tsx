import accountApiRequest from "@/apiRequest/account";
import dishesApiRequest from "@/apiRequest/dishes";
import {
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import {
  CreateDishBodyType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDishesList = () => {
  {
    return useQuery({
      queryKey: ["dishes"],
      queryFn: dishesApiRequest.getDishList,
    });
  }
};
export const useCreateDish = () => {
  const queryClient = useQueryClient();
  {
    return useMutation({
      mutationFn: (body: CreateDishBodyType) =>
        dishesApiRequest.createDish(body),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["dishes"],
        });
      },
    });
  }
};
export const useDishDetail = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  {
    return useQuery({
      queryKey: ["dishes", id],
      queryFn: () => dishesApiRequest.getDishDetail(id),
      enabled,
    });
  }
};
export const useUpdateDish = () => {
  const queryClient = useQueryClient();
  {
    return useMutation({
      mutationFn: ({ id, body }: { body: UpdateDishBodyType; id: number }) =>
        dishesApiRequest.updateDish({ body, id }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["dishes"],
          exact: true,
        });
      },
    });
  }
};

export const useDeleteDish = () => {
  const queryClient = useQueryClient();

  {
    return useMutation({
      mutationFn: dishesApiRequest.deleteDish,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["dishes"],
        });
      },
    });
  }
};
