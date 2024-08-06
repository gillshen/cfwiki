import { post, patch } from '$lib/api/api';

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
	'Offer Rescinded'
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
	if (data.id) {
		return await patch(`application-logs/${data.id}/update/`, data);
	} else {
		return await post('application-logs/new/', data);
	}
}
