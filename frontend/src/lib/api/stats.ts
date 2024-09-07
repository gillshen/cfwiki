export type ApplicationStats = {
	applied: number;
	pending: number;
	accepted: number;
	denied: number;
	neutral: number;
};

export const blankStats: ApplicationStats = {
	applied: 0,
	pending: 0,
	accepted: 0,
	denied: 0,
	neutral: 0
};

export type ApplicationDataPoint = {
	year: number;
	round_name: string;
	gender: 'female' | 'male' | 'other';
	status: 'pending' | 'accepted' | 'denied' | 'neutral';
};
