import axios from 'axios';
import queryString from 'query-string';
import { FitnessDataInterface } from 'interfaces/fitness-data';
import { GetQueryInterface } from '../../interfaces';

export const getFitnessData = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/fitness-data${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createFitnessData = async (fitnessData: FitnessDataInterface) => {
  const response = await axios.post('/api/fitness-data', fitnessData);
  return response.data;
};

export const updateFitnessDataById = async (id: string, fitnessData: FitnessDataInterface) => {
  const response = await axios.put(`/api/fitness-data/${id}`, fitnessData);
  return response.data;
};

export const getFitnessDataById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/fitness-data/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteFitnessDataById = async (id: string) => {
  const response = await axios.delete(`/api/fitness-data/${id}`);
  return response.data;
};
