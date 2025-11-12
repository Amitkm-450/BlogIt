import axios from "axios";

import endPoints from "../endPoints";
import { buildUrl } from "../utils/url";

const fetch = params =>
  axios.get(endPoints.posts.root, {
    params,
  });

const create = payload => axios.post(endPoints.posts.root, { post: payload });

const show = slug => axios.get(buildUrl(endPoints.posts.show, { slug }));

const update = ({ slug, payload, quiet = false }) => {
  const path = buildUrl(endPoints.posts.show, { slug });
  const updatePath = quiet ? `${path}?quiet` : path;

  return axios.patch(updatePath, { post: payload });
};

const destroy = slug => axios.delete(buildUrl(endPoints.posts.show, { slug }));

const generatePdf = slug =>
  axios.post(buildUrl(endPoints.posts.report, { slug }), {});

const download = slug =>
  axios.get(buildUrl(endPoints.posts.reportDownload, { slug }), {
    responseType: "blob",
  });

const postsApi = {
  fetch,
  create,
  show,
  update,
  destroy,
  generatePdf,
  download,
};

export default postsApi;
