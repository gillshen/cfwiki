import { createOrUpdate, destroy } from '$lib/api/core';

export type ApplicationStatus =
	| 'Started'
	| 'Submitted'
	| 'Under Review'
	| 'Deferred'
	| 'On Waitlist'
	| 'Accepted'
	| 'Rejected'
	| 'Pres. Rejected'
	| 'Offer Rescinded'
	| 'Cancelled'
	| 'Withdrawn'
	| 'Untracked';

export const applicationStatusCategories = [
	'pending',
	'resolved',
	'accepted',
	'denied',
	'neutral'
] as const;

export type ApplicationStatusCategory = (typeof applicationStatusCategories)[number];

export const applicationStatusOrder: Record<ApplicationStatus, number> = {
	Started: 10,
	Submitted: 11,
	'Under Review': 12,
	Deferred: 20,
	'On Waitlist': 21,
	Accepted: 0,
	Rejected: 30,
	'Pres. Rejected': 31,
	'Offer Rescinded': 32,
	Cancelled: 40,
	Withdrawn: 41,
	Untracked: 50
};

export const applicationStatuses: string[] = Object.keys(applicationStatusOrder);

export type ApplicationLogBrief = {
	status: ApplicationStatus;
	date: string;
};

export type ApplicationLog = ApplicationLogBrief & {
	id: number;
	comments: string;
	updated: string;
};

export async function createOrUpdateApplicationLog(data: any) {
	return await createOrUpdate(data, 'application-logs');
}

export async function deleteApplicationLog(data: any) {
	return await destroy(`application-logs/${data.id}/update/`);
}
