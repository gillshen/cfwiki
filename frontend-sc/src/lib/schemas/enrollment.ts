import { z } from 'zod';

export const enrollmentSchema = z.object({
	id: z.number().optional(),
	student: z.number(),
	_school_type: z.string().min(1, 'This field is required'),
	_school: z.string().min(1, 'This field is required'),
	school: z.number(),
	program_type: z.string().min(1, 'This field is required'),
	start_date: z.string().min(1, 'This field is required'),
	start_progression: z.string(),
	end_date: z.string().nullable().default(null),
	end_progression: z.string(),
	curriculum: z.string()
});

export type EnrollmentSchema = typeof enrollmentSchema;
