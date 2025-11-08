import axios from "axios";

import endPoints from "../endPoints";
import { buildUrl } from "../utils/url";

const fetch = ({ params, scope = "organization" }) =>
  axios.get(endPoints.posts.root, {
    params: {
      ...params,
      scope,
    },
  });

const create = payload => axios.post(endPoints.posts.root, { post: payload });

const show = slug => axios.get(buildUrl(endPoints.posts.show, { slug }));

const update = ({ slug, payload, quiet = false }) => {
  const path = buildUrl(endPoints.posts.show, { slug, quiet });

  return axios.patch(path, { post: payload });
};

const destroy = slug => axios.delete(buildUrl(endPoints.posts.show, { slug }));

const bulkDestroy = postIds =>
  axios.delete(endPoints.posts.bulkDestroy, { params: { post_ids: postIds } });

const bulkStatusUpdate = (postIds, status) =>
  axios.patch(
    endPoints.posts.bulkStatusUpdate,
    { post: { status } },
    { params: { post_ids: postIds } }
  );

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
  bulkDestroy,
  bulkStatusUpdate,
  generatePdf,
  download,
};

export default postsApi;
