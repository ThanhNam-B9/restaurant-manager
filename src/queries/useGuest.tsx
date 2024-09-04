import guestApiRequest from "@/apiRequest/guest";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.login,
  });
};

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout,
  });
};
export const useGetGuestListMutation = () => {
  return useQuery({
    queryKey: ["orders-guest"],
    queryFn: guestApiRequest.getOrdersList,
  });
};
export const useGuestOrderMutation = () => {
  const queriesClient = useQueryClient();
  return useMutation({
    mutationFn: guestApiRequest.orders,
    onSuccess: () => {
      queriesClient.invalidateQueries({
        queryKey: ["orders-guest"],
      });
    },
  });
};
