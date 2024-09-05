import { createOrUpdate, destroy } from '$lib/api/api';

export type BaseGrade = {
	progression: string;
	term: string;
	value: number;
	scale: number;
	is_cumulative: boolean;
	comments: string;
};

export type Grade = BaseGrade & {
	id: number;
	enrollment: number;
	is_weighted: boolean;
};

export async function createOrUpdateGrade(data: any) {
	return createOrUpdate(data, 'grades');
}

export async function deleteGrade(data: any) {
	return destroy(`grades/${data.id}/update/`);
}

export type GroupedGrades = Record<string, Grade[]>;
