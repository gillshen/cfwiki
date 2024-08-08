import { post, patch } from '$lib/api/api';

export async function createOrUpdateEnrollment(data: any) {
	if (data.id) {
		return await patch(`enrollments/${data.id}/update/`, data);
	} else {
		return await post('enrollments/new/', data);
	}
}
