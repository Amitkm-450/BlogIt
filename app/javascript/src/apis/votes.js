import axios from "axios";

const create = (postId, voteType) =>
  axios.post(`/posts/${postId}/vote`, { vote_type: voteType });

export const votesApi = { create };
