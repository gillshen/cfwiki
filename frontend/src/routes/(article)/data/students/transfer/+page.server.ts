import type { ContractType } from '$lib/api/contract';
import { fetchStudents } from '$lib/api/student';

export async function load(_) {
	const contractType: ContractType = 'UG Transfer';
	return {
		contractType,
		students: fetchStudents({ contract_type: contractType })
	};
}
