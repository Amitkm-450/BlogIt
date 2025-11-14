const routes = {
  root: "/",
  signup: "/signup",
  login: "/login",

  posts: {
    root: "/posts",
    new: "/posts/new",
    myBlogs: "/posts/my-blogs",
    show: "/posts/:slug/show",
    edit: "/posts/:slug/edit",
    preview: "/posts/:slug/preview",
  },

  notFound: "/*",
};

export default routes;
