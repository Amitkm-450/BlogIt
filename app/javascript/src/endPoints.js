const endPoints = {
  sessions: "/session",
  users: "/users",
  categories: "/categories",
  votes: "/votes",
  posts: {
    root: "/posts",
    show: "/posts/:slug",
    bulkDestroy: "/posts/bulk_destroy",
    bulkStatusUpdate: "/posts/bulk_status_update",
    report: "/posts/:slug/report",
    reportDownload: "/posts/:slug/report/download",
  },
};

export default endPoints;
