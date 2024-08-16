import { createOrUpdate, destroy } from '$lib/api/api';

export type Grade = {
	id: number;
	enrollment: number;
	progression: string;
	term: string;
	value: number;
	scale: number;
	is_cumulative: boolean;
	comments: string;
};

export async function createOrUpdateGrade(data: any) {
	return createOrUpdate(data, 'grades');
}

export async function deleteGrade(data: any) {
	return destroy(`grades/${data.id}/update/`);
}

export type GroupedGrades = Record<string, Grade[]>;
