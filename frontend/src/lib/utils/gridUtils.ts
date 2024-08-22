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

export function successRateValueGetter(params: ValueGetterParams): number | string {
	const { accepted, denied } = params.data.application_stats;
	if (accepted + denied === 0) {
		return '';
	} else {
		return accepted / (accepted + denied);
	}
}

export function successRateValueFormatter(params: ValueFormatterParams): string {
	if (typeof params.value !== 'number') {
		return '';
	} else {
		return `${(params.value * 100).toFixed(1)}\u202f%`;
	}
}
