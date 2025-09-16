import axios from "axios";

const fetch = () => axios.get("/categories");

const categoriesApi = { fetch };

export default categoriesApi;
