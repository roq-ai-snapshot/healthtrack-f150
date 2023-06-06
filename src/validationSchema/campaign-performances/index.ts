import * as yup from 'yup';

export const campaignPerformanceValidationSchema = yup.object().shape({
  metric: yup.string().required(),
  value: yup.number().integer().required(),
  date: yup.date().required(),
  campaign_id: yup.string().nullable().required(),
});
