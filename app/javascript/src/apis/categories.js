import axios from "axios";

import endPoints from "../endPoints";

const fetch = () => axios.get(endPoints.categories);

const create = payload => axios.post(endPoints.categories, payload);

const categoriesApi = { fetch, create };

export default categoriesApi;
