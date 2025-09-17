import React from "react";

import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";

import Signup from "./components/Authentication/Signup";
import Home from "./components/Home";
import CreatePost from "./components/Post/Create";
import ShowPost from "./components/Post/Show";

const App = () => (
  <Router>
    <Switch>
      <Route exact component={Signup} path="/signup" />
      <Route exact component={Home} path="/posts" />
      <Route exact component={CreatePost} path="/posts/new" />
      <Route exact component={ShowPost} path="/posts/:slug" />
      <Route exact path="/about" render={() => <div>About</div>} />
      <Redirect exact from="/" to="/posts" />
    </Switch>
  </Router>
);

export default App;
