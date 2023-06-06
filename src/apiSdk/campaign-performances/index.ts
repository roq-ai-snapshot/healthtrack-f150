import axios from 'axios';
import queryString from 'query-string';
import { CampaignPerformanceInterface } from 'interfaces/campaign-performance';
import { GetQueryInterface } from '../../interfaces';

export const getCampaignPerformances = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/campaign-performances${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCampaignPerformance = async (campaignPerformance: CampaignPerformanceInterface) => {
  const response = await axios.post('/api/campaign-performances', campaignPerformance);
  return response.data;
};

export const updateCampaignPerformanceById = async (id: string, campaignPerformance: CampaignPerformanceInterface) => {
  const response = await axios.put(`/api/campaign-performances/${id}`, campaignPerformance);
  return response.data;
};

export const getCampaignPerformanceById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/campaign-performances/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteCampaignPerformanceById = async (id: string) => {
  const response = await axios.delete(`/api/campaign-performances/${id}`);
  return response.data;
};
