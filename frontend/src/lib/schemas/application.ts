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

export const applicationUpdateSchema = z.object({
	id: z.number(),
	major_1: z.string(),
	major_2: z.string(),
	major_3: z.string(),
	comments: z.string()
});

export type ApplicationUpdateSchema = typeof applicationUpdateSchema;
