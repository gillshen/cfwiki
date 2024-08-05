export const ugFreshmanRounds = [
	'ED1',
	'ED2',
	'EA1',
	'EA2',
	'REA',
	'RD',
	'Priority',
	'Rolling'
] as const;

export const ugTransferRounds = ['ED', 'RD', 'Rolling'] as const;

export const defaultRounds = [
	'Priority',
	'Regular',
	'Round 1',
	'Round 2',
	'Round 3',
	'Round 4',
	'Round 5',
	'Rolling'
] as const;

export function getRoundNames(programType: string): string[] {
	switch (programType) {
		case 'UG Freshman':
			return Array.from(ugFreshmanRounds);
		case 'UG Transfer':
			return Array.from(ugTransferRounds);
		default:
			return Array.from(defaultRounds);
	}
}
