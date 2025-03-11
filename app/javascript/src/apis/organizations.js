import axios from "axios";

const fetch = () => axios.get("/organizations");

const organizationsApi = { fetch };

export default organizationsApi;
