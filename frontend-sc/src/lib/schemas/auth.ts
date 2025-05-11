import { z } from 'zod';

export const authSchema = z.object({
	username: z.string().min(1, 'Username required'),
	password: z.string().min(1, 'Password required')
});

export type AuthSchema = typeof authSchema;
