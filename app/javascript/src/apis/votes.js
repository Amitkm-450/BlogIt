import axios from "axios";

import endPoints from "../endPoints";

const create = (params, payload) =>
  axios.post(endPoints.votes, payload, { params });

const fetch = params => axios.get(endPoints.votes, { params });

const votesApi = { create, fetch };

export default votesApi;
