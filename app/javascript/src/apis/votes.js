import axios from "axios";
import { buildUrl } from "utils/url";

import endPoints from "../endPoints";

const fetch = postSlug =>
  axios.get(buildUrl(endPoints.posts.votes.root, { postSlug }));

const create = (postSlug, payload) =>
  axios.post(buildUrl(endPoints.posts.votes.root, { postSlug }), {
    vote: payload,
  });

const destroy = (params, payload) =>
  axios.delete(buildUrl(endPoints.posts.votes.show, params), {
    vote: payload,
  });

const votesApi = { create, fetch, destroy };

export default votesApi;
