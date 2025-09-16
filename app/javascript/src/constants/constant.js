import * as yup from "yup";

export const DEFAULT_ERROR_NOTIFICATION = "Something went wrong!";

export const PostValidationSchema = yup.object().shape({
  title: yup
    .string()
    .max(125, "Title must be at most 125 characters")
    .required("Title is required"),
  description: yup
    .string()
    .max(10000, "Description must be at most 10000 characters")
    .required("Description is required"),
  categories: yup.array().required("Category is required"),
});

export const PostInitialData = {
  title: "",
  description: "",
  categories: [],
};
