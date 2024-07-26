import { z } from 'zod';

export const contractSchema = z.object({
	id: z.number(),
	student: z.number(),
	type: z.string().min(1).max(100),
	target_year: z.number(),
	date: z.string().nullable().default(null),
	status: z.string().default('In effect'),
	student_progression_when_signed: z.string().max(50)
});

export type ContractSchema = typeof contractSchema;

export const newContractSchema = contractSchema.extend({
	id: contractSchema.shape.id.optional()
});

export type NewContractSchema = typeof newContractSchema;
