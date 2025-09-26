import React from "react";

import LoginForm from "components/Authentication/Form/Login";
import { useLogin } from "hooks/reactQuery/useUsersApi";
import Logger from "js-logger";

const Login = () => {
  const { mutate: login } = useLogin();

  const handleSubmit = values => {
    login(values, {
      onSuccess: async () => {
        Logger.log("onSuccess per call 1");
        await new Promise(r => setTimeout(r, 0));
        window.location.href = "/posts";
        Logger.log("onSuccess per call 2");
      },
    });
  };

  return <LoginForm {...{ handleSubmit }} />;
};

export default Login;
