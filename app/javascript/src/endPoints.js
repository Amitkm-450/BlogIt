const endPoints = {
  sessions: "/session",
  users: "/users",
  categories: "/categories",
  posts: {
    root: "/posts",
    show: "/posts/:slug",
    report: "/posts/:slug/report",
    reportDownload: "/posts/:slug/report/download",
    votes: {
      root: "/posts/:postSlug/votes",
      show: "/posts/:postSlug/votes/:id",
    },
  },
  myPosts: {
    root: "/my_posts",
    bulkDestroy: "/my_posts/bulk_destroy",
    bulkStatusUpdate: "/my_posts/bulk_status_update",
  },
};

export default endPoints;
