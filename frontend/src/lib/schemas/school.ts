import { z } from 'zod';

export const schoolSchema = z.object({
	id: z.number(),
	name: z.string().trim().min(1).max(100),
	alt_name: z.string().trim().max(20),
	type: z.string(),
	country: z.string()
});

export type SchoolSchema = typeof schoolSchema;

export const newSchoolSchema = schoolSchema.extend({
	id: schoolSchema.shape.id.optional()
});

export type NewSchoolSchema = typeof newSchoolSchema;
