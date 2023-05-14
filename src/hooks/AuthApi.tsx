import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
// enum AxiosCredentialsEnum {
//   OMIT = "omit",
//   SAME_ORIGIN = "same-origin",
//   INCLUDE = "include",
// }

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  credentials: string;
}

const axiosConfig: CustomAxiosRequestConfig = {
  withCredentials: true,
  headers: {
    // Access-Control-Allow-Credentials:true,
    // "Content-Type": "application/json",
    "Content-Type": "application/json",
  },
  credentials: "include",
  baseURL: import.meta.env.VITE_APIURL,
};

const api: AxiosInstance = axios.create(axiosConfig);

export const AuthApi = () => ({
  login: async (email: string, password: string) => {
    const response = await api.post("/login", {
      email,
      password,
    });
    return response;
  },
  logout: async () => {
    const response = await api.post("/logout");

    return response;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post("/register", {
      name: name,
      email: email,
      password: password,
    });
    return response;
  },
  userInfo: async () => {
    const response = await api.post("/userInfo");
    return response;
  },
  createThought: async (title: string) => {
    const response = await api.post("/createThought", {
      title,
    });
    return response;
  },
  dashboardThoughts: async () => {
    const response = await api.get("/dashboardThoughts");
    return response;
  },
  deleteThought: async (id: number) => {
    const response = await api.post("/deleteThought", { id });
    return response;
  },
  updateThought: async (id: number, title: string) => {
    const response = await api.post("/updateThought", { id, title });
    return response;
  },
  getThoughts: async () => {
    const response = await api.get("/getThoughts");
    return response;
  },
  searchThoughts: async (search: string) => {
    const response = await api.post("/searchThoughts", { search });
    return response;
  },
});
