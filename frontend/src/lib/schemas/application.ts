import { z } from 'zod';

export const newApplicationSchema = z.object({
	contract: z.number(),
	program: z.number(),
	year: z.number(),
	term: z.string(),
	round_name: z.string()
});

export type NewApplicationSchema = typeof newApplicationSchema;

export const applicationUpdateSchema = z.object({
	id: z.number(),
	contract: z.number(),
	round: z.number()
});

export type ApplicationUpdateSchema = typeof applicationUpdateSchema;
