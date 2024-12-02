import oauthApiRequest from "@/apiRequest/oauth";
import { useMutation } from "@tanstack/react-query";

export const useOauthLoginMutation = () => {
  return useMutation({
    mutationFn: oauthApiRequest.login,
  });
};
