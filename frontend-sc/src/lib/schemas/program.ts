import { z } from 'zod';

export const programSchema = z
	.object({
		id: z.number().optional(),
		type: z.string().min(1, 'This field is required').max(50),
		name: z.string().trim().max(100),
		degree: z.string().trim().max(100),
		schools: z.number().array().min(1, 'Select at least one option'),
		is_defunct: z.boolean().default(false)
	})
	.refine((data) => (data.type !== "Master's" && data.type !== 'Doctorate') || !!data.degree, {
		message: 'This field is required',
		path: ['degree']
	})
	.refine((data) => data.type.startsWith('UG') || !!data.name, {
		message: 'This field is required',
		path: ['name']
	});

export type ProgramSchema = typeof programSchema;
