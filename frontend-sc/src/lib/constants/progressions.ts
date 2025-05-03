export const contractTerms = ['Fall', 'Spring', 'Summer'];

export const academicTerms = ['Fall', 'Winter', 'Spring', 'Summer'];

export const gradingPeriods = ['Fall', 'Winter', 'Spring', 'Summer', 'Year'];

export const termOrder: Record<string, number> = {
	Fall: 0,
	Winter: 1,
	Spring: 2,
	Summer: 3,
	Year: 4
} as const;

export const universityProgressions = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];

export const secondaryProgressions = ['G7', 'G8', 'G9', 'G10', 'G11', 'G12'];

export const allProgressions = [...secondaryProgressions, ...universityProgressions];

const _withTerms = (progressions: string[], terms: string[]): string[] =>
	progressions.flatMap((year) => terms.map((term) => `${year} ${term}`));

export const universityProgsWithContractTerms = _withTerms(universityProgressions, contractTerms);

export const secondaryProgsWithContractTerms = _withTerms(secondaryProgressions, contractTerms);

export const allProgsWithContractTerms = [
	...secondaryProgsWithContractTerms,
	...universityProgsWithContractTerms
];
