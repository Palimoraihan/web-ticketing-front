import axios from "axios";
const url = {
    local: "http://localhost:3030/api/v1",
    global: "https://web-ticketing-back.vercel.app/api/v1"
}
const axiosInstance = axios.create({
    baseURL:url.global,
    // withCredentials:true,
    headers:{
        "Content-Type": "application/json",
    }
})
export default axiosInstance