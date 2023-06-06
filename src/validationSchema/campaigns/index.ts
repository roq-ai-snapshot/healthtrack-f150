import * as yup from 'yup';
import { campaignPerformanceValidationSchema } from 'validationSchema/campaign-performances';

export const campaignValidationSchema = yup.object().shape({
  name: yup.string().required(),
  start_date: yup.date().required(),
  end_date: yup.date().required(),
  marketing_user_id: yup.string().nullable().required(),
  campaign_performance: yup.array().of(campaignPerformanceValidationSchema),
});
