import i18n from "common/i18n";
import * as yup from "yup";

export const DEFAULT_ERROR_NOTIFICATION = i18n.t("globalError");

export const POST_VALIDATION_SCHEMA = yup.object().shape({
  title: yup
    .string()
    .max(125, i18n.t("validations.title.max"))
    .required(i18n.t("validations.title.required")),
  description: yup
    .string()
    .max(10000, i18n.t("validations.description.max"))
    .required(i18n.t("validations.description.required")),
  categories: yup
    .array()
    .min(1, i18n.t("validations.category.required"))
    .required(i18n.t("validations.category.required")),
});

export const getPostInitialData = (post = {}) => {
  const { title, description, categories } = post;

  return {
    title: title || "",
    description: description || "",
    categories:
      categories?.map(({ name, id }) => ({
        name,
        id,
      })) || [],
  };
};

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
  title: yup.string().max(100, i18n.t("validations.title.filterMax")),
  categories: yup.array(),
  status: yup
    .object({
      label: yup.string(),
      value: yup.string().oneOf(["draft", "published"]),
    })
    .nullable(),
});

export const CATEGORY_INITIAL_VALUES = {
  name: "",
};

export const CATEGORY_VALIDATION_SCHEMA = yup.object().shape({
  name: yup
    .string()
    .trim()
    .max(50, i18n.t("validations.category.max"))
    .required(i18n.t("validations.category.required")),
});
