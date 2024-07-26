import { get, patch, post } from '$lib/api/api';

export type Contract = {
	id: number;
	student: number;
	type: string;
	target_year: number;
	date: string | null;
	status: 'In effect' | 'Fulfilled' | 'Terminated';
	student_progression_when_signed: string;
	student_name: string;
};

export async function fetchContract(id: number): Promise<Contract> {
	return await get(`contracts/${id}/`);
}

export async function createContract(data: any) {
	return await post(`contracts/new/`, data);
}

export async function updateContract(data: any) {
	return await patch(`contracts/${data.id}/update/`, data);
}
