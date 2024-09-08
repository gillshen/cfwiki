export type ApplicationStats = {
	applied: number;
	pending: number;
	accepted: number;
	denied: number;
	neutral: number;
};

export type ApplicationDataPoint = {
	year: number;
	round_name: string;
	gender: 'female' | 'male' | 'other';
	status: 'pending' | 'accepted' | 'denied' | 'neutral';
};

export function blankStats(): ApplicationStats {
	return {
		applied: 0,
		pending: 0,
		accepted: 0,
		denied: 0,
		neutral: 0
	};
}
