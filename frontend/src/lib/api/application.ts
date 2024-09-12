import { get, post, patch, buildQuery, destroy } from '$lib/api/api';
import type { ApplicationLog, ApplicationLogBrief } from '$lib/api/applicationLog';
import type { AcademicFields } from '$lib/api/student';

export const applicationTypes = ['freshman', 'transfer', 'graduate', 'other'] as const;

export type ApplicationType = (typeof applicationTypes)[number];

type Service = {
	cf_username: string;
	role: string;
};

type ApplicationWithLogs = {
	id: number;
	contract: number;
	round: number;
	majors_or_track: string;
	logs: { status: string; date: string }[];
};

type ApplicationTarget = {
	id: number;
	name: string;
	due_date: string;
	schools: {
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
	services: Service[];
	schools: { name: string; country: string }[];
	program: { type: string; display_name: string };
	year: number;
	term: string;
	round_name: string;
	due_date: string | null;
	majors_or_track: string;
	logs: ApplicationLogBrief[];
};

export type ApplicationDetail = {
	id: number;
	student: { id: number; fullname: string };
	services: Service[];
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
	track: string;
	comments: string;
	logs: ApplicationLog[];
};

async function fetchApplicationsWithLogs(
	params?: Record<string, any>
): Promise<ApplicationWithLogs[]> {
	return await get(`applications-logged/${buildQuery(params)}`);
}

async function fetchApplicationTargets(params?: {
	year?: number;
	school?: number;
	program?: number;
	programs?: string;
	program_iteration?: number;
}): Promise<ApplicationTarget[]> {
	return await get(`application-targets/${buildQuery(params)}`);
}

async function fetchApplicationContracts(params?: {
	student?: number | undefined;
}): Promise<ApplicationContract[]> {
	return await get(`application-contracts/${buildQuery(params)}`);
}

export async function fetchComposedApplications(params?: {
	cfer?: number;
	year?: number;
	application_type?: string;
	student?: number;
	school?: number;
	school_attended?: number;
	program?: number;
	programs?: string;
	program_iteration?: number;
	status?: string;
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

export async function createApplication(data: any) {
	return await post('applications/new/', data);
}

export async function updateApplication(data: any) {
	return await patch(`applications/${data.id}/update/`, data);
}

export async function deleteApplication(data: any) {
	return await destroy(`applications/${data.id}/update/`);
}
