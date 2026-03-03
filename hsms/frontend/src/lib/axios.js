import axios from "axios";
//dung git free no cho url ngau nhien
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

// const BASE_URL =
//   import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL,
}); 

export default api;