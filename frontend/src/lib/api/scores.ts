import { createOrUpdate } from '$lib/api/api';

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
	english: number | null;
	math: number | null;
	reading: number | null;
	science: number | null;
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

export type ALevelGrade = BaseScore & {
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

export async function createOrUpdateIeltsScore(data: any) {
	return await createOrUpdate(data, 'ielts');
}

export async function createOrUpdateDuolingoScore(data: any) {
	return await createOrUpdate(data, 'duolingo');
}

export async function createOrUpdateSatScore(data: any) {
	return await createOrUpdate(data, 'sat-scores');
}

export async function createOrUpdateActScore(data: any) {
	return await createOrUpdate(data, 'act-scores');
}

export async function createOrUpdateApScore(data: any) {
	return await createOrUpdate(data, 'ap-scores');
}

export async function createOrUpdateIbGrade(data: any) {
	return await createOrUpdate(data, 'ib-grades');
}

export async function createOrUpdateAlevelGrade(data: any) {
	return await createOrUpdate(data, 'alevel-grades');
}

export async function createOrUpdateGreScore(data: any) {
	return await createOrUpdate(data, 'gre-scores');
}

export async function createOrUpdateGmatScore(data: any) {
	return await createOrUpdate(data, 'mat-scores');
}

export async function createOrUpdateLsatScore(data: any) {
	return await createOrUpdate(data, 'lsat-scores');
}
