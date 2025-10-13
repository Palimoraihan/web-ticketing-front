import axios from "../utils/axiosInstance";
const roleService = {
 
  getRole: async () => {
    const res = await axios.get("/role");
    return res.data;
  },
};
export default roleService;