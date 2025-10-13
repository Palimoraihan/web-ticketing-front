import axios from "../utils/axiosInstance";
class TicketServices {
  constructor() {
    this.url = "/ticket";
  }
  async getTicket() {
    const res = await axios.get(this.url);
    return res.data;
  }
}

export default TicketServices;