import { z } from 'zod';

export const applicationSchema = z.object({
	id: z.number(),
	student: z.number(),
	round: z.number()
});

export type ApplicationSchema = typeof applicationSchema;

export const newApplicationSchema = z.object({
	student: z.number(),
	program: z.number(),
	year: z.number(),
	term: z.string(),
	round_name: z.string()
});

export type NewApplicationSchema = typeof newApplicationSchema;
