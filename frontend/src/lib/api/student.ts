import { get, patch, post, destroy } from '$lib/api/api';
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

export async function fetchStudents(): Promise<StudentListItem[]> {
	return await get('students/');
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
