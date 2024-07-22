import { z } from 'zod';

export const newStudentSchema = z.object({
	surname: z.string().trim().min(1).max(100),
	given_name: z.string().trim().min(1).max(100),
	surname_first: z.boolean().default(true),
	preferred_name: z.string().trim(),
	gender: z.string(),
	citizenship: z.string().min(1).max(100),
	date_of_birth: z.string().nullable().default(null),
	base_country: z.string(),
	base_subnational: z.string(),
	base_city: z.string().trim()
});

export type NewStudentSchema = typeof newStudentSchema;
