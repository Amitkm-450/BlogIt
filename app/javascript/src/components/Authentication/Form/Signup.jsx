import React from "react";

import { Typography } from "neetoui";
import { Form, Input, Button } from "neetoui/formik";
import { Link } from "react-router-dom";
import routes from "routes";
import withT from "utils/withT";

import { SIGNUP_INITIAL_VALUES, SIGNUP_VALIDATION_SCHEMA } from "../constants";

const Signup = ({ handleSubmit, t }) => (
  <div
    className="flex min-h-screen items-center justify-center bg-gray-50
    px-4 py-12 sm:px-6 lg:px-8 "
  >
    <div className="w-full max-w-md">
      <Typography
        className="mt-6 text-center text-3xl font-extrabold
        leading-9 text-gray-700"
      >
        {t("signup.header")}
      </Typography>
      <div className="text-center">
        <Link
          to={routes.login}
          className="text-bb-purple mt-2 text-center text-sm
            font-medium transition duration-150 ease-in-out
            focus:underline focus:outline-none"
        >
          {t("signup.link")}
        </Link>
      </div>
      <Form
        className="mt-8 flex flex-col gap-y-6"
        formikProps={{
          initialValues: SIGNUP_INITIAL_VALUES,
          validationSchema: SIGNUP_VALIDATION_SCHEMA,
          onSubmit: handleSubmit,
        }}
      >
        <div className="flex flex-col gap-2">
          <Input
            label={t("signup.form.label.name")}
            name="name"
            placeholder={t("signup.form.placeholder.name")}
          />
          <Input
            label={t("signup.form.label.email")}
            name="email"
            placeholder={t("signup.form.placeholder.email")}
          />
          <Input
            label={t("signup.form.label.password")}
            name="password"
            placeholder={t("signup.form.placeholder.password")}
            type="password"
          />
          <Input
            label={t("signup.form.label.passwordConfirmation")}
            name="password_confirmation"
            placeholder={t("signup.form.placeholder.passwordConfirmation")}
            type="password"
          />
          <Button
            className="auth-button"
            label={t("signup.button.register")}
            type="submit"
          />
        </div>
      </Form>
    </div>
  </div>
);

export default withT(Signup);
