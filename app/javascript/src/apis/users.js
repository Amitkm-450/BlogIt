import axios from "axios";

const show = () => axios.get("/users/show");

export const usersApi = { show };
