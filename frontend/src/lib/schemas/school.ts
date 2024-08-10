import { z } from 'zod';

export const schoolSchema = z.object({
	id: z.number().optional(),
	name: z.string().trim().min(1).max(100),
	alt_name: z.string().trim().max(20),
	type: z.string(),
	country: z.string()
});

export type SchoolSchema = typeof schoolSchema;
