import axios from "../utils/axiosInstance";

const userService = {
  login: async (credensial) => {
    const res = await axios.post("/login", credensial);
    return res.data;
  },
  register: async (payload) => {
    const res = await axios.post("/register", payload);
    return res.data;
  },
  getCustomer: async (search) => {
    const res = await axios.get(`/customer?${search}`);
    return res.data;
  },
  getAgent: async () => {
    const res = await axios.get("/agent");
    return res.data;
  },
  getMember: async (search) => {
    const res = await axios.get(`/member?${search}`);
    return res.data;
  },
  updateUser: async (id, payload) => {
    const res = await axios.put(`/users/${id}`, payload);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await axios.delete(`/users/${id}`);
    return res.data;
  },
  getAuthCheck: async (token) => {
    const res = await axios.get("/auth-check", {
      headers: {
        Authorization: token,
      },
    });
    return res.data;
  },
};
export default userService;
