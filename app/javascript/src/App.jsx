import React from "react";

import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import BlogPage from "./components/Blogs";
import PostForm from "./components/Post/PostForms";
import PostShow from "./components/Post/Show";

const App = () => (
  <Router>
    <ToastContainer />
    <Switch>
      <Route exact component={PostShow} path="/posts/:slug/show" />
      <Route exact path="/posts/create" render={() => <PostForm />} />
      <Route exact path="/" render={() => <BlogPage />} />
      {/* <Redirect exact from="/" to="/posts" /> */}
      <Route exact path="/about" render={() => <div>About</div>} />
    </Switch>
  </Router>
);

export default App;
