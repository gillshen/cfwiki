import type { ContractType } from '$lib/api/contract.js';
import { fetchStudents } from '$lib/api/student';

export async function load(_) {
	const contractType: ContractType = 'UG Freshman';
	return {
		contractType,
		students: fetchStudents({ contract_type: contractType })
	};
}
