import { get, createOrUpdate, destroy, buildQuery } from '$lib/api/api';
import type { Grade } from '$lib/api/grade';
import type { ContractStatus } from '$lib/api/contract';

export type BaseEnrollment = {
	id: number;
	student: number;
	school: { id: number; type: string; name: string; alt_name: string; country: string };
	program_type: string;
	start_date: string;
	start_progression: string;
	end_date: string | null;
	end_progression: string;
	curriculum: string;
};

export type EnrollmentListItem = BaseEnrollment & {
	student: {
		id: number;
		fullname: string;
		gender: string;
		citizenship: string;
		contracts: { status: ContractStatus }[];
	};
};

export type EnrollmentByStudent = BaseEnrollment & {
	grades: Grade[];
};

export type EnrollmentDetail = EnrollmentByStudent & {
	student: { id: number; fullname: string };
};

export async function fetchEnrollments(
	params?: Record<string, any>
): Promise<EnrollmentListItem[]> {
	const queryString = buildQuery(params);
	return await get(`enrollments/${queryString}`);
}

export async function fetchEnrollment(id: number): Promise<EnrollmentDetail> {
	return await get(`enrollments/${id}/`, 'Educational experience not found');
}

export async function createOrUpdateEnrollment(data: any) {
	return await createOrUpdate(data, 'enrollments');
}

export async function deleteEnrollment(data: any) {
	return await destroy(`enrollments/${data.id}/update/`);
}

export const progressionOrder: Record<string, number> = {
	G7: 0,
	G8: 1,
	G9: 2,
	G10: 3,
	G11: 4,
	G12: 5,
	'Year 1': 6,
	'Year 2': 7,
	'Year 3': 8,
	'Year 4': 9,
	'Year 5': 10
} as const;
