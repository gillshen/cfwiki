export const CONTRACT_TERMS = ['Fall', 'Spring', 'Summer'] as const;

export const ACADEMIC_TERMS = ['Fall', 'Winter', 'Spring', 'Summer'] as const;

export const GRADING_PERIODS = ['Fall', 'Winter', 'Spring', 'Summer', 'Year'] as const;

export const TERM_ORDER: Record<string, number> = {
	Fall: 0,
	Winter: 1,
	Spring: 2,
	Summer: 3,
	Year: 4
} as const;

export const UNIVERSITY_PROGRESSIONS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'] as const;

export const SECONDARY_PROGRESSIONS = ['G7', 'G8', 'G9', 'G10', 'G11', 'G12'] as const;

export const ALL_PROGRESSIONS = [...SECONDARY_PROGRESSIONS, ...UNIVERSITY_PROGRESSIONS] as const;

const _withTerms = (progressions: string[], terms: string[]): string[] =>
	progressions.flatMap((year) => terms.map((term) => `${year} ${term}`));

export const universityProgsWithContractTerms = _withTerms(
	[...UNIVERSITY_PROGRESSIONS],
	[...CONTRACT_TERMS]
);

export const secondaryProgsWithContractTerms = _withTerms(
	[...SECONDARY_PROGRESSIONS],
	[...CONTRACT_TERMS]
);

export const allProgsWithContractTerms = [
	...secondaryProgsWithContractTerms,
	...universityProgsWithContractTerms
];
