import { z } from 'zod';

export const serviceSchema = z.object({
	id: z.number(),
	contract: z.number(),
	cfer: z.number(),
	role: z.string().trim().min(1).max(50),
	start_date: z.string().nullable().default(null),
	end_date: z.string().nullable().default(null)
});

export type ServiceSchema = typeof serviceSchema;

export const newServiceSchema = serviceSchema.extend({
	id: serviceSchema.shape.id.optional()
});

export type NewServiceSchema = typeof newServiceSchema;
