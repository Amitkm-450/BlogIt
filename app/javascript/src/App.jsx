import React from "react";

import { either, isEmpty, isNil } from "ramda";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import { getFromLocalStorage } from "utils/storage";

import { Login, Signup } from "./components/Authentication";
import UserBlogs from "./components/Blogs";
import { PrivateRoute } from "./components/commons";
import Home from "./components/Home";
import { Edit as PostEdit, Create as CreatePost } from "./components/Post/Form";
import ShowPost from "./components/Post/Show";

const App = () => {
  const authToken = getFromLocalStorage("authToken");
  const isLoggedIn = !either(isNil, isEmpty)(authToken);

  return (
    <Router>
      <Switch>
        <Route exact component={Signup} path="/signup" />
        <Route exact component={Login} path="/login" />
        <PrivateRoute
          exact
          component={CreatePost}
          condition={isLoggedIn}
          path="/posts/new"
          redirectRoute="/login"
        />
        <PrivateRoute
          exact
          component={UserBlogs}
          condition={isLoggedIn}
          path="/posts/my-blogs"
          redirectRoute="/login"
        />
        <PrivateRoute
          exact
          component={PostEdit}
          condition={isLoggedIn}
          path="/posts/:slug/edit"
          redirectRoute="/login"
        />
        <PrivateRoute
          exact
          component={ShowPost}
          condition={isLoggedIn}
          path="/posts/:slug"
          redirectRoute="/login"
        />
        <PrivateRoute
          exact
          component={Home}
          condition={isLoggedIn}
          path="/posts"
          redirectRoute="/login"
        />
        <Redirect exact from="/" to="/posts" />
      </Switch>
    </Router>
  );
};

export default App;
