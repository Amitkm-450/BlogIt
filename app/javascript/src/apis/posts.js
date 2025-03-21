import axios from "axios";

const fetch = payload => {
  const path = payload?.self ? `/posts?self=true` : `/posts`;
  // logger.log(payload);

  return axios.get(path, {
    params: {
      category_ids: payload.selectedCategories,
      title: payload?.title,
      status: payload?.postStatus,
    },
  });
};

const create = payload => {
  logger.log(payload);

  return axios.post("/posts", {
    post: {
      ...payload,
      category_ids: payload.selectedCategories?.map(option => option.value),
      status: payload.postStatus,
    },
  });
};

const update = (slug, payload) =>
  axios.put(`/posts/${slug}`, {
    post: {
      ...payload,
      category_ids: payload.selectedCategories?.map(option => option.value),
      status: payload.postStatus,
    },
  });

const show = slug => axios.get(`/posts/${slug}`);

const destroy = slug => axios.delete(`/posts/${slug}`);

const bulkDelete = postSlugs =>
  axios.delete("/posts/bulk_delete", {
    params: { post_slugs: postSlugs },
  });

const bulkUpdateStatus = (postSlugs, status) =>
  // logger.log(postSlugs, "Inside postsApi");

  axios.patch("/posts/bulk_update_status", {
    params: { post_slugs: postSlugs, status },
  });

const generatePdf = slug => {
  logger.log("Inside generate");

  return axios.post(`/posts/${slug}/report`, {});
};

const download = slug => {
  logger.log("Inside download");

  return axios.get(`/posts/${slug}/report/download`, { responseType: "blob" });
};

const postsApi = {
  fetch,
  create,
  show,
  update,
  destroy,
  bulkDelete,
  bulkUpdateStatus,
  generatePdf,
  download,
};

export default postsApi;
