import client from './client';

export const loginApi = async (email, password) => {
  const response = await client.post('/api/auth/login', { email, password });
  return response.data;
};

export const registerApi = async (name, email, password, role = 'customer') => {
  const response = await client.post('/api/auth/register', { name, email, password, role });
  return response.data;
};

export const getProfileApi = async () => {
  const response = await client.get('/api/auth/profile');
  return response.data;
};
