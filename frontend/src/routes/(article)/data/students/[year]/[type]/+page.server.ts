import type { PageServerLoadEvent } from './$types';
import { fetchStudents } from '$lib/api/student';
import { error } from '@sveltejs/kit';

import type { ContractType } from '$lib/api/contract';
import { slugToType } from '$lib/utils/contractUtils';

export async function load(event: PageServerLoadEvent) {
	const targetYear = parseInt(event.params.year, 10);

	if (isNaN(targetYear)) {
		throw error(404, 'Invalid year');
	}

	let contractType: ContractType;

	try {
		contractType = slugToType(event.params.type);
	} catch (err) {
		throw error(404, 'Invalid contract type');
	}

	return {
		targetYear,
		contractType,
		students: fetchStudents({ target_year: targetYear, contract_type: contractType })
	};
}
