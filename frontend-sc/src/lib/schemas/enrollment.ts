import { z } from 'zod';

const commonEnrollmentFields = {
	start_date: z.string().min(1, 'This field is required'),
	start_progression: z.string(),
	end_date: z.string().nullable().default(null),
	end_progression: z.string(),
	curriculum: z.string()
};

export const commonEnrollmentSchema = z.object(commonEnrollmentFields);

export type CommonEnrollmentSchema = typeof commonEnrollmentSchema;

export const newEnrollmentSchema = z.object({
	student: z.number().min(1, 'This field is required'),
	_school_type: z.string().min(1, 'This field is required'),
	_school: z.string().min(1, 'This field is required'),
	school: z.number().min(1, 'This field is required'),
	program_type: z.string().min(1, 'This field is required'),
	...commonEnrollmentFields
});

export type NewEnrollmentSchema = typeof newEnrollmentSchema;

export const enrollmentUpdateSchema = z.object({
	id: z.number().min(1, 'This field is required'),
	...commonEnrollmentFields
});

export type EnrollmentUpdateSchema = typeof enrollmentUpdateSchema;
