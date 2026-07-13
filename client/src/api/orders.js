import api from "./axios.js";

export const createOrder = async (orderData) => {
  const { data } = await api.post("/orders", orderData);
  return data;
};

export const estimateFare = async (payload) => {
  const { data } = await api.post("/orders/estimate", payload);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/orders/my-orders");
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export const getPendingOrders = async () => {
  const { data } = await api.get("/orders/pending");
  return data;
};

export const getMyRiderOrders = async () => {
  const { data } = await api.get("/orders/rider/my-deliveries");
  return data;
};

export const acceptOrder = async (id) => {
  const { data } = await api.put(`/orders/${id}/accept`);
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/orders/${id}/status`, { status });
  return data;
};
