import { fetchStudents, type StudentListItem } from '$lib/api/student';

export async function load(event) {
	const students: StudentListItem[] = await fetchStudents();
	return { students };
}
