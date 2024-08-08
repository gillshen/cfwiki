type BaseScore = {
	id: number;
	student: number;
	date: string | null;
};

export type ToeflScore = BaseScore & {
	reading: number | null;
	listening: number | null;
	speaking: number | null;
	writing: number | null;
};

export type IeltsScore = ToeflScore;

export type DuolingoScore = BaseScore & {
	overall: number | null;
	literacy: number | null;
	comprehension: number | null;
	conversation: number | null;
	production: number | null;
};

export type SatScore = BaseScore & {
	ebrw: number | null;
	math: number | null;
	essay: number | null;
};

export type ActScore = BaseScore & {
	english: number | null;
	math: number | null;
	reading: number | null;
	science: number | null;
	writing: number | null;
};

export type ApScore = BaseScore & {
	subject: string;
	score: number | null;
};

export type IbGrade = BaseScore & {
	type: 'predicted' | 'final';
	subject: string;
	grade: number | null;
};

export type ALevelGrade = BaseScore & {
	type: 'predicted' | 'final';
	subject: string;
	percentage: number | null;
	grade: string;
};

export type GreScore = BaseScore & {
	verbal: number | null;
	quant: number | null;
	writing: number | null;
};

export type GmatScore = BaseScore & {
	total: number | null;
	verbal: number | null;
	quant: number | null;
	reasoning: number | null;
	writing: number | null;
};

export type LsatScore = BaseScore & {
	score: number | null;
};
