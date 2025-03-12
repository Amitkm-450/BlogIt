import axios from "axios";

const fetch = () => axios.get("/categories");

const create = payload =>
  axios.post("/categories", {
    category: payload,
  });

const show = name => axios.show(`/categories/${name}`);

const categoriesApi = { fetch, create, show };

export default categoriesApi;
