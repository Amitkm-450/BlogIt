import axios from "axios";

const fetch = payload =>
  axios.get("/posts", {
    params: { category_ids: payload.selectedCategories },
  });

const create = payload =>
  axios.post("/posts", {
    post: {
      ...payload,
      category_ids: payload.selectedCategories?.map(option => option.value),
      status: payload.postStatus,
    },
  });

const update = (slug, payload) =>
  axios.put(`/posts/${slug}`, {
    post: {
      payload,
      category_ids: payload.selectedCategories?.map(option => option.value),
      status: payload.postStatus,
    },
  });

const show = slug => axios.get(`/posts/${slug}`);

const destroy = slug => axios.delete(`/posts/${slug}`);

const postsApi = { fetch, create, show, update, destroy };

export default postsApi;
