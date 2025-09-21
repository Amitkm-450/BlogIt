import React, { useState } from "react";

import authApi from "apis/auth";
import { setAuthHeaders } from "apis/axios";
import LoginForm from "components/Authentication/Form/Login";
import { useHistory } from "react-router-dom";
import { setToLocalStorage } from "utils/storage";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const handleSubmit = async values => {
    setLoading(true);
    try {
      const user = await authApi.login(values);
      setToLocalStorage({
        authToken: user.authentication_token,
        email: values.email.toLowerCase(),
        userId: user.id,
        userName: user.name,
      });
      setAuthHeaders();
      setTimeout(() => {
        history.push("/");
      }, 750);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm {...{ handleSubmit, loading }} />;
};

export default Login;
