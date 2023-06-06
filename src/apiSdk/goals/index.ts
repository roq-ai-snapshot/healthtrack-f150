import axios from 'axios';
import queryString from 'query-string';
import { GoalInterface } from 'interfaces/goal';
import { GetQueryInterface } from '../../interfaces';

export const getGoals = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/goals${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createGoal = async (goal: GoalInterface) => {
  const response = await axios.post('/api/goals', goal);
  return response.data;
};

export const updateGoalById = async (id: string, goal: GoalInterface) => {
  const response = await axios.put(`/api/goals/${id}`, goal);
  return response.data;
};

export const getGoalById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/goals/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteGoalById = async (id: string) => {
  const response = await axios.delete(`/api/goals/${id}`);
  return response.data;
};
