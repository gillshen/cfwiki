import { z } from 'zod';
import type { ProgramListItem } from '$lib/api/program';

export const collectionSchema = z.object({
	id: z.number().optional(),
	name: z.string().trim().min(1).max(50),
	created_by: z.number(),
	is_public: z.boolean(),
	programs: z.number().array()
});

export type CollectionSchema = typeof collectionSchema;

export type StagedProgram = {
	program: ProgramListItem;
};
