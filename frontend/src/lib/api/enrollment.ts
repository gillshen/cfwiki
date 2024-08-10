import { createOrUpdate } from '$lib/api/api';

export async function createOrUpdateEnrollment(data: any) {
	return await createOrUpdate(data, 'enrollments');
}
