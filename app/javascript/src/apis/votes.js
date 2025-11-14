import axios from "axios";

import { postVotesUrl, postVoteUrl } from "../endPoints";

const fetch = postSlug => axios.get(postVotesUrl(postSlug));

const create = (postSlug, payload) =>
  axios.post(postVotesUrl(postSlug), { vote: payload });

const destroy = ({ postSlug, id }, payload) =>
  axios.delete(postVoteUrl(postSlug, id), {
    vote: payload,
  });

const votesApi = { create, fetch, destroy };

export default votesApi;
