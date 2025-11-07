import { QUERY_KEYS } from "constants/query";

import votesApi from "apis/votes";
import { useQuery, useMutation, useQueryClient } from "react-query";

export const useFetchVotes = params =>
  useQuery({
    queryKey: [QUERY_KEYS.VOTES, params],
    queryFn: () => votesApi.fetch(params),
  });

export const useCreateVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ params, payload }) => votesApi.create(params, payload),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.VOTES]);
    },
  });
};
