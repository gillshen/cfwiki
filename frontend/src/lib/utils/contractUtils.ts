import type { ContractType } from '$lib/api/contract';

export function slugToContractType(slug: string): ContractType {
	switch (slug) {
		case 'freshman':
			return 'UG Freshman';
		case 'transfer':
			return 'UG Transfer';
		case 'graduate':
			return 'Graduate';
		case 'other':
			return 'Other';
		default:
			throw new Error(`No contract type matches ${slug}`);
	}
}

export function contractTypeToSlug(
	contractType: ContractType
): 'freshman' | 'transfer' | 'graduate' | 'other' {
	switch (contractType) {
		case 'UG Freshman':
			return 'freshman';
		case 'UG Transfer':
			return 'transfer';
		case 'Graduate':
			return 'graduate';
		case 'Other':
			return 'other';
		default:
			throw new Error(`Invalid contract type: ${contractType}`);
	}
}
