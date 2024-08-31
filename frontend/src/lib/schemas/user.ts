import { z } from 'zod';

export const userUpdateSchema = z.object({
	id: z.number(),
	public_banner: z.string().trim().max(50)
});

export type UserUpdateSchema = typeof userUpdateSchema;

export const passwordResetSchema = z.object({
	id: z.number(),
	password: z.string().min(8).max(50),
	repeat_password: z.string().min(8).max(50)
});

export type PasswordResetSchema = typeof passwordResetSchema;
