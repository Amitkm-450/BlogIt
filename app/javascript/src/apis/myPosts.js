import axios from "axios";

import endPoints from "../endPoints";

const fetch = params => axios.get(endPoints.myPosts.root, { params });

const bulkDestroy = postIds =>
  axios.delete(endPoints.myPosts.bulkDestroy, {
    params: { post_ids: postIds },
  });

const bulkStatusUpdate = (postIds, status) =>
  axios.patch(
    endPoints.myPosts.bulkStatusUpdate,
    { post: { status } },
    { params: { post_ids: postIds } }
  );

const myPostsApi = {
  fetch,
  bulkDestroy,
  bulkStatusUpdate,
};

export default myPostsApi;
