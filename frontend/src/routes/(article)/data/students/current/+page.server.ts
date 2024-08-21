import { fetchStudents } from '$lib/api/student';

export async function load(_) {
	return {
		current: true,
		students: fetchStudents({ contract_status: 'In effect' })
	};
}
