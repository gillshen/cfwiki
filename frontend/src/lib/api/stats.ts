export type ApplicationStats = {
	applied: number;
	pending: number;
	accepted: number;
	denied: number;
	neutral: number;
};

export const lackOfStats: ApplicationStats = {
	applied: 0,
	pending: 0,
	accepted: 0,
	denied: 0,
	neutral: 0
};
