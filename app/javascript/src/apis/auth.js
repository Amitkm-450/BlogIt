import axios from "axios";

import { sessionUrl, usersUrl } from "../endPoints";

const login = payload => axios.post(sessionUrl(), { login: payload });

const signup = payload => axios.post(usersUrl(), { user: payload });

const logout = () => axios.delete(sessionUrl());

const authApi = {
  login,
  signup,
  logout,
};

export default authApi;
