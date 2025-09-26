import React, { useState } from "react";

import authApi from "apis/auth";
import SignupForm from "components/Authentication/Form/Signup";

const Signup = ({ history }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async values => {
    setLoading(true);
    try {
      await authApi.signup(values);
      history.push("/");
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  return <SignupForm {...{ loading, handleSubmit }} />;
};

export default Signup;
