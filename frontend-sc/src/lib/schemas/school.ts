import { z } from 'zod';

export const schoolSchema = z.object({
	id: z.number().optional(),
	name: z.string().trim().min(1, 'This field is required').max(100, 'Max 100 characters'),
	alt_name: z.string().trim().max(20, 'Max 20 characters'),
	type: z.string().min(1, 'This field is required').max(50, 'Max 50 characters'),
	country: z.string().min(1, 'This field is required').max(100, 'Max 100 characters'),
	region: z.string().trim().max(50, 'Max 50 characters'),
	city: z.string().trim().max(100, 'Max 100 characters')
});

export type SchoolSchema = typeof schoolSchema;
