import { z } from 'zod';
import type { ApplicationLogSchema } from '$lib/schemas/applicationLog';
import { createOrUpdate, destroy } from '$lib/api/core';

export const APPLICATION_STATUSES = [
	'Started',
	'Submitted',
	'Under Review',
	'Deferred',
	'On Waitlist',
	'Accepted',
	'Rejected',
	'Pres. Rejected',
	'Offer Rescinded',
	'Cancelled',
	'Withdrawn',
	'Untracked'
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_STATUS_CATEGORIES = [
	'pending',
	'resolved',
	'accepted',
	'denied',
	'neutral'
] as const;

export type ApplicationStatusCategory = (typeof APPLICATION_STATUS_CATEGORIES)[number];

export const applicationStatusOrdering: Record<ApplicationStatus, number> = {
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

export type ApplicationLog = {
	id: number;
	status: ApplicationStatus;
	date: string;
	comments: string;
	updated: string;
};

export async function createOrUpdateApplicationLog(data: z.infer<ApplicationLogSchema>) {
	return await createOrUpdate(data, 'application-logs');
}

export async function deleteApplicationLog(data: { id: number }) {
	return await destroy(`application-logs/${data.id}/update/`);
}
