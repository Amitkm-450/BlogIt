import React from "react";

import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

import BlogPage from "./components/Blogs";

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" render={() => <BlogPage />} />
      <Route exact path="/about" render={() => <div>About</div>} />
    </Switch>
  </Router>
);

export default App;
