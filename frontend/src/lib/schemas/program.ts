import { z } from 'zod';

export const newProgramSchema = z.object({
	type: z.string().min(1).max(50),
	name: z.string().trim().max(100),
	degree: z.string().trim().max(100),
	school_1: z.number(),
	school_2: z.number().optional().default(0)
});

export type NewProgramSchema = typeof newProgramSchema;

export const programUpdateSchema = z.object({
	id: z.number(),
	name: z.string().trim().max(100),
	degree: z.string().trim().max(100)
});

export type ProgramUpdateSchema = typeof programUpdateSchema;
