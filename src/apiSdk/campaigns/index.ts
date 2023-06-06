import axios from 'axios';
import queryString from 'query-string';
import { CampaignInterface } from 'interfaces/campaign';
import { GetQueryInterface } from '../../interfaces';

export const getCampaigns = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/campaigns${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCampaign = async (campaign: CampaignInterface) => {
  const response = await axios.post('/api/campaigns', campaign);
  return response.data;
};

export const updateCampaignById = async (id: string, campaign: CampaignInterface) => {
  const response = await axios.put(`/api/campaigns/${id}`, campaign);
  return response.data;
};

export const getCampaignById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/campaigns/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCampaignById = async (id: string) => {
  const response = await axios.delete(`/api/campaigns/${id}`);
  return response.data;
};
