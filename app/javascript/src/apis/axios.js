import { keysToCamelCase, keysToSnakeCase } from "@bigbinary/neeto-cist";
import { Toastr } from "@bigbinary/neetoui";
import axios from "axios";
import { setToLocalStorage, getFromLocalStorage } from "utils/storage";

import { DEFAULT_ERROR_NOTIFICATION } from "../constants/constant";

axios.defaults.baseURL = "/api/v1/";

const transformResponseKeysToCamelCase = response => {
  if (
    response.request?.responseType === "blob" ||
    response.data instanceof Blob
  ) {
    return;
  }

  if (response.data) response.data = keysToCamelCase(response.data);
};

const transformResponseKeysToSnakeCase = request => {
  if (request.data) request.data = keysToSnakeCase(request.data);
};

const setAuthHeaders = () => {
  axios.defaults.headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": document
      .querySelector('[name="csrf-token"]')
      .getAttribute("content"),
  };
  const token = getFromLocalStorage("authToken");
  const email = getFromLocalStorage("authEmail");
  if (token && email) {
    axios.defaults.headers["X-Auth-Email"] = email;
    axios.defaults.headers["X-Auth-Token"] = token;
  }
};

const handleSuccessResponse = response => {
  if (response) {
    response.success = response.status === 200;
    if (response.data.notice) {
      Toastr.success(response.data.notice);
    }
  }

  if (response.data instanceof Blob) {
    return response;
  }

  return response.data;
};

const handleErrorResponse = axiosErrorObject => {
  if (axiosErrorObject.response?.status === 401) {
    setToLocalStorage({ authToken: null, email: null, userId: null });
    setTimeout(() => (window.location.href = "/"), 2000);
  }

  Toastr.error(
    axiosErrorObject.response?.data?.error || DEFAULT_ERROR_NOTIFICATION
  );
  if (axiosErrorObject.response?.status === 423) {
    window.location.href = "/";
  }

  return Promise.reject(axiosErrorObject);
};

const registerIntercepts = () => {
  axios.interceptors.response.use(
    response => {
      transformResponseKeysToCamelCase(response);

      return handleSuccessResponse(response);
    },
    error => handleErrorResponse(error)
  );

  axios.interceptors.request.use(request => {
    transformResponseKeysToSnakeCase(request);

    return request;
  });
};

const resetAuthTokens = () => {
  delete axios.defaults.headers["X-Auth-Email"];
  delete axios.defaults.headers["X-Auth-Token"];
};

export { setAuthHeaders, registerIntercepts, resetAuthTokens };
