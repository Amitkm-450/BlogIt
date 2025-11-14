import { filterNonNull, keysToSnakeCase, isNotEmpty } from "neetocist";
import { stringify } from "qs";
import { isEmpty, toPairs, pipe, omit, isNotNil, pluck } from "ramda";

export const buildUrl = (route, params) => {
  const placeHolders = [];
  toPairs(params).forEach(([key, value]) => {
    if (route.includes(`:${key}`)) {
      placeHolders.push(key);
      route = route.replace(`:${key}`, encodeURIComponent(value));
    }
  });

  const queryParams = pipe(
    omit(placeHolders),
    keysToSnakeCase,
    stringify
  )(params);

  return isEmpty(queryParams) ? route : `${route}?${queryParams}`;
};

export const buildFilterParams = ({ title, categories = [], status }) => {
  const params = {};

  if (title?.trim()) {
    params.searchTerm = title.trim();
  }

  if (isNotEmpty(categories)) {
    params.categories = pluck("name", categories).join(",");
  }

  if (status) {
    params.status = status;
  }

  return params;
};

export const handleFilterRemove = ({
  key,
  valueToRemove = null,
  filters,
  page,
  history,
  route,
}) => {
  const updatedFilters = { ...filters, page };
  const { categories } = filters;

  if (key === "categories") {
    const filteredCategories = categories.filter(
      category => category !== valueToRemove
    );

    updatedFilters.categories = isNotEmpty(filteredCategories)
      ? filteredCategories.join(",")
      : null;
  } else {
    updatedFilters[key] = null;

    updatedFilters.categories =
      isNotNil(categories) && isNotEmpty(categories)
        ? categories.join(",")
        : null;
  }

  const url = buildUrl(route, filterNonNull(updatedFilters));
  history.replace(url);
};
