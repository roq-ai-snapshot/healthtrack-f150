import { FitnessDataInterface } from 'interfaces/fitness-data';
import { GoalInterface } from 'interfaces/goal';
import { UserInterface } from 'interfaces/user';

export interface ClientInterface {
  id?: string;
  user_id: string;
  health_coach_id: string;
  fitness_data?: FitnessDataInterface[];
  goal?: GoalInterface[];
  user_client_user_idTouser?: UserInterface;
  user_client_health_coach_idTouser?: UserInterface;
  _count?: {
    fitness_data?: number;
    goal?: number;
  };
}
