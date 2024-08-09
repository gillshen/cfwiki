import { patch } from '$lib/api/api';

export async function updateApplicationRound(data: {
	id: number;
	name?: string;
	due_date?: string | null;
	due_time?: string | null;
	timezone?: string;
	decision_date?: string | null;
}) {
	return await patch(`application-rounds/${data.id}/update/`, data);
}
