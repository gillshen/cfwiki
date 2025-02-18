import { z } from 'zod';

export const contractSchema = z.object({
	id: z.number().optional(),
	student: z.number(),
	type: z.string().min(1).max(100),
	target_year: z.number(),
	date: z.string().nullable().default(null),
	status: z.string().default('In effect'),
	student_progression_when_signed: z.string().max(50)
});

export type ContractSchema = typeof contractSchema;
