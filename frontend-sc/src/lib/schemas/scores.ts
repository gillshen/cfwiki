import { z } from 'zod';

const common = {
	id: z.number().optional(),
	student: z.number(),
	date: z.string().nullable().default(null)
};

// TOEFL and IELTS

export const toeflSchema = z.object({
	...common,
	reading: z.number().nullable().default(null),
	listening: z.number().nullable().default(null),
	speaking: z.number().nullable().default(null),
	writing: z.number().nullable().default(null)
});

export const ieltschema = toeflSchema;

export type ToeflSchema = typeof toeflSchema;
export type IeltsSchema = typeof ieltschema;

// Duolingo

export const duolingoSchema = z.object({
	...common,
	overall: z.number().nullable().default(null),
	literacy: z.number().nullable().default(null),
	comprehension: z.number().nullable().default(null),
	conversation: z.number().nullable().default(null),
	production: z.number().nullable().default(null)
});

export type DuolingoSchema = typeof duolingoSchema;

// SAT

export const satScoreSchema = z.object({
	...common,
	ebrw: z.number().nullable().default(null),
	math: z.number().nullable().default(null),
	essay: z.number().nullable().default(null)
});

export type SatScoreSchema = typeof satScoreSchema;

// ACT

export const actScoreSchema = z.object({
	...common,
	english: z.number().nullable().default(null),
	math: z.number().nullable().default(null),
	reading: z.number().nullable().default(null),
	science: z.number().nullable().default(null),
	writing: z.number().nullable().default(null)
});

export type ActScoreSchema = typeof actScoreSchema;

// AP

export const apScoreSchema = z.object({
	...common,
	subject: z.string(),
	score: z.number().nullable().default(null)
});

export type ApScoreSchema = typeof apScoreSchema;

// IB

export const ibGradeSchema = z.object({
	...common,
	type: z.string(),
	subject: z.string(),
	grade: z.number().nullable().default(null)
});

export type IbGradeSchema = typeof ibGradeSchema;

// A-level

export const alevelGradeSchema = z.object({
	...common,
	type: z.string(),
	subject: z.string(),
	grade: z.string(),
	percentage: z.number().nullable().default(null)
});

export type AlevelGradeSchema = typeof alevelGradeSchema;

// GRE

export const greScoreSchema = z.object({
	...common,
	verbal: z.number().nullable().default(null),
	quant: z.number().nullable().default(null),
	writing: z.number().nullable().default(null)
});

export type GreScoreSchema = typeof greScoreSchema;

export const gmatScoreSchema = z.object({
	...common,
	total: z.number().nullable().default(null),
	verbal: z.number().nullable().default(null),
	quant: z.number().nullable().default(null),
	data_insights: z.number().nullable().default(null),
	reasoning: z.number().nullable().default(null),
	writing: z.number().nullable().default(null),
	is_legacy: z.boolean()
});

export type GmatScoreSchema = typeof gmatScoreSchema;

export const lsatScoreSchema = z.object({
	...common,
	score: z.number().nullable().default(null)
});

export type LsatScoreSchema = typeof lsatScoreSchema;
