import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

export const login = (payload) => api.post("/auth/login", payload);

export const register = (payload) => api.post("/auth/register", payload);

export const getServices = () => api.get("/services");

export const getBookings = () => api.get("/bookings");

export const createBooking = (payload) => api.post("/bookings", payload);

export default api;

