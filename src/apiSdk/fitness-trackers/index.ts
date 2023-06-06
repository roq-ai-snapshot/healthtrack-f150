import axios from 'axios';
import queryString from 'query-string';
import { FitnessTrackerInterface } from 'interfaces/fitness-tracker';
import { GetQueryInterface } from '../../interfaces';

export const getFitnessTrackers = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/fitness-trackers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createFitnessTracker = async (fitnessTracker: FitnessTrackerInterface) => {
  const response = await axios.post('/api/fitness-trackers', fitnessTracker);
  return response.data;
};

export const updateFitnessTrackerById = async (id: string, fitnessTracker: FitnessTrackerInterface) => {
  const response = await axios.put(`/api/fitness-trackers/${id}`, fitnessTracker);
  return response.data;
};

export const getFitnessTrackerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/fitness-trackers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteFitnessTrackerById = async (id: string) => {
  const response = await axios.delete(`/api/fitness-trackers/${id}`);
  return response.data;
};
