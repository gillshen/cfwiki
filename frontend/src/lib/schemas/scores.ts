import { z } from 'zod';

const common = {
	id: z.number(),
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

export type ToeflSchema = typeof toeflSchema;

export const newToeflSchema = toeflSchema.extend({
	id: toeflSchema.shape.id.optional()
});

export type NewToeflSchema = typeof newToeflSchema;

export const ieltsSchema = toeflSchema;

export type IeltsSchema = typeof ieltsSchema;

export const newIeltschema = newToeflSchema;

export type NewIeltsSchema = typeof newIeltschema;

// SAT

export const satSchema = z.object({
	...common,
	ebrw: z.number().nullable().default(null),
	math: z.number().nullable().default(null),
	essay: z.number().nullable().default(null)
});

export type SatSchema = typeof satSchema;

export const newSatSchema = satSchema.extend({
	id: satSchema.shape.id.optional()
});

export type NewSatSchema = typeof newSatSchema;

// ACT

export const actSchema = z.object({
	...common,
	english: z.number().nullable().default(null),
	math: z.number().nullable().default(null),
	reading: z.number().nullable().default(null),
	science: z.number().nullable().default(null),
	writing: z.number().nullable().default(null)
});

export type ActSchema = typeof actSchema;

export const newActSchema = actSchema.extend({
	id: actSchema.shape.id.optional()
});

export type NewActSchema = typeof newActSchema;

// GRE

export const greSchema = z.object({
	...common,
	verbal: z.number().nullable().default(null),
	quant: z.number().nullable().default(null),
	writing: z.number().nullable().default(null)
});

export type GreSchema = typeof greSchema;

export const newGreSchema = greSchema.extend({
	id: greSchema.shape.id.optional()
});

export type NewGreSchema = typeof newGreSchema;
