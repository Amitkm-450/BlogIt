import React from "react";

import SignupForm from "components/Authentication/Form/Signup";
import { useSignup } from "hooks/reactQuery/useUsersApi";
import routes from "routes";

const Signup = ({ history }) => {
  const { mutate: signupUser } = useSignup();

  const handleSubmit = (values, { setSubmitting }) => {
    signupUser(values, {
      onSuccess: () => {
        history.push(routes.login);
      },
      onSettled: () => {
        setSubmitting(false);
      },
    });
  };

  return <SignupForm {...{ handleSubmit }} />;
};

export default Signup;
