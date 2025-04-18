import { z } from 'zod';

export const applicationLogSchema = z.object({
	id: z.number().optional(),
	application: z.number(),
	date: z.string().min(1, 'This field is required'),
	status: z.string().trim().min(1, 'This field is required'),
	comments: z.string().trim()
});

export type ApplicationLogSchema = typeof applicationLogSchema;
