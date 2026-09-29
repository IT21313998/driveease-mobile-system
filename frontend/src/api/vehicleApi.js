import client from './client';

export const getVehiclesApi = async (params = {}) => {
  const response = await client.get('/api/vehicles', { params });
  return response.data;
};

export const getVehicleByIdApi = async (id) => {
  const response = await client.get(`/api/vehicles/${id}`);
  return response.data;
};

export const createVehicleApi = async (formData) => {
  const response = await client.post('/api/vehicles', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateVehicleApi = async (id, data, hasFile = false) => {
  const headers = hasFile ? { 'Content-Type': 'multipart/form-data' } : {};
  const response = await client.put(`/api/vehicles/${id}`, data, { headers });
  return response.data;
};

export const deleteVehicleApi = async (id) => {
  const response = await client.delete(`/api/vehicles/${id}`);
  return response.data;
};
