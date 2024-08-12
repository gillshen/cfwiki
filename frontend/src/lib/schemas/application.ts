import { z } from 'zod';

export const newApplicationSchema = z.object({
	contract: z.number(),
	program: z.number(),
	year: z.number(),
	term: z.string(),
	round_name: z.string()
});

export type NewApplicationSchema = typeof newApplicationSchema;

export const roundChangeSchema = z.object({
	id: z.number(),
	program: z.number(),
	year: z.number(),
	term: z.string(),
	round_name: z.string()
});

export type RoundChangeSchema = typeof roundChangeSchema;
