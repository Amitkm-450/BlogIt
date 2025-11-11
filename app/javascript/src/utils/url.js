import { filterNonNull, keysToSnakeCase } from "@bigbinary/neeto-cist";
import { stringify } from "qs";
import { isEmpty, toPairs, pipe, omit } from "ramda";

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

  if (categories.length > 0) {
    params.categories = categories.map(c => c.name).join(",");
  }

  if (status) {
    params.status = status;
  }

  return params;
};

export const handleFilterRemove = ({ key, filters, page, history, route }) => {
  const updatedFilters = {
    ...filters,
    page,
    [key]: null,
  };

  const url = buildUrl(route, filterNonNull(updatedFilters));
  history.replace(url);
};
