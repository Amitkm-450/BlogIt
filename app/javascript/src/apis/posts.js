import axios from "axios";

const fetch = () => axios.get("/posts");

const create = payload => axios.post("/posts", payload);

const show = slug => axios.get(`/posts/${slug}`);

const update = ({ slug, payload, quiet = false }) => {
  const path = quiet ? `/posts/${slug}?quiet` : `/posts/${slug}`;

  return axios.patch(path, payload);
};

const postsApi = { fetch, create, show, update };

export default postsApi;
