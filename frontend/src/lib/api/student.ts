import { get, patch, post, destroy, buildQuery } from '$lib/api/api';
import type { Service } from '$lib/api/contract';
import type { EnrollmentByStudent } from '$lib/api/enrollment';

import type {
	ToeflScore,
	IeltsScore,
	DuolingoScore,
	SatScore,
	ActScore,
	ApScore,
	IbGrade,
	AlevelGrade,
	GreScore,
	GmatScore,
	LsatScore
} from '$lib/api/scores';

export type BaseStudent = {
	id: number;
	surname: string;
	given_name: string;
	surname_first: boolean;
	preferred_name: string;
	gender: 'female' | 'male' | 'other';
	citizenship: string;
	date_of_birth: string | null;
	base_country: string;
	base_subnational: string;
	base_city: string;
	comments: string;
	fullname: string;
};

export type Contract = {
	id: number;
	student: number;
	type: string;
	target_year: number;
	date: string | null;
	status: 'In effect' | 'Fulfilled' | 'Terminated';
	student_progression_when_signed: string;
	services: Service[];
};

export type StudentListItem = BaseStudent & {
	latest_contract: Contract;
	best_toefl: number | null;
	best_ielts: number | null;
	best_duolingo: number | null;
	super_sat: number | null;
	super_act: number | null;
	best_gre: number | null;
	best_gmat: number | null;
	best_lsat: number | null;
};

export type StudentByUserListItem = BaseStudent & {
	contracts_sorted: Contract[];
};

export type StudentDetail = BaseStudent & {
	contracts_sorted: Contract[];
	enrollments: EnrollmentByStudent[];
	toefl: ToeflScore[];
	ielts: IeltsScore[];
	duolingo: DuolingoScore[];
	sat: SatScore[];
	act: ActScore[];
	ap: ApScore[];
	ib: IbGrade[];
	alevel: AlevelGrade[];
	gre: GreScore[];
	gmat: GmatScore[];
	lsat: LsatScore[];
};

export async function fetchStudents(params?: Record<string, any>): Promise<StudentListItem[]> {
	return await get(`students/${buildQuery(params)}`);
}

export async function fetchStudentsByUser(
	params?: Record<string, any>
): Promise<StudentByUserListItem[]> {
	return await get(`students-by-user/${buildQuery(params)}`);
}

export async function fetchStudent(id: number): Promise<StudentDetail> {
	return await get(`students/${id}/`);
}

export async function createStudent(data: any) {
	return await post(`students/new/`, data);
}

export async function updateStudent(data: any) {
	return await patch(`students/${data.id}/update/`, data);
}

export async function deleteStudent(data: any) {
	return await destroy(`students/${data.id}/update/`);
}

export type CohortMember = {
	student: StudentByUserListItem;
	contract: Contract;
	current: boolean;
};
