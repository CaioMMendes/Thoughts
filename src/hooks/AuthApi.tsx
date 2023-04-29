import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_APIURL,
  headers: {
    Credentials: "include",
  },
});

export const AuthApi = () => ({
  login: async (email: string, password: string) => {
    const response = await api.post("/login", {
      email,
      password,
    });
    return response;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post("/register", {
      name,
      email,
      password,
    });
    return response;
  },
});
