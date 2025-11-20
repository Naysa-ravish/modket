import api from './apiClient';

const recent = async () => {
  const { data } = await api.get('/activities');
  return data;
};

export default { recent };

