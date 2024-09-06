import { createOrUpdate, destroy } from '$lib/api/api';

export const applicationStatusOrder: Record<string, number> = {
	Started: 0,
	Submitted: 1,
	'Under Review': 2,
	Deferred: 3,
	'On Waitlist': 4,
	Accepted: 5,
	Rejected: 7,
	'Pres. Rejected': 8,
	'Offer Rescinded': 9,
	Cancelled: 10,
	Withdrawn: 11,
	Untracked: 12
};

export const applicationStatuses: string[] = Object.keys(applicationStatusOrder);

export type ApplicationStatus = keyof typeof applicationStatusOrder;

export type ApplicationLogBrief = {
	status: ApplicationStatus;
	date: string;
	updated: string;
};

export type ApplicationLog = ApplicationLogBrief & {
	id: number;
	comments: string;
};

export async function createOrUpdateApplicationLog(data: any) {
	return await createOrUpdate(data, 'application-logs');
}

export async function deleteApplicationLog(data: any) {
	return await destroy(`application-logs/${data.id}/update/`);
}
