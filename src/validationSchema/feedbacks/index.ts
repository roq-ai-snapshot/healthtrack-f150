import * as yup from 'yup';

export const feedbackValidationSchema = yup.object().shape({
  message: yup.string().required(),
  rating: yup.number().integer().required(),
  date: yup.date().required(),
  user_id: yup.string().nullable().required(),
});
