import { ClientInterface } from 'interfaces/client';

export interface GoalInterface {
  id?: string;
  client_id: string;
  description: string;
  target_date: Date;

  client?: ClientInterface;
  _count?: {};
}
