const endPoints = {
  sessions: "/session",
  users: "/users",
  categories: "/categories",
  posts: {
    root: "/posts",
    show: "/posts/:slug",
    bulkDestroy: "/posts/bulk_destroy",
    bulkStatusUpdate: "/posts/bulk_status_update",
    report: "/posts/:slug/report",
    reportDownload: "/posts/:slug/report/download",
    votes: {
      root: "/posts/:postSlug/votes",
      show: "/posts/:postSlug/votes/:id",
    },
  },
};

export default endPoints;
