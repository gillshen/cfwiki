export const applicationStatuses = [
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
