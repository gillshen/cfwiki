import { z } from 'zod';

export const studentSchema = z.object({
	id: z.number().optional(),
	surname: z.string().trim().min(1, 'This field is required').max(100, 'Max 100 characters'),
	given_name: z.string().trim().min(1, 'This field is required').max(100, 'Max 100 characters'),
	surname_first: z.boolean().default(true),
	preferred_name: z.string().trim().max(50, 'Max 50 characters'),
	gender: z.string().min(1, 'This field is required').max(20, 'Max 20 characters'),
	citizenship: z.string().min(1, 'This field is required').max(100, 'Max 100 characters'),
	date_of_birth: z.string().nullable().default(null),
	base_country: z.string().min(1, 'This field is required').max(100, 'Max 100 characters'),
	base_subnational: z.string().max(50, 'Max 50 characters'),
	base_city: z.string().trim().max(100, 'Max 100 characters'),
	comments: z.string().trim().max(5000, 'Max 5,000 characters')
});

export type StudentSchema = typeof studentSchema;

export const studentAcamdeyProgramSchema = z.object({
	id: z.number(),
	cf_academy_programs: z.number().array()
});

export type StudentAcamdeyProgramSchema = typeof studentAcamdeyProgramSchema;
