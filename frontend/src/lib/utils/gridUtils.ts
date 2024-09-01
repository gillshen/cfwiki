import type { GridApi, ValueFormatterParams } from 'ag-grid-community';

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
	if (typeof params.value !== 'number') {
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

export function getSatOrAct(data: { super_sat: number | null; super_act: number | null }): string {
	const { super_sat, super_act } = data;
	const satString = super_sat !== null ? `SAT ${super_sat}` : '';
	const actString = super_act !== null ? `ACT ${super_act}` : '';
	return [satString, actString].filter(Boolean).join(', ');
}

export function getGreOrGmat(data: { best_gre: number | null; best_gmat: number | null }): string {
	const { best_gre, best_gmat } = data;
	const greString = best_gre !== null ? `GRE ${best_gre}` : '';
	const gmatString = best_gmat !== null ? `GMAT ${best_gmat}` : '';
	return [greString, gmatString].filter(Boolean).join('/');
}

export function getEnglishProficiency(data: {
	best_toefl: number | null;
	best_ielts: number | null;
	best_duolingo: number | null;
}): string {
	const { best_toefl, best_ielts, best_duolingo } = data;
	const toeflString = best_toefl !== null ? `TOEFL ${best_toefl}` : '';
	const ieltsString = best_ielts !== null ? `IELTS ${best_ielts.toFixed(1)}` : '';
	const duolingoString = best_duolingo !== null ? `Duolingo ${best_duolingo}` : '';
	return [toeflString, ieltsString, duolingoString].filter(Boolean).join('/');
}

export function showColumn(gridApi: GridApi, headerName: string, show: boolean) {
	const columns = gridApi.getColumns();
	const targetColumns = columns!.filter((col) => col.getColDef().headerName === headerName);
	gridApi.setColumnsVisible(targetColumns, show);
}
