import api from './apiClient';

const create = async ({ productId, note }) => {
  const { data } = await api.post('/orders', { productId, note });
  return data;
};

const buyerOrders = async () => {
  const { data } = await api.get('/orders/buyer');
  return data;
};

const sellerOrders = async () => {
  const { data } = await api.get('/orders/seller');
  return data;
};

const approve = async (orderId) => {
  const { data } = await api.patch(`/orders/${orderId}/approve`);
  return data;
};

const cancel = async (orderId) => {
  const { data } = await api.patch(`/orders/${orderId}/cancel`);
  return data;
};

export default {
  create,
  buyerOrders,
  sellerOrders,
  approve,
  cancel,
};

