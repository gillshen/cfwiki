import { get } from '$lib/api/api';

export type StudentListItem = {
	id: number;
	fullname: string;
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
};

export async function fetchStudents(): Promise<StudentListItem[]> {
	return await get('students/');
}
