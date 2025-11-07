/* eslint-disable react-hooks/rules-of-hooks */

import { QUERY_KEYS } from "constants/query";

import authApi from "apis/auth";
import { setAuthHeaders, resetAuthTokens } from "apis/axios";
import { useMutation, useQueryClient } from "react-query";
import { setToLocalStorage } from "utils/storage";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payload => authApi.login({ login: payload }),
    onSuccess: async (response, values) => {
      setToLocalStorage({
        authToken: response.authentication_token,
        email: values.email.toLowerCase(),
        userId: response.id,
        userName: response.name,
      });

      setAuthHeaders();
      await queryClient.invalidateQueries([QUERY_KEYS.USERS]);
    },
  });
};

export const useSignup = () =>
  useMutation({
    mutationFn: payload => authApi.signup(payload),
  });

export const useLogout = () =>
  useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      setToLocalStorage({
        authToken: null,
        email: null,
        userId: null,
        userName: null,
      });
      resetAuthTokens();
    },
  });
