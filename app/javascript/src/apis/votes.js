import axios from "axios";

// params = { post_id: 1 }
// payload = { vote: { value: 1 } }
const create = (params, payload) => axios.post("/votes", payload, { params });

const fetch = params => axios.get("/votes", { params });

const votesApi = { create, fetch };

export default votesApi;
