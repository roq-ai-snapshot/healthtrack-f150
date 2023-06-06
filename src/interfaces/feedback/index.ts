import { UserInterface } from 'interfaces/user';

export interface FeedbackInterface {
  id?: string;
  user_id: string;
  message: string;
  rating: number;
  date: Date;

  user?: UserInterface;
  _count?: {};
}
