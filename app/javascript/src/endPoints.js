export const sessionUrl = () => "/session";
export const usersUrl = () => "/users";

export const categoriesUrl = () => "/categories";

export const postsUrl = () => "/posts";
export const postUrl = slug => `${postsUrl()}/${slug}`;
export const postReportUrl = slug => `${postUrl(slug)}/report`;
export const postReportDownloadUrl = slug => `${postReportUrl(slug)}/download`;

export const postVotesUrl = postSlug => `${postUrl(postSlug)}/votes`;
export const postVoteUrl = (postSlug, id) => `${postVotesUrl(postSlug)}/${id}`;

export const myPostsUrl = () => "/my_posts";
export const bulkDestroyMyPostsUrl = () => `${myPostsUrl()}/bulk_destroy`;
export const bulkStatusUpdateMyPostsUrl = () =>
  `${myPostsUrl()}/bulk_status_update`;
