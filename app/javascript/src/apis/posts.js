import axios from "axios";

const fetch = selectedCategories =>
  axios.get("/posts", {
    params: { categories: selectedCategories },
  });

const create = payload =>
  axios.post("/posts", {
    post: {
      ...payload,
      category_ids: payload.selectedCategories.map(option => option.value),
    },
  });

const show = slug => axios.get(`/posts/${slug}`);

const postsApi = { fetch, create, show };

export default postsApi;
