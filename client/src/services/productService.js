import api from './apiClient';

const list = async () => {
  const { data } = await api.get('/products');
  return data;
};

const mine = async () => {
  const { data } = await api.get('/products/mine');
  return data;
};

const getById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

const appendValue = (formData, key, value) => {
  if (value === undefined || value === null) return;
  if (Array.isArray(value)) {
    if (!value.length) return;
    if (value[0] instanceof File) {
      value.forEach((file) => formData.append(key, file));
    } else {
      formData.append(key, JSON.stringify(value));
    }
    return;
  }
  formData.append(key, value);
};

const create = async (payload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => appendValue(formData, key, value));
  const { data } = await api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

const update = async (id, payload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => appendValue(formData, key, value));
  const { data } = await api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

const remove = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

export default {
  list,
  mine,
  getById,
  create,
  update,
  remove,
};

