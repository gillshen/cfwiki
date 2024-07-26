import { z } from 'zod';

export const studentSchema = z.object({
	id: z.number(),
	surname: z.string().trim().min(1).max(100),
	given_name: z.string().trim().min(1).max(100),
	surname_first: z.boolean().default(true),
	preferred_name: z.string().trim(),
	gender: z.string(),
	citizenship: z.string(),
	date_of_birth: z.string().nullable().default(null),
	base_country: z.string(),
	base_subnational: z.string(),
	base_city: z.string().trim(),
	comments: z.string().trim()
});

export type StudentSchema = typeof studentSchema;

export const newStudentSchema = studentSchema.extend({
	id: studentSchema.shape.id.optional()
});

export type NewStudentSchema = typeof newStudentSchema;
