import { UserInterface } from 'interfaces/user';

export interface FitnessTrackerInterface {
  id?: string;
  name: string;
  user_id: string;

  user?: UserInterface;
  _count?: {};
}
