import { z, ZodObject } from 'zod';

const commonApplicationRoundFields = {
	name: z.string().trim().min(1, 'This field is required').max(50),
	due_date: z.string().nullable().default(null),
	due_time: z.string().nullable().default(null),
	timezone: z.string(),
	decision_date: z.string().nullable().default(null)
};

export type CommonApplicationRoundSchema = ZodObject<typeof commonApplicationRoundFields>;

export const newApplicationRoundSchema = z.object({
	program: z.number().min(1, 'This field is required'),
	year: z.number().min(1, 'This field is required'),
	term: z.string().min(1, 'This field is required'),
	...commonApplicationRoundFields
});

export type NewApplicationRoundSchema = typeof newApplicationRoundSchema;

export const applicationRoundUpdateSchema = z.object({
	id: z.number(),
	...commonApplicationRoundFields
});

export type ApplicationRoundUpdateSchema = typeof applicationRoundUpdateSchema;
