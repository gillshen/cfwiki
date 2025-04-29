import { get, patch } from '$lib/api/core';

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

export async function updateUser(data: {
	id: number;
	email?: string;
	is_active?: boolean;
	is_staff?: boolean;
	department?: string;
	public_banner?: string;
	avatar?: string;
}) {
	return await patch(`users/${data.id}/update/`, data);
}

export async function updatePassword(data: {
	id: number;
	password: string;
	repeat_password: string;
}) {
	return await patch(`users/${data.id}/password/`, data);
}
