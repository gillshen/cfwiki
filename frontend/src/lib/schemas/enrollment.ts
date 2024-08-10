import { z } from 'zod';

export const enrollmentSchema = z.object({
	id: z.number().optional(),
	student: z.number(),
	school: z.number(),
	program_type: z.string(),
	start_date: z.string(),
	start_progression: z.string(),
	end_date: z.string().nullable().default(null),
	end_progression: z.string(),
	curriculum: z.string()
});

export type EnrollmentSchema = typeof enrollmentSchema;
