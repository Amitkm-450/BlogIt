/* eslint-disable react-hooks/rules-of-hooks */
import { QUERY_KEYS } from "constants/query";

import authApi from "apis/auth";
import { setAuthHeaders } from "apis/axios";
import Logger from "js-logger";
import { useMutation, useQueryClient } from "react-query";
import { setToLocalStorage } from "utils/storage";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payload => authApi.login({ login: payload }),
    onSuccess: async (response, values) => {
      try {
        setToLocalStorage({
          authToken: response.authentication_token,
          email: values.email.toLowerCase(),
          userId: response.id,
          userName: response.name,
        });

        setAuthHeaders();
        Logger.log("onSuccess Global 1");
        await queryClient.invalidateQueries([QUERY_KEYS.USER]);
        Logger.log("onSuccess Global 2");
      } catch (error) {
        Logger.error(error);
      }
    },
    onError: error => {
      Logger.error("Login failed:", error);
    },
  });
};
