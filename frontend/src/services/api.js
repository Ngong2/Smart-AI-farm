import axios from "axios";
import * as authService from "./auth";

/*
================ BASE API CONFIG ================
*/
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/*
================ ATTACH JWT TOKEN ================
*/
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/*
================ GLOBAL ERROR HANDLER ================
*/
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const authEndpoints = ["/auth/login", "/auth/admin-login", "/auth/register"];
    const isAuthEndpoint = authEndpoints.some((endpoint) =>
      error.config?.url?.includes(endpoint)
    );

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/*
================ AUTH API ================
*/
export const authAPI = {
  login: authService.login,
  adminLogin: authService.adminLogin,
  register: authService.register,
  getProfile: authService.getProfile,
  updateProfile: authService.updateProfile,
  logout: authService.logout,
};

/*
================ CROP API ================
*/
export const cropAPI = {
  analyze: async (formData) => {
    const res = await API.post("/crop/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  getHistory: async () => {
    const res = await API.get("/crop/history");
    return res.data;
  },

  getAnalysis: async (id) => {
    const res = await API.get(`/crop/${id}`);
    return res.data;
  },

  update: async (id, data) => {
    const res = await API.put(`/crop/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await API.delete(`/crop/${id}`);
    return res.data;
  },
};

/*
================ SOIL API ================
*/
export const soilAPI = {
  // Accepts a raw File object and builds FormData here
  analyzeImage: async (imageFile) => {
    const formData = new FormData();
    // Field name MUST match backend: upload.single('soilImage')
    formData.append("soilImage", imageFile);

    const res = await API.post("/soil/analyze-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  getAdvice: async (data) => {
    const res = await API.post("/soil/advice", data);
    return res.data;
  },

  getHistory: async () => {
    const res = await API.get("/soil/history");
    return res.data;
  },

  getReport: async (id) => {
    const res = await API.get(`/soil/${id}`);
    return res.data;
  },

  update: async (id, data) => {
    const res = await API.put(`/soil/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await API.delete(`/soil/${id}`);
    return res.data;
  },
};

/*
================ WEATHER API ================
*/
export const weatherAPI = {
  getAdvice: async () => {
    const res = await API.get("/weather/advice");
    return res.data;
  },

  getAlerts: async () => {
    const res = await API.get("/weather/alerts");
    return res.data;
  },

  update: async (id, data) => {
    const res = await API.put(`/weather/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await API.delete(`/weather/${id}`);
    return res.data;
  },
};

/*
================ ADMIN API ================
*/
export const adminAPI = {
  getOverview: async () => {
    const res = await API.get("/admin/overview");
    return res.data;
  },

  getUsers: async () => {
    const res = await API.get("/admin/users");
    return res.data;
  },

  sendMessage: async (data) => {
    const res = await API.post("/admin/messages", data);
    return res.data;
  },
};

/*
================ FARMER API ================
*/
export const farmerAPI = {
  getOverview: async () => {
    const res = await API.get("/farmer/overview");
    return res.data;
  },

  getSubscription: async () => {
    const res = await API.get("/farmer/subscription");
    return res.data;
  },

  subscribe: async (data) => {
    const res = await API.post("/farmer/subscription", data);
    return res.data;
  },
};

export default API;
