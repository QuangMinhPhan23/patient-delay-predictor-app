import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getSinglePrediction = async (patientData) => {
  const response = await api.post('/predict', patientData);
  return response.data;
};

export const getBatchPrediction = async (patientsData) => {
  const response = await api.post('/predict_batch', patientsData);
  return response.data;
};

export const getModelInfo = async () => {
  const response = await api.get('/model_info');
  return response.data;
};

export default api;
