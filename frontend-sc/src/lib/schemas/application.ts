import { z } from 'zod';

import type { School } from '$lib/api/school';
import type { ProgramListItem } from '$lib/api/program';
import type { ApplicationRoundListItem } from '$lib/api/applicationRound';

export const batchNewApplicationSchema = z.object({
	contract: z.number(),
	rounds: z.number().array()
});

export type BatchNewApplicationSchema = typeof batchNewApplicationSchema;

export const newApplicationPrepSchema = z.object({
	student: z.number(),
	contract: z.number(),
	type: z.string(),
	year: z.number(),
	term: z.string()
});

export type NewApplicationPrepSchema = typeof newApplicationPrepSchema;

export const roundChangeSchema = z.object({
	id: z.number(),
	round: z.number()
});

export type RoundChangeSchema = typeof roundChangeSchema;

export const majorsUpdateSchema = z.object({
	id: z.number(),
	major_1: z.string().trim(),
	major_2: z.string().trim(),
	major_3: z.string().trim()
});

export type MajorsUpdateSchema = typeof majorsUpdateSchema;

export const trackUpdateSchema = z.object({
	id: z.number(),
	track: z.string().trim()
});

export type TrackUpdateSchema = typeof trackUpdateSchema;

export const commentsUpdateSchema = z.object({
	id: z.number(),
	comments: z.string().trim()
});

export type CommentsUpdateSchema = typeof commentsUpdateSchema;

export type StagedApplication = {
	program: ProgramListItem;
	round: ApplicationRoundListItem;
};
