import axios from "axios";

import {
  myPostsUrl,
  bulkDestroyMyPostsUrl,
  bulkStatusUpdateMyPostsUrl,
} from "../endPoints";

const fetch = params => axios.get(myPostsUrl(), { params });

const bulkDestroy = postIds =>
  axios.delete(bulkDestroyMyPostsUrl(), {
    params: { post_ids: postIds },
  });

const bulkStatusUpdate = (postIds, status) =>
  axios.patch(
    bulkStatusUpdateMyPostsUrl(),
    { post: { status } },
    { params: { post_ids: postIds } }
  );

const myPostsApi = {
  fetch,
  bulkDestroy,
  bulkStatusUpdate,
};

export default myPostsApi;
