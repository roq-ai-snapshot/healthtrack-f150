import { CampaignPerformanceInterface } from 'interfaces/campaign-performance';
import { UserInterface } from 'interfaces/user';

export interface CampaignInterface {
  id?: string;
  name: string;
  start_date: Date;
  end_date: Date;
  marketing_user_id: string;
  campaign_performance?: CampaignPerformanceInterface[];
  user?: UserInterface;
  _count?: {
    campaign_performance?: number;
  };
}
