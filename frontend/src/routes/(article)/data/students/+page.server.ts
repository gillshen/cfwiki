import { fetchStudents, type StudentListItem } from '$lib/api/student';

export async function load(_) {
	const students: Promise<StudentListItem[]> = fetchStudents();
	return { students };
}
