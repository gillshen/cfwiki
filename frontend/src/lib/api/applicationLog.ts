import { createOrUpdate, destroy } from '$lib/api/api';

export const applicationStatuses = [
	'Started',
	'Submitted',
	'Under Review',
	'Accepted',
	'Rejected',
	'On Waitlist',
	'Deferred',
	'Cancelled',
	'Withdrawn',
	'Enrolled',
	'Offer Rescinded',
	'Not Tracked'
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export type ApplicationLog = {
	id: number;
	date: string;
	status: ApplicationStatus;
	comments: string;
	updated: string;
};

export async function createOrUpdateApplicationLog(data: any) {
	return await createOrUpdate(data, 'application-logs');
}

export async function deleteApplicationLog(data: any) {
	return await destroy(`application-logs/${data.id}/update/`);
}
