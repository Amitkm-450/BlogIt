import axios from "axios";

const fetch = () => axios.get("/posts");

const create = payload => axios.post("/posts", payload);

const postsApi = { fetch, create };

export default postsApi;
