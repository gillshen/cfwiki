import { z } from 'zod';
import { createOrUpdate, destroy } from '$lib/api/core';
import type { ServiceSchema } from '$lib/schemas/service';

export const CF_ROLES = ['战略顾问', '顾问', '服务顾问', '文案', '流程顾问'] as const;

export type CfRole = (typeof CF_ROLES)[number];

export async function createOrUpdateService(data: z.infer<ServiceSchema>) {
	return await createOrUpdate(data, 'services');
}

export async function deleteService(data: { id: number }) {
	return await destroy(`services/${data.id}/update/`);
}
