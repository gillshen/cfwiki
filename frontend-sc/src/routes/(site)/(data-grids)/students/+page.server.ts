import { fetchStudents } from '$lib/api/student';

export async function load({ url }) {
	const cfer = url.searchParams.get('cfer');
	const contract_type = url.searchParams.get('contractType');
	const target_year = url.searchParams.get('targetYear');
	const contract_status = url.searchParams.get('contractStatus');

	return {
		students: fetchStudents({ cfer, target_year, contract_type, contract_status })
	};
}
