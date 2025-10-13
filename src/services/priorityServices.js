import axios from "../utils/axiosInstance";

const priorityService = {
  getPriority: async () => {
    const res = await axios.get("/priority");
    return res.data;
  },
  createPriority: async (payload) => {
    const res = await axios.post("/priority", payload);
    return res.data;
  },
  updatePriority: async (payload, id) => {
    const res = await axios.put(`/priority/${id}`, payload);
    return res.data;
  },
  deletePriority: async (id) => {
    const res = await axios.delete(`/priority/${id}`);
    return res.data;
  },
  
};
export default priorityService;
