import type { ValueGetterParams, ValueFormatterParams } from 'ag-grid-community';

export const localeComparator = (
	a: string,
	b: string,
	nodeA: any,
	nodeB: any,
	isDescending: boolean
) => {
	return a.localeCompare(b, 'zh-CN');
};

export function noZeroValueFormatter(params: ValueFormatterParams): string {
	return params.value === 0 ? '' : params.value;
}

export function percentageValueFormatter(params: ValueFormatterParams): string {
	if (isNaN(params.value)) {
		return '';
	} else {
		return `${(params.value * 100).toFixed(1)}\u202f%`;
	}
}

export function calcSuccessRate(data: { accepted: number; denied: number }): number | string {
	const { accepted, denied } = data;
	if (accepted + denied === 0) {
		return '';
	} else {
		return accepted / (accepted + denied);
	}
}
