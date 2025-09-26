import React from "react";

import LoginForm from "components/Authentication/Form/Login";
import { useHistory } from "react-router-dom";

import { useLogin } from "../../hooks/reactQuery/useUsersApi";

const Login = () => {
  const history = useHistory();

  const { mutate: login } = useLogin();

  const handleSubmit = values => {
    login(values, {
      onSuccess: () => {
        history.push("/");
      },
    });
  };

  return <LoginForm {...{ handleSubmit }} />;
};

export default Login;
