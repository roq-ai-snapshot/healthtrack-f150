import { ClientInterface } from 'interfaces/client';

export interface FitnessDataInterface {
  id?: string;
  client_id: string;
  data_type: string;
  value: number;
  date: Date;

  client?: ClientInterface;
  _count?: {};
}
