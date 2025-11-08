import { QUERY_KEYS } from "constants/query";

import categoriesApi from "apis/categories";
import { useQuery, useMutation, useQueryClient } from "react-query";

export const useFetchCategories = () =>
  useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => categoriesApi.fetch(),
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payload => categoriesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.CATEGORIES]);
    },
  });
};
