import axios from "../utils/axiosInstance";

const statusService = {
  getStatus: async () => {
    const res = await axios.get("/status");
    return res.data;
  },
  createStatus: async (payload) => {
    const res = await axios.post("/status", payload);
    return res.data;
  },
  updateStatus: async (payload, id) => {
    const res = await axios.put(`/status/${id}`, payload);
    return res.data;
  },
  deleteStatus: async (id) => {
    const res = await axios.delete(`/status/${id}`);
    return res.data;
  },
  
};
export default statusService;
