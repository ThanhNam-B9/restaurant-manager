import accountApiRequest from "@/apiRequest/account";
import {
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  GetGuestListQueryParamsType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAccountMe = () =>
  // onSuccess: (data: AccountResType) => void
  {
    return useQuery({
      queryKey: ["account-me"],
      queryFn: accountApiRequest.me, // khi không nhận tham dùng thế nàu cũng đc
      //   queryFn: () =>
      //     accountApiRequest.me().then((res) => {
      //       onSuccess && onSuccess(res.payload); // xủ logic theo yêu cầu nếu có
      //       return res;
      //     }),
    });
  };
export const useUploadImg = () => {
  return useMutation({
    mutationFn: (body: FormData) => accountApiRequest.uploadAvatar(body),
  });
};
export const useUpdateMe = () => {
  return useMutation({
    mutationFn: (body: UpdateMeBodyType) => accountApiRequest.updateMe(body),
  });
};
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (body: ChangePasswordBodyType) =>
      accountApiRequest.changePassword(body),
  });
};
export const useListEmployees = () => {
  {
    return useQuery({
      queryKey: ["emmployees"],
      queryFn: accountApiRequest.listEmployees,
    });
  }
};
export const useAddEmployee = () => {
  const queryClient = useQueryClient();
  {
    return useMutation({
      mutationFn: (body: CreateEmployeeAccountBodyType) =>
        accountApiRequest.addEmployee(body),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["emmployees"],
        });
      },
    });
  }
};
export const useGetEmployee = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  {
    return useQuery({
      queryKey: ["emmployee", id],
      queryFn: () => accountApiRequest.getEmployee({ id }),
      enabled,
    });
  }
};
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  {
    return useMutation({
      mutationFn: ({
        id,
        body,
      }: {
        body: UpdateEmployeeAccountBodyType;
        id: number;
      }) => accountApiRequest.updateEmployee(body, id),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["emmployees"],
          exact: true,
        });
      },
    });
  }
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  {
    return useMutation({
      mutationFn: accountApiRequest.deteleEmployee,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["emmployees"],
        });
      },
    });
  }
};
export const useGetGuestList = (queryParams: GetGuestListQueryParamsType) => {
  {
    return useQuery({
      queryKey: ["guests", queryParams],
      queryFn: () => accountApiRequest.getListGuest(queryParams),
    });
  }
};
export const useCreateGuest = () => {
  {
    return useMutation({
      mutationFn: accountApiRequest.createGuest,
    });
  }
};
