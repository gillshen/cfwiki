import { z } from 'zod';

import type { ProgramListItem } from '$lib/api/program';
import type { ApplicationRoundListItem } from '$lib/api/applicationRound';

export const applicationSchema = z.object({
	id: z.number().optional(),
	_school: z.string().min(1, 'This field is required'),
	_program: z.string().min(1, 'This field is required'),
	contract: z.number().min(1, 'This field is required'),
	round: z.number().min(1, 'This field is required'),
	staff: z.number().array(),
	major_1: z.string().trim().max(100),
	major_2: z.string().trim().max(100),
	major_3: z.string().trim().max(100),
	comments: z.string().trim().max(1000),
	double_application: z.boolean().default(false)
});

export type ApplicationSchema = typeof applicationSchema;

export const newApplicationPrepSchema = z.object({
	student: z.number().min(1, 'This field is required'),
	contract: z.number().min(1, 'This field is required'),
	type: z.string().min(1, 'This field is required'),
	year: z.number().min(1, 'This field is required'),
	term: z.string().min(1, 'This field is required')
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

export const commentsUpdateSchema = z.object({
	id: z.number(),
	comments: z.string().trim()
});

export type CommentsUpdateSchema = typeof commentsUpdateSchema;

export type StagedApplication = {
	program: ProgramListItem;
	round: ApplicationRoundListItem;
};
