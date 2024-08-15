import { get, createOrUpdate, destroy, buildQuery } from '$lib/api/api';
import type { Grade } from '$lib/api/grade';
import type { ContractStatus } from './contract';

type BaseEnrollment = {
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
		latest_contract: { status: ContractStatus };
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
	return await get(`enrollments/${id}/`);
}

export async function createOrUpdateEnrollment(data: any) {
	return await createOrUpdate(data, 'enrollments');
}

export async function deleteEnrollment(data: any) {
	return await destroy(`enrollments/${data.id}/update/`);
}
