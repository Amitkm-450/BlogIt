import React from "react";

import LoginForm from "components/Authentication/Form/Login";
import { useLogin } from "hooks/reactQuery/useUsersApi";
import Logger from "js-logger";
import { useHistory } from "react-router-dom";

const Login = () => {
  const history = useHistory();

  const { mutate: login } = useLogin();

  const handleSubmit = values => {
    login(values, {
      onSuccess: () => {
        Logger.log("onSuccess per call 1");
        history.push("/");
        Logger.log("onSuccess per call 2");
      },
    });
  };

  return <LoginForm {...{ handleSubmit }} />;
};

export default Login;
