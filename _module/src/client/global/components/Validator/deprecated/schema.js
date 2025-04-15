import { object, string, number } from 'yup';

export const schema = object({
	username: string().required().min(3),
	password: string().required().min(8),
	age: number().required().min(16).positive(),
});
