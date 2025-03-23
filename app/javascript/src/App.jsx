import React from "react";

import { either, isEmpty, isNil } from "ramda";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { Login, Signup } from "components/Authentication";
import { PrivateRoute } from "components/commons";

import BlogPage from "./components/Blogs";
import MyPosts from "./components/Blogs/MyBlogs";
import EditPost from "./components/Post/EditPost";
import PostForm from "./components/Post/PostForms";
import PreviewPost from "./components/Post/PreviewPost";
import PostShow from "./components/Post/Show";
import { getFromLocalStorage } from "./utils/storage";

const App = () => {
  const authToken = getFromLocalStorage("authToken");
  const isLoggedIn = !either(isNil, isEmpty)(authToken);

  return (
    <Router>
      <ToastContainer />
      <Switch>
        <Route exact component={PostShow} path="/posts/:slug/show" />
        <Route exact component={EditPost} path="/posts/:slug/edit" />
        <Route exact component={PreviewPost} path="/posts/:slug/preview" />
        <Route exact path="/posts/create" render={() => <PostForm />} />
        <Route exact component={Signup} path="/signup" />
        <Route exact component={Login} path="/login" />
        <Route exact component={MyPosts} path="/posts/my-blogs" />
        <PrivateRoute
          component={BlogPage}
          condition={isLoggedIn}
          path="/"
          redirectRoute="/login"
        />
      </Switch>
    </Router>
  );
};

export default App;
