import api from "./axios.js";

export const getStats = async () => {
  const { data } = await api.get("/admin/stats");
  return data;
};

export const getAllOrders = async (status) => {
  const { data } = await api.get("/admin/orders", { params: status ? { status } : {} });
  return data;
};

export const getAllRiders = async () => {
  const { data } = await api.get("/admin/riders");
  return data;
};

export const toggleRiderVerification = async (id) => {
  const { data } = await api.put(`/admin/riders/${id}/verify`);
  return data;
};
