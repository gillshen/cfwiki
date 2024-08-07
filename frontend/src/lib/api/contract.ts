import { get, patch, post } from '$lib/api/api';

export const contractTypes = ['UG Freshman', 'UG Transfer', "Master's", 'PhD'] as const;
type ContractType = (typeof contractTypes)[number];

export const contractStatuses = ['In effect', 'Fulfilled', 'Terminated'] as const;
type ContractStatus = (typeof contractStatuses)[number];

export type Contract = {
	id: number;
	student: number;
	type: string;
	target_year: number;
	date: string | null;
	status: ContractStatus;
	student_progression_when_signed: string;
};

export type ContractDetail = {
	id: number;
	student: number;
	type: string;
	target_year: number;
	date: string | null;
	status: ContractStatus;
	student_progression_when_signed: string;
	student_name: string;
};

export async function fetchContract(id: number): Promise<ContractDetail> {
	return await get(`contracts/${id}/`);
}

export async function createOrUpdateContract(data: any) {
	if (data.id) {
		return await patch(`contracts/${data.id}/update/`, data);
	} else {
		return await post('contracts/new/', data);
	}
}

export async function updateContract(data: any) {
	return await patch(`contracts/${data.id}/update/`, data);
}
