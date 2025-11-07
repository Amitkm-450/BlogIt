import React from "react";

import SignupForm from "components/Authentication/Form/Signup";
import { useSignup } from "hooks/reactQuery/useUsersApi";

const Signup = ({ history }) => {
  const { mutate: signupUser } = useSignup();

  const handleSubmit = values => {
    signupUser(values, {
      onSuccess: () => {
        history.push("/login");
      },
    });
  };

  return <SignupForm {...{ handleSubmit }} />;
};

export default Signup;
