import { get, post, patch, buildQuery, destroy } from '$lib/api/api';
import type { ApplicationLog, ApplicationLogBrief } from '$lib/api/applicationLog';
import type { ApSummary, IbSummary, AlevelSummary } from '$lib/api/student';
import type { BaseGrade } from '$lib/api/grade';

export const applicationTypes = ['freshman', 'transfer', 'graduate', 'other'] as const;

export type ApplicationType = (typeof applicationTypes)[number];

type Service = {
	cf_username: string;
	role: string;
};

export type ApplicationListItem = {
	id: number;
	student: { id: number };
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

export type ApplicantEnrollmentItem = {
	school_name: string;
	program_type: string;
	start_progression: string;
	end_progression: string;
	curriculum: string;
	grades: BaseGrade[];
};

export type ApplicantListItem = {
	id: number;
	fullname: string;
	gender: 'female' | 'male' | 'other';
	citizenship: string;
	enrollments: ApplicantEnrollmentItem[];
	scores: {
		best_toefl?: number;
		best_ielts?: number;
		best_duolingo?: number;
		super_sat?: number;
		super_act?: number;
		best_gre?: number;
		best_gmat?: number;
		best_lsat?: number;
	};
	ap_summary: ApSummary;
	ib_summary: IbSummary;
	alevel_summary: AlevelSummary;
};

export type ComposedApplicationListItem = {
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

export async function fetchApplications(
	params?: Record<string, any>
): Promise<ApplicationListItem[]> {
	return await get(`applications/${buildQuery(params)}`);
}

export async function fetchApplicants(params?: { id: number }): Promise<ApplicantListItem[]> {
	return await get(`applicants/${buildQuery(params)}`);
}

export async function fetchApplication(id: number): Promise<ApplicationDetail> {
	return await get(`applications/${id}/`);
}

export async function fetchCoApplications(
	application: ApplicationDetail
): Promise<ApplicationListItem[]> {
	const coApplications = await fetchApplications({
		program_iteration: application.program_iteration.id
	});
	return coApplications.filter((appl) => appl.id !== application.id);
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
