import { get } from '$lib/api/api';

export enum Departments {
	SALES = '咨询',
	SERVICE = '文案'
}

export type CfUserListItem = {
	id: number;
	username: string;
	email: string;
	is_active: boolean;
	department: Departments.SALES | Departments.SERVICE;
	public_banner: string;
	private_banner: string;
};

export type CfUserDetail = CfUserListItem;

export async function fetchCfUsers(): Promise<CfUserListItem[]> {
	return await get('users/');
}

export async function fetchUser(username: string): Promise<CfUserDetail> {
	return await get(`users/${username}/`);
}
