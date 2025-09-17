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
import { PrivateRoute } from "./components/commons";
import Home from "./components/Home";
import CreatePost from "./components/Post/Create";
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
          component={Home}
          condition={isLoggedIn}
          path="/"
          redirectRoute="/login"
        />
        <Route exact component={Home} path="/posts" />
        <Route exact component={CreatePost} path="/posts/new" />
        <Route exact component={ShowPost} path="/posts/:slug" />
        <Route exact path="/about" render={() => <div>About</div>} />
        <Redirect exact from="/" to="/posts" />
      </Switch>
    </Router>
  );
};

export default App;
