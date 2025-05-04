import { z } from 'zod';

import { get, buildQuery, post, patch, destroy } from '$lib/api/core';
import type { EnrollmentUpdateSchema, NewEnrollmentSchema } from '$lib/schemas/enrollment';
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

export async function fetchEnrollments(params?: {
	school?: number;
	program_type?: string;
}): Promise<EnrollmentListItem[]> {
	const queryString = buildQuery(params);
	return await get(`enrollments/${queryString}`);
}

export async function fetchEnrollment(id: number): Promise<EnrollmentDetail> {
	return await get(`enrollments/${id}/`, 'Educational experience not found');
}

export async function createEnrollment(data: z.infer<NewEnrollmentSchema>) {
	return await post(`enrollments/new/`, data);
}

export async function updateEnrollment(data: z.infer<EnrollmentUpdateSchema>) {
	return await patch(`enrollments/${data.id}/update/`, data);
}

export async function deleteEnrollment(data: { id: number }) {
	return await destroy(`enrollments/${data.id}/update/`);
}
