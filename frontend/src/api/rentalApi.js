import client from './client';

export const createRentalApi = async (rentalData) => {
  const response = await client.post('/api/rentals', rentalData);
  return response.data;
};

export const getMyRentalsApi = async () => {
  const response = await client.get('/api/rentals/my-rentals');
  return response.data;
};

export const getAllRentalsApi = async () => {
  const response = await client.get('/api/rentals');
  return response.data;
};

export const getRentalByIdApi = async (id) => {
  const response = await client.get(`/api/rentals/${id}`);
  return response.data;
};

export const updateRentalStatusApi = async (id, status) => {
  const response = await client.put(`/api/rentals/${id}/status`, { status });
  return response.data;
};

export const deleteRentalApi = async (id) => {
  const response = await client.delete(`/api/rentals/${id}`);
  return response.data;
};
