import { get, createOrUpdate } from '$lib/api/api';
import type { Grade } from '$lib/api/grade';

export type Enrollment = {
	id: number;
	student: number;
	school: { id: number; type: string; name: string; alt_name: string; country: string };
	program_type: string;
	start_date: string;
	start_progression: string;
	end_date: string | null;
	end_progression: string;
	curriculum: string;
	grades: Grade[];
};

export type EnrollmentDetail = Enrollment & {
	student: { id: number; fullname: string };
};

export async function fetchEnrollment(id: number): Promise<EnrollmentDetail> {
	return await get(`enrollments/${id}/`);
}

export async function createOrUpdateEnrollment(data: any) {
	return await createOrUpdate(data, 'enrollments');
}
