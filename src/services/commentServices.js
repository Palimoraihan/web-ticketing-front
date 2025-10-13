import axios from "../utils/axiosInstance";
const commentService = {
  //   getComment: async () => {
  //     const res = await axios.get("/Comment");
  //     return res.data;
  //   },
  createComment: async (payload, token) => {
    const res = await axios.post("/comment", payload, {
      headers: {
        Authorization: token,
      },
    });
    return res.data;
  },
  //   updateComment: async (payload, id) => {
  //     const res = await axios.put(`/Comment/${id}`, payload);
  //     return res.data;
  //   },
  //   deleteComment: async (id) => {
  //     const res = await axios.delete(`/Comment/${id}`);
  //     return res.data;
  //   },
};
export default commentService;
