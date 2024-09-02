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

export type ApCount = {
	score: 1 | 2 | 3 | 4 | 5;
	count: number;
};

export type IbSummary = {
	predicted?: {
		total: number;
		scale: number;
	};
	final?: {
		total: number;
		scale: number;
	};
};

export type AlevelCount = {
	type: 'predicted' | 'final';
	grade: 'A*' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
	count: number;
};

export type StudentListItem = BaseStudent & {
	latest_contract: Contract;
	scores: {
		best_toefl?: number;
		best_ielts?: number;
		best_duolingo?: number;
		super_sat?: number;
		super_act?: number;
		best_gre?: number;
		best_gmat?: number;
		best_lsat?: number;
	};
	ap_summary: ApCount[];
	ib_summary: IbSummary[];
	alevel_summary: AlevelCount[];
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

export async function fetchStaffList(id: number): Promise<{ staff_names: string[] }> {
	return await get(`students/${id}/staff/`);
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
