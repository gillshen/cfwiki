import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { fetchStudent, type StudentListItem } from '$lib/api/student';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const student: StudentListItem = await fetchStudent(id);

	if (student?.id === undefined) {
		throw error(404, 'Student not found');
	}

	return { student };
}
