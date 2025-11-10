import React from "react";

import LoginForm from "components/Authentication/Form/Login";
import { useLogin } from "hooks/reactQuery/useUsersApi";
import { useHistory } from "react-router-dom";
import routes from "routes";
import { getFromLocalStorage } from "utils/storage";

const Login = () => {
  const history = useHistory();

  const userId = getFromLocalStorage("authUserId");
  if (userId) {
    history.push(routes.posts.root);
  }

  const { mutate: login } = useLogin();

  const handleSubmit = values => {
    login(values, {
      onSuccess: () => {
        window.location.href = routes.posts.root;
      },
    });
  };

  return <LoginForm {...{ handleSubmit }} />;
};

export default Login;
