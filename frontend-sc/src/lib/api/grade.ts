import { z } from 'zod';
import { createOrUpdate, destroy } from '$lib/api/core';
import type { GradeSchema } from '$lib/schemas/grade';

export type BaseGrade = {
	progression: string;
	term: string;
	value: number | null;
	scale: number | null;
	is_cumulative: boolean;
	comments: string;
};

export type Grade = BaseGrade & {
	id: number;
	enrollment: number;
	is_weighted: boolean;
};

export async function createOrUpdateGrade(data: z.infer<GradeSchema>) {
	return createOrUpdate(data, 'grades');
}

export async function deleteGrade(data: { id: number }) {
	return destroy(`grades/${data.id}/update/`);
}
