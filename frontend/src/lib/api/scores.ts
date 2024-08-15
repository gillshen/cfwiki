import { createOrUpdate, destroy } from '$lib/api/api';

type BaseScore = {
	id: number;
	student: number;
	date: string | null;
};

export type ToeflScore = BaseScore & {
	reading: number | null;
	listening: number | null;
	speaking: number | null;
	writing: number | null;
};

export type IeltsScore = ToeflScore;

export type DuolingoScore = BaseScore & {
	overall: number | null;
	literacy: number | null;
	comprehension: number | null;
	conversation: number | null;
	production: number | null;
};

export type SatScore = BaseScore & {
	ebrw: number | null;
	math: number | null;
	essay: number | null;
};

export type ActScore = BaseScore & {
	math: number | null;
	science: number | null;
	english: number | null;
	reading: number | null;
	writing: number | null;
};

export type ApScore = BaseScore & {
	subject: string;
	score: number | null;
};

export type IbGrade = BaseScore & {
	type: 'predicted' | 'final';
	subject: string;
	grade: number | null;
};

export type AlevelGrade = BaseScore & {
	type: 'predicted' | 'final';
	subject: string;
	percentage: number | null;
	grade: string;
};

export type GreScore = BaseScore & {
	verbal: number | null;
	quant: number | null;
	writing: number | null;
};

export type GmatScore = BaseScore & {
	total: number | null;
	verbal: number | null;
	quant: number | null;
	reasoning: number | null;
	writing: number | null;
};

export type LsatScore = BaseScore & {
	score: number | null;
};

export async function createOrUpdateToeflScore(data: any) {
	return await createOrUpdate(data, 'toefl');
}

export async function deleteToeflScore(data: any) {
	return await destroy(`toefl/${data.id}/update`);
}

export async function createOrUpdateIeltsScore(data: any) {
	return await createOrUpdate(data, 'ielts');
}

export async function deleteIeltsScore(data: any) {
	return await destroy(`ielts/${data.id}/update`);
}

export async function createOrUpdateDuolingoScore(data: any) {
	return await createOrUpdate(data, 'duolingo');
}

export async function deleteDuolingoScore(data: any) {
	return await destroy(`duolingo/${data.id}/update`);
}

export async function createOrUpdateSatScore(data: any) {
	return await createOrUpdate(data, 'sat-scores');
}

export async function deleteSatScore(data: any) {
	return await destroy(`sat-scores/${data.id}/update`);
}

export async function createOrUpdateActScore(data: any) {
	return await createOrUpdate(data, 'act-scores');
}

export async function deleteActScore(data: any) {
	return await destroy(`act-scores/${data.id}/update`);
}

export async function createOrUpdateApScore(data: any) {
	return await createOrUpdate(data, 'ap-scores');
}

export async function deleteApScore(data: any) {
	return await destroy(`ap-scores/${data.id}/update`);
}

export async function createOrUpdateIbGrade(data: any) {
	return await createOrUpdate(data, 'ib-grades');
}

export async function deleteIbGrade(data: any) {
	return await destroy(`ib-grades/${data.id}/update`);
}

export async function createOrUpdateAlevelGrade(data: any) {
	return await createOrUpdate(data, 'alevel-grades');
}

export async function deleteAlevelGrade(data: any) {
	return await destroy(`alevel-grades/${data.id}/update`);
}

export async function createOrUpdateGreScore(data: any) {
	return await createOrUpdate(data, 'gre-scores');
}

export async function deleteGreScore(data: any) {
	return await destroy(`gre-scores/${data.id}/update`);
}

export async function createOrUpdateGmatScore(data: any) {
	return await createOrUpdate(data, 'gmat-scores');
}

export async function deleteGmatScore(data: any) {
	return await destroy(`gmat-scores/${data.id}/update`);
}

export async function createOrUpdateLsatScore(data: any) {
	return await createOrUpdate(data, 'lsat-scores');
}

export async function deleteLsatScore(data: any) {
	return await destroy(`lsat-scores/${data.id}/update`);
}

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
	} else {
		const total =
			Number(score.reading) +
			Number(score.listening) +
			Number(score.speaking) +
			Number(score.writing);

		const average = total / 4;
		return Math.round(average * 2) / 2;
	}
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
	} else {
		const total = score.math + score.science + score.english + score.reading;
		return Math.round(total / 4);
	}
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
	return toPercentage(score, 0, 9);
}

export function duolingoToPercentage(score: number | null): number {
	return toPercentage(score, 10, 160);
}

export function satSubToPercentage(score: number | null): number {
	return toPercentage(score, 200, 800);
}

export function satEssayToPercentage(score: number | null): number {
	return toPercentage(score, 2, 8);
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
