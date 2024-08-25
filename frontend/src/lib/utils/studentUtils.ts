import type { BaseStudent, StudentByUserListItem, Contract, CohortMember } from '$lib/api/student';
import americanStates from '$lib/constants/americanStates';
import canadianProvinces from '$lib/constants/canadianProvinces';
import { isActive } from '$lib/utils/serviceUtils';

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

export function groupByTargetYear(
	username: string,
	students: StudentByUserListItem[]
): Record<string, CohortMember[]> {
	const groupedStudents: Record<string, CohortMember[]> = {};

	for (const student of students) {
		for (const contract of student.contracts_sorted) {
			const status = _getServiceStatus(username, contract);

			if (status !== 'never') {
				const key = contract.target_year.toString();
				if (!groupedStudents[key]) {
					groupedStudents[key] = [];
				}
				groupedStudents[key].push({ student, contract, current: status === 'current' });
			}
		}
	}

	const sortedGroups: Record<string, CohortMember[]> = {};
	const sortedGroupKeys = Object.keys(groupedStudents).sort(
		(a, b) => parseInt(b, 10) - parseInt(a, 10)
	);

	for (const key of sortedGroupKeys) {
		// Add a trailing space to prevent JS from reordering the keys
		sortedGroups[`${key} `] = groupedStudents[key];
	}
	return sortedGroups;
}

function _getServiceStatus(username: string, contract: Contract): 'current' | 'past' | 'never' {
	const statuses = [];

	// A cfer may work in multiple roles on the same contract,
	// so the overall status would be 'past' only if all roles have ended
	for (const service of contract.services) {
		if (service.cf_username === username) {
			const roleStatus = contract.status === 'In effect' && isActive(service) ? 'current' : 'past';
			statuses.push(roleStatus);
		}
	}

	if (!statuses.length) {
		return 'never';
	}
	return statuses.includes('current') ? 'current' : 'past';
}

export function categorize(cohort: CohortMember[]): {
	'UG Freshman': CohortMember[];
	'UG Transfer': CohortMember[];
	Graduate: CohortMember[];
} {
	const ugFreshman: CohortMember[] = [];
	const ugTransfer: CohortMember[] = [];
	const graduate: CohortMember[] = [];

	for (const member of cohort) {
		switch (member.contract.type) {
			case 'UG Freshman':
				ugFreshman.push(member);
				break;
			case 'UG Transfer':
				ugTransfer.push(member);
				break;
			default:
				graduate.push(member);
		}
	}

	return {
		'UG Freshman': ugFreshman,
		'UG Transfer': ugTransfer,
		Graduate: graduate
	};
}

export function orderByName(a: { fullname: string }, b: { fullname: string }) {
	return a.fullname.localeCompare(b.fullname, 'zh-CN');
}

export function orderByStatusName(a: CohortMember, b: CohortMember) {
	if (a.current !== b.current) {
		return a.current ? -1 : 1;
	} else {
		return orderByName(a.student, b.student);
	}
}
