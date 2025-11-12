import { QUERY_KEYS } from "constants/query";

import myPostsApi from "apis/myPosts";
import { useQuery, useMutation, useQueryClient } from "react-query";

export const useFetchMyPosts = (params = {}) => {
  const stableKey = JSON.stringify(params);

  return useQuery({
    queryKey: [QUERY_KEYS.MY_POSTS, stableKey],
    queryFn: () => myPostsApi.fetch(params),
    keepPreviousData: true,
  });
};

export const useBulkDestroyMyPosts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postIds => myPostsApi.bulkDestroy(postIds),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.POSTS]);
      queryClient.invalidateQueries([QUERY_KEYS.MY_POSTS]);
    },
  });
};

export const useBulkStatusUpdateMyPosts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postIds, status }) =>
      myPostsApi.bulkStatusUpdate(postIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.POSTS]);
      queryClient.invalidateQueries([QUERY_KEYS.MY_POSTS]);
    },
  });
};
