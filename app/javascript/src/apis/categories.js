import axios from "axios";

import { categoriesUrl } from "../endPoints";

const fetch = () => axios.get(categoriesUrl());

const create = payload => axios.post(categoriesUrl(), { category: payload });

const categoriesApi = {
  fetch,
  create,
};

export default categoriesApi;
