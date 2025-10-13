import axios from "../utils/axiosInstance";

const ticketService = {
  createTicket: async (payload, token) => {
    const res = await axios.post("/ticket", payload, {
      headers: {
        Authorization: token,
      },
    });
    return res.data;
  },
  getTickets: async (params, token) => {
    const res = await axios.get(`/ticket?${params}`, {
      headers: {
        Authorization: token,
      },
    });
    return res.data;
  },
  getDetailTicket: async (id, token) => {
    const res = await axios.get(`/ticket/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    return res.data;
  },
  updateDetailTicket: async (id, payload, token) => {
    const res = await axios.put(`/ticket/${id}`, payload, {
      headers: {
        Authorization: token,
      },
    });
    return res.data;
  },
  assignTicket: async (payload, token) => {
    const res = await axios.put(`/assign/${payload.id}`, payload.agent, {
      headers: {
        Authorization: token,
      },
    });
    return res.data;
  },
};
export default ticketService;
