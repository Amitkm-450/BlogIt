import React from "react";

import { either, isEmpty, isNil } from "ramda";
import { QueryClientProvider } from "react-query";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { getFromLocalStorage } from "utils/storage";

import { Login, Signup } from "./components/Authentication";
import UserBlogs from "./components/Blogs";
import { PageNotFound, PrivateRoute } from "./components/commons";
import Home from "./components/Home";
import {
  Edit as EditPost,
  Create as CreatePost,
  Preview as PostReview,
} from "./components/Post/Form";
import ShowPost from "./components/Post/Show";
import routes from "./routes";
import queryClient from "./utils/queryClient";

const App = () => {
  const authToken = getFromLocalStorage("authToken");
  const isLoggedIn = !either(isNil, isEmpty)(authToken);

  const privateRoutes = [
    { path: routes.posts.new, component: CreatePost },
    { path: routes.posts.myBlogs, component: UserBlogs },
    { path: routes.posts.edit, component: EditPost },
    { path: routes.posts.preview, component: PostReview },
    { path: routes.posts.show, component: ShowPost },
    { path: routes.posts.root, component: Home },
  ];

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <Switch>
          <Route exact component={Signup} path={routes.signup} />
          <Route exact component={Login} path={routes.login} />
          {privateRoutes.map(({ path, component: Component }) => (
            <PrivateRoute
              exact
              component={Component}
              condition={isLoggedIn}
              key={path}
              path={path}
              redirectRoute={routes.login}
            />
          ))}
          <Redirect exact from={routes.root} to={routes.posts.root} />
          <Route component={PageNotFound} path={routes.notFound} />
        </Switch>
      </QueryClientProvider>
    </Router>
  );
};

export default App;
