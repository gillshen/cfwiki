import { z } from 'zod';

export const rankingSchema = z.object({
	id: z.number().optional(),
	name: z.string().trim().max(100),
	year: z.number()
});

export const rankingEntrySchema = z.object({
	id: z.number().optional(),
	ranking: z.number(),
	school: z.number(),
	rank: z.number().min(1)
});

export type RankingEntrySchema = typeof rankingEntrySchema;
