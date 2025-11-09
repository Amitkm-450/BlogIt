import * as yup from "yup";

export const DEFAULT_ERROR_NOTIFICATION = "Something went wrong!";

export const POST_VALIDATION_SCHEMA = yup.object().shape({
  title: yup
    .string()
    .max(125, "Title must be at most 125 characters")
    .required("Title is required"),
  description: yup
    .string()
    .max(10000, "Description must be at most 10000 characters")
    .required("Description is required"),
  categories: yup
    .array()
    .min(1, "Category is required")
    .required("Category is required"),
});

export const getPostInitialData = (post = {}) => ({
  title: post.title || "",
  description: post.description || "",
  categories:
    post.categories?.map(category => ({
      name: category.name,
      id: category.id,
    })) || [],
});

export const getFilterInitialValues = ({
  searchTerm,
  selectedCategories,
  status,
} = {}) => ({
  title: searchTerm || "",
  categories: selectedCategories || [],
  status: status || {},
});

export const FILTER_VALIDATION_SCHEMA = yup.object().shape({
  title: yup.string().max(100, "Title cannot exceed 100 characters"),
  categories: yup.array(),
  status: yup
    .object({
      label: yup.string(),
      value: yup.string().oneOf(["draft", "published"]),
    })
    .nullable(),
});

export const CATEGORY_INITIAL_DATA = {
  name: "",
};

export const CATEGORY_VALIDATION_SCHEMA = yup.object().shape({
  name: yup
    .string()
    .trim()
    .max(50, "Category name must be at most 50 characters")
    .required("Category name is required"),
});
