import axios from "axios";

export const base_url = "http://localhost:3000";

// Create a custom Axios instance
export const apiClient = axios.create({
  baseURL: base_url,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
