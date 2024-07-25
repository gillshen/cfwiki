import { get, patch, post } from '$lib/api/api';
import americanStates from '$lib/constants/americanStates';
import canadianProvinces from '$lib/constants/canadianProvinces';

export type Contract = {
	id: number;
	type: string;
	target_year: number;
	date: string | null;
	status: 'Effective' | 'Fulfilled' | 'Terminated';
	student_initial_progression: string;
};

export type StudentListItem = {
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
	contracts_sorted: Contract[];
};

export async function fetchStudents(): Promise<StudentListItem[]> {
	return await get('students/');
}

export async function fetchStudent(id: number): Promise<StudentListItem> {
	return await get(`students/${id}/`);
}

export async function createStudent(data: any) {
	return await post(`students/new/`, data);
}

export async function updateStudent(data: any) {
	return await patch(`students/${data.id}/update/`, data);
}

export function formatLocation(student: StudentListItem): string {
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
