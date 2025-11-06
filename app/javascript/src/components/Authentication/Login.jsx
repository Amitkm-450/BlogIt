import React from "react";

import LoginForm from "components/Authentication/Form/Login";
import { useLogin } from "hooks/reactQuery/useUsersApi";

const Login = () => {
  const { mutate: login } = useLogin();

  const handleSubmit = values => {
    login(values, {
      onSuccess: () => {
        window.location.href = "/posts";
      },
    });
  };

  return <LoginForm {...{ handleSubmit }} />;
};

export default Login;
