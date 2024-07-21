import { get } from '$lib/api/api';

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
	lastname: string;
	firstname: string;
	lastname_first: boolean;
	preferred_name: string;
	gender: 'female' | 'male' | 'other';
	citizenship: string;
	date_of_birth: string | null;
	base_country: string;
	base_city: string;
	base_state: string;
	comments: string;
	fullname: string;
	contracts_sorted: Contract[];
};

export async function fetchStudents(): Promise<StudentListItem[]> {
	return await get('students/');
}
