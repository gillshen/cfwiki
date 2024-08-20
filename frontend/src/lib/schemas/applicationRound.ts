import { z } from 'zod';

export const newRoundSchema = z.object({
	program: z.number(),
	year: z.number(),
	term: z.string(),
	name: z.string().trim().min(1).max(50),
	due_date: z.string().nullable().default(null),
	due_time: z.string().nullable().default(null),
	timezone: z.string(),
	decision_date: z.string().nullable().default(null)
});

export const NewRoundSchema = typeof newRoundSchema;

export const roundNameSchema = z.object({
	id: z.number(),
	name: z.string().trim().min(1).max(50)
});

export type RoundNameSchema = typeof roundNameSchema;

export const roundDatesSchema = z.object({
	id: z.number(),
	due_date: z.string().nullable().default(null),
	due_time: z.string().nullable().default(null),
	timezone: z.string(),
	decision_date: z.string().nullable().default(null)
});

export type RoundDatesSchema = typeof roundDatesSchema;
