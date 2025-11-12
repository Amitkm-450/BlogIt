import axios from "axios";

import {
  postsUrl,
  postUrl,
  postReportUrl,
  postReportDownloadUrl,
} from "../endPoints";

const fetch = params => axios.get(postsUrl(), { params });

const create = payload => axios.post(postsUrl(), { post: payload });

const show = slug => axios.get(postUrl(slug));

const update = ({ slug, payload, quiet = false }) => {
  const url = postUrl(slug) + (quiet ? "?quiet" : "");

  return axios.patch(url, { post: payload });
};

const destroy = slug => axios.delete(postUrl(slug));

const generatePdf = slug => axios.post(postReportUrl(slug), {});

const downloadPdf = slug =>
  axios.get(postReportDownloadUrl(slug), { responseType: "blob" });

const postsApi = {
  fetch,
  create,
  show,
  update,
  destroy,
  generatePdf,
  download: downloadPdf,
};

export default postsApi;
