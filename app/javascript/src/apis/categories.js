import axios from "axios";

const fetch = () => axios.get("/categories");

const create = payload => axios.post("/categories", payload);

const categoriesApi = { fetch, create };

export default categoriesApi;
