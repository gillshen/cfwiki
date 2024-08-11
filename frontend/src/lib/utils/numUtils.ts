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
