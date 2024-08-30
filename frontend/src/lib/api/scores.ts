import { createOrUpdate, destroy } from '$lib/api/api';

export type BaseScore = {
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
	data_insights: number | null;
	reasoning: number | null;
	writing: number | null;
	is_legacy: boolean;
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
