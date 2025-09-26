import axios from "axios";

const login = payload => axios.post("/session", payload);

const signup = payload =>
  axios.post("/users", {
    user: payload,
  });

const logout = () => axios.delete(`/session`);

const authApi = {
  login,
  signup,
  logout,
};

export default authApi;
