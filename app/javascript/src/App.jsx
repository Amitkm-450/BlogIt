import React from "react";

import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";

import Home from "./components/Home";
import CreatePost from "./components/Post/Create";

const App = () => (
  <Router>
    <Switch>
      <Route exact component={CreatePost} path="/posts/new" />
      <Route exact component={Home} path="/posts" />
      <Route exact path="/about" render={() => <div>About</div>} />
      <Redirect exact from="/" to="/posts" />
    </Switch>
  </Router>
);

export default App;
