import api from '@/lib/axios';

export const requestMagicLink = async (email) => {
  await api.post('/auth/request-magic-link', { email });
};

export const verifyMagicToken = async (token) => {
  const res = await api.post('/auth/validate-token', token);
  return res.data;
};
