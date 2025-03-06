import React from "react";

import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

import BlogPage from "./components/Blogs";
import PostForm from "./components/commons/PostForms";

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/posts/create" render={() => <PostForm />} />
      <Route exact path="/" render={() => <BlogPage />} />
      {/* <Redirect exact from="/" to="/posts" /> */}
      <Route exact path="/about" render={() => <div>About</div>} />
    </Switch>
  </Router>
);

export default App;
