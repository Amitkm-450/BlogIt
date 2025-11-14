import React from "react";

import { Typography } from "neetoui";
import { Form, Input, Button } from "neetoui/formik";
import { Link } from "react-router-dom";
import routes from "routes";
import withT from "utils/withT";

import { LOGIN_INITIAL_VALUES, LOGIN_VALIDATION_SCHEMA } from "../constants";

const Login = ({ handleSubmit, t }) => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
    <div className="w-full max-w-md">
      <Typography className="mt-6 text-center text-3xl font-extrabold leading-9 text-gray-700">
        {t("login.header")}
      </Typography>
      <div className="text-center">
        <Link
          className="mt-2 text-sm font-medium text-indigo-500 transition duration-150 ease-in-out focus:underline focus:outline-none"
          to={routes.signup}
        >
          {t("login.link")}
        </Link>
      </div>
      <Form
        className="mt-8 flex flex-col gap-y-6"
        formikProps={{
          validateOnBlur: true,
          enableReinitialize: true,
          initialValues: LOGIN_INITIAL_VALUES,
          validationSchema: LOGIN_VALIDATION_SCHEMA,
          onSubmit: handleSubmit,
        }}
      >
        <div className="flex flex-col gap-2">
          <Input
            label={t("login.form.label.email")}
            name="email"
            placeholder={t("login.form.placeholder.email")}
            type="email"
          />
          <Input
            label={t("login.form.label.password")}
            name="password"
            placeholder={t("login.form.placeholder.password")}
            type="password"
          />
          <Button
            className="auth-button"
            label={t("login.button.submit")}
            type="submit"
          />
        </div>
      </Form>
    </div>
  </div>
);

export default withT(Login);
