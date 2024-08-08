import { get, patch, post } from '$lib/api/api';
import americanStates from '$lib/constants/americanStates';
import canadianProvinces from '$lib/constants/canadianProvinces';

import type {
	ToeflScore,
	IeltsScore,
	DuolingoScore,
	SatScore,
	ActScore,
	ApScore,
	IbGrade,
	ALevelGrade,
	GreScore,
	GmatScore,
	LsatScore
} from '$lib/api/scores';

type BaseStudent = {
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

export type Service = {
	id: number;
	cfer: number;
	cf_username: string;
	role: string;
	start_date: string | null;
	end_date: string | null;
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

export type StudentListItem = BaseStudent & { latest_contract: Contract };

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

export type StudentDetail = BaseStudent & {
	contracts_sorted: Contract[];
	enrollments: Enrollment[];
	toefl: ToeflScore[];
	ielts: IeltsScore[];
	duolingo: DuolingoScore[];
	sat: SatScore[];
	act: ActScore[];
	ap: ApScore[];
	ib: IbGrade[];
	alevel: ALevelGrade[];
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

export function formatLocation(student: BaseStudent): string {
	const { base_country, base_subnational, base_city } = student;
	if (!base_country) {
		return '';
	}
	if (!base_subnational && !base_city) {
		return base_country;
	}
	if (!base_city) {
		return base_subnational;
	}
	if (!base_subnational || base_country === 'China') {
		return base_city;
	}

	let subnationalAbbr: string;
	switch (base_country) {
		case 'United States':
			subnationalAbbr = americanStates[base_subnational];
			break;
		case 'Canada':
			subnationalAbbr = canadianProvinces[base_subnational];
			break;
		default:
			subnationalAbbr = '';
	}
	return `${base_city}, ${subnationalAbbr}`;
}
