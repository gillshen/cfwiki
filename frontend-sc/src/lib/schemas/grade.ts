import { z } from 'zod';

export const gradeSchema = z
	.object({
		id: z.number().optional(),
		enrollment: z.number().min(1, 'This field is required'),
		progression: z.string().min(1, 'This field is required').max(50),
		term: z.string().min(1, 'This field is required').max(20),
		value: z.number(),
		scale: z.number(),
		is_weighted: z.boolean(),
		is_cumulative: z.boolean(),
		comments: z.string().trim().max(500)
	})
	.refine((data) => !!data.comments || (!!data.value && !!data.scale), {
		message: 'This field is required',
		// Indicates which field the error is associated with
		// but seems to accept only one value at a time
		path: ['value']
	})
	.refine((data) => !!data.comments || (!!data.value && !!data.scale), {
		message: 'This field is required',
		path: ['scale']
	})
	.refine((data) => !!data.comments || (!!data.value && !!data.scale), {
		message: 'This field is required',
		path: ['comments']
	});

export type GradeSchema = typeof gradeSchema;
