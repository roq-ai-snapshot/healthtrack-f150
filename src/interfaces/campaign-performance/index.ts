import { CampaignInterface } from 'interfaces/campaign';

export interface CampaignPerformanceInterface {
  id?: string;
  campaign_id: string;
  metric: string;
  value: number;
  date: Date;

  campaign?: CampaignInterface;
  _count?: {};
}
