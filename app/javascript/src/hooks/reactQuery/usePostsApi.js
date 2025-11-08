import { QUERY_KEYS } from "constants/query";

import postsApi from "apis/posts";
import { useQuery, useMutation, useQueryClient } from "react-query";

export const useFetchPosts = ({ params = {}, scope }) => {
  const stableKey = JSON.stringify(params);

  return useQuery({
    queryKey: [QUERY_KEYS.POSTS, stableKey, scope],
    queryFn: () => postsApi.fetch({ params, scope }),
    keepPreviousData: true,
  });
};

export const useFetchPost = slug =>
  useQuery({
    queryKey: [QUERY_KEYS.POSTS, slug],
    queryFn: () => postsApi.show(slug),
  });

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payload => postsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.POSTS]);
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, payload, quiet }) =>
      postsApi.update({ slug, payload, quiet }),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries([QUERY_KEYS.POSTS]);
      queryClient.invalidateQueries([QUERY_KEYS.POSTS, slug]);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: slug => postsApi.destroy(slug),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.POSTS]);
    },
  });
};

export const useBulkDestroyPosts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postIds => postsApi.bulkDestroy(postIds),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.POSTS]);
    },
  });
};

export const useBulkStatusUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postIds, status }) =>
      postsApi.bulkStatusUpdate(postIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.POSTS]);
    },
  });
};
