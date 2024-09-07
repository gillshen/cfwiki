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

export function getSatOrAct(data: { super_sat?: number; super_act?: number }): string {
	const { super_sat, super_act } = data;
	const satString = super_sat !== undefined ? `SAT ${super_sat}` : '';
	const actString = super_act !== undefined ? `ACT ${super_act}` : '';
	return [satString, actString].filter(Boolean).join(', ');
}

export function getGreOrGmat(data: { best_gre?: number; best_gmat?: number }): string {
	const { best_gre, best_gmat } = data;
	const greString = best_gre !== undefined ? `GRE ${best_gre}` : '';
	const gmatString = best_gmat !== undefined ? `GMAT ${best_gmat}` : '';
	return [greString, gmatString].filter(Boolean).join('/');
}

export function getEnglishProficiency(data: {
	best_toefl?: number;
	best_ielts?: number;
	best_duolingo?: number;
}): string {
	const { best_toefl, best_ielts, best_duolingo } = data;
	const toeflString = best_toefl !== undefined ? `TOEFL ${best_toefl}` : '';
	const ieltsString = best_ielts !== undefined ? `IELTS ${best_ielts.toFixed(1)}` : '';
	const duolingoString = best_duolingo !== undefined ? `Duolingo ${best_duolingo}` : '';
	return [toeflString, ieltsString, duolingoString].filter(Boolean).join('/');
}

export function showColumn(gridApi: GridApi, headerName: string, show: boolean) {
	const columns = gridApi.getColumns();
	const targetColumns = columns!.filter((col) => col.getColDef().headerName === headerName);
	gridApi.setColumnsVisible(targetColumns, show);
}

export function moveColumnVisibilityKey(
	obj: Record<string, any>,
	key: string,
	to: number
): Record<string, any> {
	const entries = Object.entries(obj);
	const currentIndex = entries.findIndex(([k]) => k === key);

	if (currentIndex < 0) {
		throw new Error(`Key not found: ${key}`);
	}
	if (to < 0 || to >= entries.length || to === currentIndex) {
		return obj;
	}

	const [movedEntry] = entries.splice(currentIndex, 1);
	entries.splice(to, 0, movedEntry);

	return Object.fromEntries(entries);
}
