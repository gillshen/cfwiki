import { get, patch, post } from '$lib/api/api';
import { cfRoles } from '$lib/api/service';

export const contractTypes = ['UG Freshman', 'UG Transfer', "Master's", 'PhD'] as const;
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

export function sortServicesByRole(a: Service, b: Service) {
	const roles = Array.from(cfRoles) as string[];

	let indexA = roles.indexOf(a.role) ?? 99;
	let indexB = roles.indexOf(b.role) ?? 99;

	if (indexA === indexB) {
		return a.role.localeCompare(b.role);
	} else {
		return indexA - indexB;
	}
}
