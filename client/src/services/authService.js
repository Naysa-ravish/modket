import api from './apiClient';

const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

const login = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

const me = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

const updateProfile = async (payload) => {
  const { data } = await api.put('/auth/profile', payload);
  return data;
};

const toggleSeller = async () => {
  const { data } = await api.patch('/auth/toggle-seller');
  return data;
};

export default {
  register,
  login,
  me,
  updateProfile,
  toggleSeller,
};

