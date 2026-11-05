import API from "./api";

// Login User
export const login = async (data) => {
  const response = await API.post("/auth/login", data);
  if (response.data?.success && response.data?.data?.token) {
    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.data));
  }
  return response.data;
};

// Login Admin
export const adminLogin = async (data) => {
  const response = await API.post("/auth/admin-login", data);
  if (response.data?.success && response.data?.data?.token) {
    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.data));
  }
  return response.data;
};

// Register User
export const register = async (data) => {
  const response = await API.post("/auth/register", data);
  if (response.data?.success && response.data?.data?.token) {
    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.data));
  }
  return response.data;
};

// Get Profile
export const getProfile = async () => {
  const response = await API.get("/auth/profile");
  return response.data;
};

// Update Profile
export const updateProfile = async (data) => {
  const response = await API.put("/auth/profile", data);
  return response.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
