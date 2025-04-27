import { fetchStudents } from '$lib/api/student';

export async function load() {
	return {
		students: fetchStudents()
	};
}
