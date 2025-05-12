import { z } from 'zod';

export const newProgramSchema = z
	.object({
		type: z.string().min(1, 'This field is required').max(50),
		name: z.string().trim().max(100),
		degree: z.string().trim().max(100),
		schools: z.number().array().min(1, 'Select at least one option')
	})
	.refine((data) => data.type.startsWith('UG') || !!data.degree, {
		message: 'This field is required',
		path: ['degree']
	})
	.refine((data) => data.type.startsWith('UG') || !!data.degree, {
		message: 'This field is required',
		path: ['name']
	});

export type NewProgramSchema = typeof newProgramSchema;

export const programUpdateSchema = z.object({
	id: z.number(),
	name: z.string().trim().max(100),
	degree: z.string().trim().max(100),
	is_defunct: z.boolean()
});

export type ProgramUpdateSchema = typeof programUpdateSchema;
