import { z } from 'zod';

export const academyProductSchema = z.object({
	id: z.number().optional(),
	name: z.string().trim().min(1).max(100)
});

export type AcademyProductSchema = typeof academyProductSchema;
