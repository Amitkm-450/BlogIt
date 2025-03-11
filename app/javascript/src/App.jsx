import React from "react";

import { either, isEmpty, isNil } from "ramda";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { Login, Signup } from "components/Authentication";
import { PrivateRoute } from "components/commons";

import BlogPage from "./components/Blogs";
import PostForm from "./components/Post/PostForms";
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
        <Route exact path="/posts/create" render={() => <PostForm />} />
        <Route exact path="/about" render={() => <div>About</div>} />
        <Route exact component={Signup} path="/signup" />
        <Route exact component={Login} path="/login" />
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
