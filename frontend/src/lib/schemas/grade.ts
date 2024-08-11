import { z } from 'zod';

export const gradeSchema = z.object({
	id: z.number().optional(),
	enrollment: z.number(),
	progression: z.string().min(1).max(50),
	term: z.string().min(1).max(20),
	value: z.number(),
	scale: z.number(),
	is_cumulative: z.boolean(),
	comments: z.string().trim().max(500)
});

export type GradeSchema = typeof gradeSchema;
