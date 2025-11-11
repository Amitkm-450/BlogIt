import { QUERY_KEYS } from "constants/query";

import votesApi from "apis/votes";
import { useQuery, useMutation, useQueryClient } from "react-query";

export const useFetchVotes = postSlug =>
  useQuery({
    queryKey: [QUERY_KEYS.VOTES, postSlug],
    queryFn: () => votesApi.fetch(postSlug),
  });

export const useCreateVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postSlug, payload }) => votesApi.create(postSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.POSTS]);
      queryClient.invalidateQueries([QUERY_KEYS.VOTES]);
    },
  });
};

export const useDeleteVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ params, payload }) => votesApi.destroy(params, payload),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.POSTS]);
      queryClient.invalidateQueries([QUERY_KEYS.VOTES]);
    },
  });
};
