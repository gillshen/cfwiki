import { error } from '@sveltejs/kit';
import { fetchStudent, type StudentDetail } from '$lib/api/student';

export async function load(event) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid student ID');
	}

	const student: StudentDetail = await fetchStudent(id);

	return { student };
}
