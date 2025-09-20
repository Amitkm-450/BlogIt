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

export const FilterInitialValues = {
  title: "",
  categories: [],
  status: [],
};

export const FilterValidationSchema = yup.object().shape({
  title: yup.string().max(100, "Title cannot exceed 100 characters"),
  categories: yup.array(),
  status: yup
    .object({
      label: yup.string(),
      value: yup.string().oneOf(["draft", "published"]),
    })
    .nullable(),
});
