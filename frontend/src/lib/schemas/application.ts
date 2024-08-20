import { z } from 'zod';

export const newApplicationSchema = z.object({
	contract: z.number(),
	round: z.number()
});

export type NewApplicationSchema = typeof newApplicationSchema;

export const roundChangeSchema = z.object({
	id: z.number(),
	round: z.number()
});

export type RoundChangeSchema = typeof roundChangeSchema;

export const majorsUpdateSchema = z.object({
	id: z.number(),
	major_1: z.string().trim(),
	major_2: z.string().trim(),
	major_3: z.string().trim()
});

export type MajorsUpdateSchema = typeof majorsUpdateSchema;

export const commentsUpdateSchema = z.object({
	id: z.number(),
	comments: z.string().trim()
});

export type CommentsUpdateSchema = typeof commentsUpdateSchema;
