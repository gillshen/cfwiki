import { createOrUpdate } from '$lib/api/api';
import type { Service } from '$lib/api/contract';

export const cfRoles = ['战略顾问', '顾问', '服务顾问', '文案', '流程顾问'] as const;

export type CfRole = (typeof cfRoles)[number];

export async function createOrUpdateService(data: any) {
	return await createOrUpdate(data, 'services');
}

export function formatCfNames(
	services: { role: string; cf_username: string }[],
	role: string
): string {
	return services
		.filter((service) => service.role === role)
		.map((service) => service.cf_username)
		.sort()
		.join(', ');
}
