import { get, patch, post, destroy, buildQuery } from '$lib/api/api';
import type { Service } from '$lib/api/contract';
import type { EnrollmentByStudent } from '$lib/api/enrollment';
import type { BaseGrade } from '$lib/api/grade';

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

export type ContractSummary = {
	type: string;
	target_year: number;
	status: 'In effect' | 'Fulfilled' | 'Terminated';
	services: Service[];
};

export type Contract = ContractSummary & {
	id: number;
	student: number;
	date: string | null;
	student_progression_when_signed: string;
};

export type StudentEnrollmentItem = {
	school_name: string;
	program_type: string;
	start_progression: string;
	end_progression: string;
	curriculum: string;
	grades: BaseGrade[];
};

export type ApSummary = Record<1 | 2 | 3 | 4 | 5, number>;

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

export type AlevelSummary = {
	predicted?: Record<'A*' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F', number>;
	final?: Record<'A*' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F', number>;
};

export type StudentListItem = BaseStudent & {
	contracts: ContractSummary[];
	enrollments: StudentEnrollmentItem[];
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
	ap_summary: ApSummary;
	ib_summary: IbSummary;
	alevel_summary: AlevelSummary;
};

export type StudentOfCferListItem = BaseStudent & {
	contracts: Contract[];
};

export type StudentDetail = BaseStudent & {
	contracts: Contract[];
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
): Promise<StudentOfCferListItem[]> {
	return await get(`students/per-user/${buildQuery(params)}`);
}

export async function fetchStudent(id: number): Promise<StudentDetail> {
	return await get(`students/${id}/`, 'Student not found');
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
	student: StudentOfCferListItem;
	contract: Contract;
	current: boolean;
};
