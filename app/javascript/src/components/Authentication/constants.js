import * as yup from "yup";

export const SIGNUP_INITIAL_DATA = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

export const SIGNUP_VALIDATION_SCHEMA = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters long"),
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  password_confirmation: yup
    .string()
    .required("Password confirmation is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export const LOGIN_INITIAL_DATA = {
  email: "",
  password: "",
};

export const LOGIN_VALIDATION_SCHEMA = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: yup.string().required("Password is required"),
});
