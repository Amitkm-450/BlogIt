import axios from "axios";

const fetch = params =>
  axios.get("/posts", {
    params,
  });

const create = payload => axios.post("/posts", payload);

const show = slug => axios.get(`/posts/${slug}`);

const update = ({ slug, payload, quiet = false }) => {
  const path = quiet ? `/posts/${slug}?quiet` : `/posts/${slug}`;

  return axios.patch(path, payload);
};

const destroy = slug => axios.delete(`/posts/${slug}`);

const bulkDestroy = postIds =>
  axios.delete("/posts/bulk_destroy", { params: { post_ids: postIds } });

const bulkStatusUpdate = (postIds, status) =>
  axios.patch(
    "/posts/bulk_status_update",
    { post: { status } },
    { params: { post_ids: postIds } }
  );

const postsApi = {
  fetch,
  create,
  show,
  update,
  destroy,
  bulkDestroy,
  bulkStatusUpdate,
};

export default postsApi;
