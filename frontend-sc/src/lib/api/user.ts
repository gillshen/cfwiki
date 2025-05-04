import { z } from 'zod';
import { get, patch } from '$lib/api/core';
import type { PasswordResetSchema, UserUpdateSchema } from '$lib/schemas/user';

export enum Departments {
	SALES = '咨询',
	WORK = '文案'
}

export type CfUserListItem = {
	id: number;
	username: string;
	email: string;
	is_active: boolean;
	is_staff: boolean;
	department: Departments.SALES | Departments.WORK;
	public_banner: string;
	avatar: string;
};

export type CfUserDetail = CfUserListItem;

export async function fetchCfUsers(): Promise<CfUserListItem[]> {
	return await get('users/');
}

export async function fetchUser(username: string): Promise<CfUserDetail> {
	return await get(`users/${username}/`, 'CFer not found');
}

export async function updateUser(data: z.infer<UserUpdateSchema>) {
	return await patch(`users/${data.id}/update/`, data);
}

export async function updatePassword(data: z.infer<PasswordResetSchema>) {
	return await patch(`users/${data.id}/password/`, data);
}
