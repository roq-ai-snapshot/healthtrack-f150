import * as yup from 'yup';
import { fitnessDataValidationSchema } from 'validationSchema/fitness-data';
import { goalValidationSchema } from 'validationSchema/goals';

export const clientValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  health_coach_id: yup.string().nullable().required(),
  fitness_data: yup.array().of(fitnessDataValidationSchema),
  goal: yup.array().of(goalValidationSchema),
});
