import { z } from 'zod';

export const applicationLogSchema = z.object({
	id: z.number(),
	application: z.number(),
	date: z.string().nullable().default(null),
	status: z.string(),
	comments: z.string().trim()
});

export type ApplicationLogSchema = typeof applicationLogSchema;
