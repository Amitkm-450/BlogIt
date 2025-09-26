import React from "react";

import { Button, Typography } from "@bigbinary/neetoui";
import { Form, Input } from "@bigbinary/neetoui/formik";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";

import { LoginInitialData, LoginValidationSchema } from "../constant";

const Login = ({ handleSubmit }) => {
  const history = useHistory();

  const handleFormSubmit = async values => {
    await handleSubmit(values);
    history.push("/");
  };

  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Typography className="mt-6 text-center text-3xl font-extrabold leading-9 text-gray-700">
          {t("login.header")}
        </Typography>
        <div className="text-center">
          <Link
            className="mt-2 text-sm font-medium text-indigo-500 transition duration-150 ease-in-out focus:underline focus:outline-none"
            to="/signup"
          >
            {t("login.link")}
          </Link>
        </div>
        <Form
          className="mt-8 flex flex-col gap-y-6"
          formikProps={{
            validateOnBlur: true,
            enableReinitialize: true,
            initialValues: LoginInitialData,
            validationSchema: LoginValidationSchema,
            onSubmit: handleFormSubmit,
          }}
        >
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
          <Button label={t("login.button.submit")} type="submit" />
        </Form>
      </div>
    </div>
  );
};

export default Login;
