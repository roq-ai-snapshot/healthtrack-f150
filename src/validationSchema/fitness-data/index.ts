import * as yup from 'yup';

export const fitnessDataValidationSchema = yup.object().shape({
  data_type: yup.string().required(),
  value: yup.number().integer().required(),
  date: yup.date().required(),
  client_id: yup.string().nullable().required(),
});
