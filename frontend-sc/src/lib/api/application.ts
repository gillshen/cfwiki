import { z } from 'zod';
import { get, post, patch, buildQuery, destroy } from '$lib/api/core';
import type { ApplicationSchema } from '$lib/schemas/application';

import type {
	ApplicationLog,
	ApplicationLogBrief,
	ApplicationStatus
} from '$lib/api/applicationLog';

import type { AcademicFields } from '$lib/api/student';

export const applicationTypes = [
	'freshman',
	'transfer',
	'graduate',
	'masters',
	'doctorate',
	'other'
] as const;

export type ApplicationType = (typeof applicationTypes)[number];

type Service = {
	cf_username: string;
	role: string;
};

type ApplicationWithLogs = {
	id: number;
	contract: number;
	round: number;
	staff: string[]; // array of usernames
	majors: string[];
	logs: { status: ApplicationStatus; date: string }[];
};

type ApplicationTarget = {
	id: number;
	name: string;
	due_date: string;
	schools: {
		id: number;
		name: string;
		country: string;
		rankings: { ranking_name: string; year: number; rank: number }[];
	}[];
	program: { type: string; display_name: string };
	year: number;
	term: string;
};

type ApplicantListItem = {
	id: number;
	fullname: string;
	gender: 'female' | 'male' | 'other';
	citizenship: string;
} & AcademicFields;

type ApplicationContract = {
	id: number;
	student: ApplicantListItem;
	services: Service[];
};

export type ComposedApplication = {
	id: number;
	student: ApplicantListItem;
	staff: string[]; // array of usernames
	schools: {
		id: number;
		name: string;
		country: string;
	}[];
	program: { type: string; display_name: string };
	year: number;
	term: string;
	round_name: string;
	due_date: string | null;
	majors: string[];
	logs: ApplicationLogBrief[];
};

export type ApplicationDetail = {
	id: number;
	student: { id: number; fullname: string };
	services: Service[];
	staff: string[]; // array of usernames
	schools: { id: number; name: string; country: string }[];
	program: { id: number; type: string; display_name: string };
	program_iteration: { id: number; year: number; term: string };
	round: {
		id: number;
		name: string;
		due_date: string | null;
		due_time: string | null;
		timezone: string;
		decision_date: string | null;
	};
	major_1: string;
	major_2: string;
	major_3: string;
	comments: string;
	logs: ApplicationLog[];
};

async function fetchApplicationsWithLogs(params?: {
	student?: string | number | null;
	cfer?: string | null;
	school?: string | number | null;
	school_attended?: string | number | null;
	program?: string | number | null;
	programs?: string | null;
	program_iteration?: string | number | null;
	year?: string | number | null;
	application_type?: string | null;
	status?: string | null;
}): Promise<ApplicationWithLogs[]> {
	return await get(`applications-logged/${buildQuery(params)}`);
}

async function fetchApplicationTargets(params?: {
	year?: number | string | null;
	school?: number | string | null;
	program?: number | string | null;
	programs?: string | null;
	program_iteration?: number | string | null;
}): Promise<ApplicationTarget[]> {
	return await get(`application-targets/${buildQuery(params)}`);
}

async function fetchApplicationContracts(params?: {
	student?: number | string | null;
	cfer?: string | null;
}): Promise<ApplicationContract[]> {
	return await get(`application-contracts/${buildQuery(params)}`);
}

export async function fetchComposedApplications(params?: {
	cfer?: string | null;
	year?: string | number | null;
	application_type?: string | null;
	student?: string | number | null;
	school?: string | number | null;
	school_attended?: string | number | null;
	program?: string | number | null;
	programs?: string | null;
	program_iteration?: string | number | null;
	status?: string | null;
}): Promise<ComposedApplication[]> {
	const [applications, targets, contracts] = await Promise.all([
		fetchApplicationsWithLogs(params),
		fetchApplicationTargets(params),
		fetchApplicationContracts(params)
	]);

	return applications.map((application: ApplicationWithLogs) => {
		const target = targets.find((target: ApplicationTarget) => target.id === application.round)!;
		const contract = contracts.find(
			(contract: ApplicationContract) => contract.id === application.contract
		)!;
		return {
			...application,
			round_name: target.name,
			due_date: target.due_date,
			schools: target.schools,
			program: target.program,
			year: target.year,
			term: target.term,
			student: contract.student,
			services: contract.services
		};
	});
}

export async function fetchCoApplications(
	application: ApplicationDetail
): Promise<ComposedApplication[]> {
	const coApplications = await fetchComposedApplications({
		program_iteration: application.program_iteration.id
	});
	return coApplications.filter((appl) => appl.id !== application.id);
}

export async function fetchApplication(id: number): Promise<ApplicationDetail> {
	return await get(`applications/${id}/`, 'Application not found');
}

export async function createApplication(
	data: z.infer<ApplicationSchema> & { default_log: string | null | undefined }
) {
	return await post('applications/new/', data);
}

// TODO make the form
export async function updateApplication(data: {
	id: number;
	program_iteration: number;
	major_1: string;
	major_2: string;
	major_3: string;
	staff_names: string[];
}) {
	return await patch(`applications/${data.id}/update/`, data);
}

// TODO
export async function switchRound() {
	//
}

export async function deleteApplication(data: { id: number }) {
	return await destroy(`applications/${data.id}/update/`);
}
