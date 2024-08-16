import type { BaseStudent } from '$lib/api/student';
import americanStates from '$lib/constants/americanStates';
import canadianProvinces from '$lib/constants/canadianProvinces';

export function formatGender(student: BaseStudent): string {
	switch (student.gender) {
		case 'female':
			return 'Female';
		case 'male':
			return 'Male';
		default:
			return student.gender;
	}
}

export function formatLocation(student: BaseStudent): string {
	const { base_country, base_subnational, base_city } = student;
	if (!base_country) {
		return '';
	}
	if (!base_subnational && !base_city) {
		return base_country;
	}
	if (!base_city) {
		return base_subnational;
	}
	if (!base_subnational || base_country === 'China') {
		return base_city;
	}

	let subnationalAbbr: string;
	switch (base_country) {
		case 'United States':
			subnationalAbbr = americanStates[base_subnational];
			break;
		case 'Canada':
			subnationalAbbr = canadianProvinces[base_subnational];
			break;
		default:
			subnationalAbbr = '';
	}
	return `${base_city}, ${subnationalAbbr}`;
}
