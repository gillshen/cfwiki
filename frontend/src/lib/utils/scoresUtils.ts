import type { ToeflScore, IeltsScore, SatScore, ActScore, GreScore } from '$lib/api/scores';

export function toeflOverall(score: ToeflScore): number | null {
	if (
		score.reading === null ||
		score.listening === null ||
		score.speaking === null ||
		score.writing === null
	) {
		return null;
	} else {
		return score.reading + score.listening + score.speaking + score.writing;
	}
}

export function ieltsOverall(score: IeltsScore): number | null {
	if (
		score.reading === null ||
		score.listening === null ||
		score.speaking === null ||
		score.writing === null
	) {
		return null;
	}

	const total =
		Number(score.reading) +
		Number(score.listening) +
		Number(score.speaking) +
		Number(score.writing);

	const average = total / 4;
	return Math.round(average * 2) / 2;
}

export function satOverall(score: SatScore): number | null {
	if (score.ebrw === null || score.math === null) {
		return null;
	} else {
		return score.ebrw + score.math;
	}
}

export function actOverall(score: ActScore): number | null {
	if (
		score.math === null ||
		score.science === null ||
		score.english === null ||
		score.reading === null
	) {
		return null;
	}
	const total = score.math + score.science + score.english + score.reading;
	return Math.round(total / 4);
}

export function greOverall(score: GreScore): number | null {
	if (score.verbal === null || score.quant === null) {
		return null;
	} else {
		return score.verbal + score.quant;
	}
}

function toPercentage(
	score: number | null,
	minScore: number,
	maxScore: number,
	magicFactor: number = 1.7
	// larger factor -> steeper curve at the high end
): number {
	if (score === null) {
		return 0;
	}
	const normalizedScore = (score - minScore) / (maxScore - minScore);
	return Math.pow(normalizedScore, magicFactor) * 100;
}

export function toeflSubToPercentage(score: number | null): number {
	return toPercentage(score, 0, 30);
}

export function ieltsSubToPercentage(score: number | null): number {
	return toPercentage(score, 0, 9, 1.2);
}

export function duolingoToPercentage(score: number | null): number {
	return toPercentage(score, 10, 160);
}

export function satSubToPercentage(score: number | null): number {
	return toPercentage(score, 200, 800);
}

export function satEssayToPercentage(score: number | null): number {
	return toPercentage(score, 2, 8, 1.2);
}

export function actSubToPercentage(score: number | null): number {
	return toPercentage(score, 1, 36);
}

export function actWritingToPercentage(score: number | null): number {
	return toPercentage(score, 2, 12, 1.2);
}

export function greSubToPercentage(score: number | null): number {
	return toPercentage(score, 130, 170);
}

export function greWritingToPercentage(score: number | null): number {
	return toPercentage(score, 0, 6, 1.2);
}

export function gmatSubToPercentage(score: number | null): number {
	return toPercentage(score, 60, 90, 1.2);
}

export function gmatLegacySubToPercentage(score: number | null): number {
	return toPercentage(score, 0, 60);
}

export function gmatReasoningToPercentage(score: number | null): number {
	return toPercentage(score, 0, 8, 1.2);
}

export function gmatWritingToPercentage(score: number | null): number {
	return toPercentage(score, 0, 6, 1.2);
}

export function lsatToPercentage(score: number | null): number {
	return toPercentage(score, 120, 180, 1.2);
}
