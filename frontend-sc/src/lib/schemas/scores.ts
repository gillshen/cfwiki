import { z } from 'zod';

const common = {
	id: z.number().optional(),
	student: z.number().min(1, 'This field is required'),
	date: z.string().nullable().default(null)
};

// TOEFL

export const toeflSchema = z.object({
	...common,
	reading: z.number().min(0).max(30).step(1, 'Number must be an integer').nullable().default(null),
	listening: z
		.number()
		.min(0)
		.max(30)
		.step(1, 'Number must be an integer')
		.nullable()
		.default(null),
	speaking: z.number().min(0).max(30).step(1, 'Number must be an integer').nullable().default(null),
	writing: z.number().min(0).max(30).step(1, 'Number must be an integer').nullable().default(null)
});

export type ToeflSchema = typeof toeflSchema;

// IELTS

export const ieltschema = z.object({
	...common,
	reading: z.number().min(0).max(9).step(0.5).nullable().default(null),
	listening: z.number().min(0).max(9).step(0.5).nullable().default(null),
	speaking: z.number().min(0).max(9).step(0.5).nullable().default(null),
	writing: z.number().min(0).max(9).step(0.5).nullable().default(null)
});

export type IeltsSchema = typeof ieltschema;

// Duolingo

export const duolingoSchema = z.object({
	...common,
	overall: z.number().min(10).max(160).step(5).nullable().default(null),
	literacy: z.number().min(10).max(160).step(5).nullable().default(null),
	comprehension: z.number().min(10).max(160).step(5).nullable().default(null),
	conversation: z.number().min(10).max(160).step(5).nullable().default(null),
	production: z.number().min(10).max(160).step(5).nullable().default(null)
});

export type DuolingoSchema = typeof duolingoSchema;

// SAT

export const satScoreSchema = z.object({
	...common,
	ebrw: z.number().min(200).max(800).step(10).nullable().default(null),
	math: z.number().min(200).max(800).step(10).nullable().default(null)
});

export type SatScoreSchema = typeof satScoreSchema;

// ACT

export const actScoreSchema = z.object({
	...common,
	english: z.number().min(1).max(36).step(1, 'Number must be an integer').nullable().default(null),
	math: z.number().min(1).max(36).step(1, 'Number must be an integer').nullable().default(null),
	reading: z.number().min(1).max(36).step(1, 'Number must be an integer').nullable().default(null),
	science: z.number().min(1).max(36).step(1, 'Number must be an integer').nullable().default(null),
	writing: z.number().min(1).max(12).step(1, 'Number must be an integer').nullable().default(null)
});

export type ActScoreSchema = typeof actScoreSchema;

// AP

export const apScoreSchema = z.object({
	...common,
	subject: z.string().min(1, 'This field is required'),
	score: z.number().min(1).max(5).step(1, 'Number must be an integer').nullable().default(null)
});

export type ApScoreSchema = typeof apScoreSchema;

// IB

export const ibGradeSchema = z.object({
	...common,
	type: z.string().min(1, 'This field is required'),
	subject: z.string().min(1, 'This field is required'),
	grade: z.number().min(1).max(7).step(1, 'Number must be an integer').nullable().default(null)
});

export type IbGradeSchema = typeof ibGradeSchema;

// A-level

export const alevelGradeSchema = z.object({
	...common,
	type: z.string().min(1, 'This field is required'),
	subject: z.string().min(1, 'This field is required'),
	grade: z.string(), // trustworthy input from combobox
	percentage: z
		.number()
		.min(0)
		.max(100)
		.step(1, 'Number must be an integer')
		.nullable()
		.default(null)
});

export type AlevelGradeSchema = typeof alevelGradeSchema;

// GRE

export const greScoreSchema = z.object({
	...common,
	verbal: z
		.number()
		.min(130)
		.max(170)
		.step(1, 'Number must be an integer')
		.nullable()
		.default(null),
	quant: z.number().min(130).max(170).step(1, 'Number must be an integer').nullable().default(null),
	writing: z.number().min(0).max(6).step(0.5).nullable().default(null)
});

export type GreScoreSchema = typeof greScoreSchema;

export const gmatScoreSchema = z
	.object({
		...common,
		total: z.number().nullable().default(null),
		verbal: z.number().step(1, 'Number must be an integer').nullable().default(null),
		quant: z.number().step(1, 'Number must be an integer').nullable().default(null),
		data_insights: z
			.number()
			.min(60)
			.max(90)
			.step(1, 'Number must be an integer')
			.nullable()
			.default(null),
		reasoning: z
			.number()
			.min(1)
			.max(8)
			.step(1, 'Number must be an integer')
			.nullable()
			.default(null),
		writing: z.number().min(0).max(6).step(0.5).nullable().default(null),
		is_legacy: z.boolean().default(false)
	})
	// check total score range
	.refine(
		(data) => data.total === null || !data.is_legacy || (data.total >= 200 && data.total <= 800),
		{
			message: 'Number must be between 200 and 800',
			path: ['total']
		}
	)
	.refine(
		(data) => data.total === null || data.is_legacy || (data.total >= 205 && data.total <= 805),
		{
			message: 'Number must be between 205 and 805',
			path: ['total']
		}
	)
	// check total score step
	.refine((data) => data.total === null || !data.is_legacy || data.total % 10 === 0, {
		message: 'Number must be a multiple of 10',
		path: ['total']
	})
	.refine((data) => data.total === null || data.is_legacy || data.total % 5 === 0, {
		message: 'Number must be a multiple of 5',
		path: ['total']
	})
	// check verbal score range
	.refine(
		(data) => data.verbal === null || !data.is_legacy || (data.verbal >= 6 && data.verbal <= 51),
		{ message: 'Number must be between 6 and 51', path: ['verbal'] }
	)
	.refine(
		(data) => data.verbal === null || data.is_legacy || (data.verbal >= 60 && data.verbal <= 90),
		{ message: 'Number must be between 60 and 90', path: ['verbal'] }
	)
	// check quant score range
	.refine(
		(data) => data.quant === null || !data.is_legacy || (data.quant >= 6 && data.quant <= 51),
		{ message: 'Number must be between 6 and 51', path: ['quant'] }
	)
	.refine(
		(data) => data.quant === null || data.is_legacy || (data.quant >= 60 && data.quant <= 90),
		{ message: 'Number must be between 60 and 90', path: ['quant'] }
	);

export type GmatScoreSchema = typeof gmatScoreSchema;

export const lsatScoreSchema = z.object({
	...common,
	score: z.number().min(120).max(180).step(1, 'Number must be an integer').nullable().default(null)
});

export type LsatScoreSchema = typeof lsatScoreSchema;
