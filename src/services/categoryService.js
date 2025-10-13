import axios from "../utils/axiosInstance";

const categoryService = {
  createCategory: async (payload) => {
    const res = await axios.post("/category-sla", payload);
    return res.data;
  },
  updateCategory: async (id,payload) => {
    const res = await axios.put(`/category-sla/${id}`, payload);
    return res.data;
  },
  getCategory: async () => {
    const res = await axios.get("/category-by-sla");
    return res.data;
  },
  getCategoryById: async (id) => {
    const res = await axios.get(`/category/${id}`);
    return res.data;
  },

};
export default categoryService;
