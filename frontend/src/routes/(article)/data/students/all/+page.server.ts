import { fetchStudents } from '$lib/api/student';

export async function load(_) {
	return {
		students: fetchStudents()
	};
}
