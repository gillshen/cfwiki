import { fetchStudent, type StudentListItem } from '$lib/api/student';
import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const student: StudentListItem = await fetchStudent(id);
	return { student };
}
