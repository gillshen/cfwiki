import { createOrUpdate, get, patch, destroy } from '$lib/api/api';

export const contractTypes = ['UG Freshman', 'UG Transfer', 'Graduate', 'Other'] as const;
export type ContractType = (typeof contractTypes)[number];

export const contractStatuses = ['In effect', 'Fulfilled', 'Terminated'] as const;
export type ContractStatus = (typeof contractStatuses)[number];

export type Contract = {
	id: number;
	student: number;
	type: string;
	target_year: number;
	date: string | null;
	status: ContractStatus;
	student_progression_when_signed: string;
};

export type Service = {
	id: number;
	cfer: number;
	cf_username: string;
	role: string;
	start_date: string | null;
	end_date: string | null;
};

export type ContractDetail = Contract & {
	student_name: string;
	services: Service[];
};

export async function fetchContract(id: number): Promise<ContractDetail> {
	return await get(`contracts/${id}/`, 'Contract not found');
}

export async function createOrUpdateContract(data: any) {
	return await createOrUpdate(data, 'contracts');
}

export async function updateContract(data: any) {
	return await patch(`contracts/${data.id}/update/`, data);
}

export async function deleteContract(data: any) {
	return await destroy(`contracts/${data.id}/update/`);
}
