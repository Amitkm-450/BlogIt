import axios from "axios";

import endPoints from "../endPoints";

const login = payload => axios.post(endPoints.sessions, { login: payload });

const signup = payload =>
  axios.post(endPoints.users, {
    user: payload,
  });

const logout = () => axios.delete(endPoints.sessions);

const authApi = {
  login,
  signup,
  logout,
};

export default authApi;
