import { passwordHasDigitOrSpecial, passwordHasLower, passwordHasUpper } from '$lib/util/userUtils';
import { z } from 'zod';

export const userUpdateSchema = z.object({
	id: z.number(),
	public_banner: z.string().trim().max(50),
	avatar: z.string().trim().max(50)
});

export type UserUpdateSchema = typeof userUpdateSchema;

export const userAdminUpdateSchema = z.object({
	id: z.number(),
	email: z.string().trim().min(1, 'This field is required'),
	is_active: z.boolean(),
	is_staff: z.boolean(),
	department: z.string().trim().min(1, 'This field is required')
});

export type UserAdminUpdateSchema = typeof userAdminUpdateSchema;

export const passwordResetSchema = z
	.object({
		id: z.number(),
		current_password: z.string().min(1, 'This field is required').max(50),
		new_password: z
			.string()
			.min(8, '')
			.max(50)
			// TODO check username too
			.refine(passwordHasLower, '')
			.refine(passwordHasUpper, '')
			.refine(passwordHasDigitOrSpecial, ''),
		confirm_new_password: z.string()
	})
	.refine((data) => data.current_password !== data.new_password, {
		message: '',
		path: ['new_password']
	})
	.refine((data) => data.new_password === data.confirm_new_password, {
		message: '',
		path: ['confirm_new_password']
	});

export type PasswordResetSchema = typeof passwordResetSchema;
