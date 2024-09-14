import { z } from 'zod';

export const rankingEntrySchema = z.object({
	id: z.number().optional(),
	ranking: z.number(),
	school: z.number(),
	year: z.number(),
	rank: z.number()
});

export type RankingEntrySchema = typeof rankingEntrySchema;
