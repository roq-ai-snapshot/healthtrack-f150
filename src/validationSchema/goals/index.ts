import * as yup from 'yup';

export const goalValidationSchema = yup.object().shape({
  description: yup.string().required(),
  target_date: yup.date().required(),
  client_id: yup.string().nullable().required(),
});
