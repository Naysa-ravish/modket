import api from './apiClient';

const ask = async ({ productId, question }) => {
  const { data } = await api.post('/questions', { productId, question });
  return data;
};

const answer = async ({ questionId, answer }) => {
  const { data } = await api.post(`/questions/${questionId}/answer`, {
    answer,
  });
  return data;
};

const forProduct = async (productId) => {
  const { data } = await api.get(`/questions/product/${productId}`);
  return data;
};

const forSeller = async () => {
  const { data } = await api.get('/questions/seller');
  return data;
};

export default {
  ask,
  answer,
  forProduct,
  forSeller,
};

