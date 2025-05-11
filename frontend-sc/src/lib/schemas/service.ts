import { z } from 'zod';

export const serviceSchema = z.object({
	id: z.number().optional(),
	contract: z.number(),
	cfer: z.number().min(1, 'This field is required'),
	role: z.string().trim().min(1, 'This field is required').max(50),
	start_date: z.string().nullable().default(null),
	end_date: z.string().nullable().default(null)
});

export type ServiceSchema = typeof serviceSchema;
