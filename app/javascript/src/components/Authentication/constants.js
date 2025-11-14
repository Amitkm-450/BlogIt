import i18n from "common/i18n";
import * as yup from "yup";

export const SIGNUP_INITIAL_VALUES = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

export const SIGNUP_VALIDATION_SCHEMA = yup.object().shape({
  name: yup
    .string()
    .required(i18n.t("validations.name.required"))
    .min(2, i18n.t("validations.name.min")),
  email: yup
    .string()
    .required(i18n.t("validations.email.required"))
    .email(i18n.t("validations.email.valid")),
  password: yup
    .string()
    .required(i18n.t("validations.password.required"))
    .min(6, i18n.t("validations.password.min")),
  password_confirmation: yup
    .string()
    .required(i18n.t("validations.passwordConfirmation.required"))
    .oneOf(
      [yup.ref("password"), null],
      i18n.t("validations.passwordConfirmation.match")
    ),
});

export const LOGIN_INITIAL_VALUES = {
  email: "",
  password: "",
};

export const LOGIN_VALIDATION_SCHEMA = yup.object().shape({
  email: yup
    .string()
    .required(i18n.t("validations.email.required"))
    .email(i18n.t("validations.email.valid")),
  password: yup.string().required(i18n.t("validations.password.required")),
});
