import { z } from 'zod';
import { hasDigitOrSpecial, hasLowercase, hasUppercase, noUsername } from '$lib/util/userUtils';

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

export const createPasswordSchema = (username: string) => {
	// suppress all error messages as the form already has a checklist
	return z
		.object({
			id: z.number(),
			current_password: z.string().min(1, 'This field is required').max(50),
			new_password: z
				.string()
				.min(8, '')
				.max(50)
				.refine(hasLowercase, '')
				.refine(hasUppercase, '')
				.refine(hasDigitOrSpecial, '')
				.refine((value) => noUsername(value, username), ''),
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
};

export type PasswordSchema = ReturnType<typeof createPasswordSchema>;
