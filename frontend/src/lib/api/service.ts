import { post, patch } from '$lib/api/api';

export const cfRoles = ['战略顾问', '顾问', '服务顾问', '文案', '流程顾问'] as const;

export type CfRole = (typeof cfRoles)[number];

export async function createOrUpdateService(data: any) {
	if (data.id) {
		return await patch(`services/${data.id}/update/`, data);
	} else {
		return await post('services/new/', data);
	}
}
