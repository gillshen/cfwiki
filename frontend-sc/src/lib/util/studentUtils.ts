import type {
	BaseStudent,
	StudentListItem,
	Contract,
	CohortMember,
	ApSummary,
	IbSummary,
	AlevelSummary
} from '$lib/api/student';

import type { ContractType } from '$lib/api/contract';
import americanStates from '$lib/constants/americanStates';
import canadianProvinces from '$lib/constants/canadianProvinces';
import { canEdit as canEditContract } from '$lib/util/contractUtils';
import { isActive } from '$lib/util/serviceUtils';
import { compareAlevelGrade } from '$lib/util/scoresUtils';
import { lexicalChineseLast } from '$lib/util/stringUtils';
import { isDirectlyAdministered } from '$lib/constants/countries';

export const canEdit = (params: {
	user: { username: string; is_staff: boolean; is_active: boolean };
	student: { contracts: Contract[] };
}): boolean => {
	const { user, student } = params;

	if (!user.is_active) {
		return false;
	}
	// TODO uncomment in production
	// if (user.is_staff) {
	// 	return true;
	// }

	// return true if there is no contract or if the user can edit some of them
	return (
		!student.contracts.length! ||
		student.contracts.some((contract) => canEditContract({ user, contract }))
	);
};

export const isCurrentForUser = (params: {
	student: { contracts: Contract[] };
	username: string;
}): boolean => {
	const { student, username } = params;

	for (const contract of student.contracts) {
		if (contract.status !== 'In effect') {
			continue;
		}
		for (const service of contract.services) {
			if (service.cf_username === username && isActive(service)) {
				return true;
			}
		}
	}
	return false;
};

export const canCreateApplications = (student: { contracts: Contract[] }): boolean =>
	student.contracts.some((contract) => !!contract.services.length);

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
	if (!base_subnational || isDirectlyAdministered(base_city)) {
		return base_city;
	}
	if (base_country === 'China') {
		return `${base_subnational} ${base_city}`;
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

export function formatApSummary(summary: ApSummary): string {
	return _formatScoreDistribution(summary, (a, b) => b[0].localeCompare(a[0]));
}

export function formatIbSummary(summary: IbSummary): string {
	let final = '';
	if (summary.final?.scale) {
		final = `Final: ${summary.final.total}/${summary.final.scale}`;
	}
	let predicted = '';
	if (summary.predicted?.scale) {
		predicted = `Predicted: ${summary.predicted.total}/${summary.predicted.scale}`;
	}
	return [final, predicted].filter(Boolean).join('; ');
}

export function formatAlevelSummary(summary: AlevelSummary): string {
	const comparator = (a: [string, number], b: [string, number]) => compareAlevelGrade(a[0], b[0]);
	const final = _formatScoreDistribution(summary.final, comparator, 'Final: ');
	const predicted = _formatScoreDistribution(summary.predicted, comparator, 'Predicted: ');
	return [final, predicted].filter(Boolean).join('; ');
}

function _formatScoreDistribution(
	dist: Record<string, number> | undefined,
	comparator: (a: [string, number], b: [string, number]) => number,
	prefix: string = ''
): string {
	if (dist === undefined) {
		return '';
	}
	const formatted = Object.entries(dist)
		.sort(comparator)
		.map(([score, count]) => `${score} (\u00d7${count})`)
		.join(', ');
	return `${prefix}${formatted}`;
}

export const groupByTargetYear = (
	students: StudentListItem[]
): Record<string, StudentListItem[]> => {
	const grouped: Record<string, StudentListItem[]> = {};

	for (const student of students) {
		for (const contract of student.contracts) {
			const key = contract.target_year.toString();
			if (!(key in grouped)) {
				grouped[key] = [];
			}
			if (!grouped[key].includes(student)) {
				grouped[key].push(student);
			}
		}
	}

	return grouped;
};

export const groupByContractType = (
	students: StudentListItem[],
	targetYear?: number
): { [t in ContractType]?: StudentListItem[] } => {
	const grouped: { [t in ContractType]?: StudentListItem[] } = {};
	for (const student of students) {
		for (const contract of student.contracts) {
			// Exclude contracts of other years
			if (targetYear !== undefined && contract.target_year !== targetYear) {
				continue;
			}

			const contractType = contract.type;

			if (!(contractType in grouped)) {
				grouped[contractType] = [];
			}
			if (!grouped[contractType]!.includes(student)) {
				grouped[contractType]!.push(student);
			}
		}
		console.log('processed', student.fullname);
	}

	return grouped;
};

export const formatNameWithPref = (student: StudentListItem): string => {
	if (!student.preferred_name || student.preferred_name === student.given_name) {
		return student.fullname;
	} else {
		return `${student.fullname} ${student.preferred_name}`;
	}
};

export function orderByName(a: { fullname: string }, b: { fullname: string }) {
	return lexicalChineseLast(a.fullname, b.fullname);
}

export function orderByStatusName(a: CohortMember, b: CohortMember) {
	if (a.current !== b.current) {
		return a.current ? -1 : 1;
	} else {
		return orderByName(a.student, b.student);
	}
}
