import { z } from 'zod';

export const academyProgramSchema = z.object({
	id: z.number().optional(),
	name: z.string().trim().min(1).max(100),
	category: z.string().trim()
});

export type AcademyProgramSchema = typeof academyProgramSchema;
