export function parseNum(input: string | number): number {
	if (typeof input === 'number') {
		return input;
	}

	let parsed;

	if (input.includes('.')) {
		parsed = parseFloat(input);
	} else {
		parsed = parseInt(input, 10);
	}

	if (isNaN(parsed)) {
		throw Error(`${input} is not a number`);
	}
	return parsed;
}

export function calcSuccessRate(data: { accepted: number; denied: number }): number | null {
	const { accepted, denied } = data;
	if (accepted + denied === 0) {
		return null;
	} else {
		return accepted / (accepted + denied);
	}
}

export const getSuccessRateAsPercentage = (data: {
	accepted: number;
	denied: number;
}): string | null => {
	if (data.accepted + data.denied === 0) {
		return null;
	}
	const rate = (data.accepted * 100) / (data.accepted + data.denied);
	return rate.toFixed(1);
};
