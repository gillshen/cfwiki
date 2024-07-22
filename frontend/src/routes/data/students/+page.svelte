<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createGrid,
		type GridOptions,
		type ValueFormatterParams,
		type ValueGetterParams,
		type ICellRendererParams
	} from 'ag-grid-community';

	import type { StudentListItem, Contract } from '$lib/api/student';
	import AgCellRenderer from '$lib/abstract/agCellRenderer.js';
	import americanStates from '$lib/constants/americanStates.js';
	import canadianProvinces from '$lib/constants/canadianProvinces';
	import countryFlags from '$lib/constants/flags';

	export let data;

	class NameRenderer extends AgCellRenderer {
		declare eGui: HTMLAnchorElement;

		init(params: ICellRendererParams<any, any, any>): void {
			this.eGui = document.createElement('a');
			const student: StudentListItem = params.data;
			this.eGui.href = `../student/${student.id}/`;
			if (student.preferred_name && student.preferred_name !== student.given_name) {
				this.eGui.innerHTML = `${student.fullname} ${student.preferred_name}`;
			} else {
				this.eGui.innerHTML = student.fullname;
			}
		}
	}

	function genderValueFormatter(params: ValueFormatterParams): string {
		if (params.value === 'female') {
			return 'F';
		}
		if (params.value === 'male') {
			return 'M';
		}
		return params.value;
	}

	function citizenshipValueFormatter(params: ValueFormatterParams): string {
		const flag = countryFlags[params.value];
		return `${flag}\xa0\xa0${params.value}`;
	}

	function homeValueGetter(params: ValueGetterParams): string {
		const student: StudentListItem = params.data;
		const flag = countryFlags[student.base_country];

		if (!student.base_city && !student.base_subnational) {
			return `${flag}\xa0\xa0${student.base_country}`;
		}

		// the subnational division is known but not the city
		if (!student.base_city) {
			return `${flag}\xa0\xa0${student.base_subnational}`;
		}
		// the city is known, but no subnational division
		if (!student.base_subnational) {
			return `${flag}\xa0\xa0${student.base_city}`;
		}

		// both the subnational division and the city are known
		if (student.base_country === 'China') {
			return `${flag}\xa0\xa0${student.base_city}`;
		}

		let subnationalAbbr: string;
		if (student.base_country === 'United States') {
			subnationalAbbr = americanStates[student.base_subnational];
		} else if (student.base_country == 'Canada') {
			subnationalAbbr = canadianProvinces[student.base_subnational];
		} else {
			subnationalAbbr = '';
		}
		return `${flag}\xa0\xa0${student.base_city}, ${subnationalAbbr}`;
	}

	function _getLatestContract(student: StudentListItem): Contract | null {
		if (!student.contracts_sorted.length) {
			return null;
		}
		return student.contracts_sorted[0];
	}

	function latestContractTypeValueGetter(params: ValueGetterParams): string {
		const latestContract = _getLatestContract(params.data);
		return latestContract?.type ?? '';
	}

	function lastestTargetYearValueGetter(params: ValueGetterParams): number | null {
		const latestContract = _getLatestContract(params.data);
		return latestContract?.target_year ?? null;
	}

	function contractStatusValueGetter(params: ValueGetterParams): string {
		const latestContract = _getLatestContract(params.data);
		return latestContract?.status ?? '';
	}

	const columnDefs = [
		{ headerName: 'Name', filter: true, cellRenderer: NameRenderer },
		{
			headerName: 'Gender',
			field: 'gender',
			filter: true,
			valueFormatter: genderValueFormatter
		},
		{
			headerName: 'Citizenship',
			field: 'citizenship',
			filter: true,
			valueFormatter: citizenshipValueFormatter
		},
		{ headerName: 'Date of birth', field: 'date_of_birth', filter: 'agDateColumnFilter' },
		{ headerName: 'Home', filter: true, valueGetter: homeValueGetter },
		{ headerName: 'App. type', filter: true, valueGetter: latestContractTypeValueGetter },
		{
			headerName: 'Target year',
			filter: 'agNumberColumnFilter',
			valueGetter: lastestTargetYearValueGetter
		},
		{ headerName: 'Contract status', filter: true, valueGetter: contractStatusValueGetter }
	];

	const gridOptions: GridOptions = {
		columnDefs,
		rowData: data.students,
		suppressDragLeaveHidesColumns: true
	};

	onMount(() => {
		const gridElement: HTMLElement = document.querySelector('#grid')!;
		const gridApi = createGrid(gridElement, gridOptions);
		gridApi.sizeColumnsToFit();
	});
</script>

<main>
	<h1>Students</h1>

	<div id="grid" class="data-grid ag-theme-alpine" />
</main>

<style>
	main {
		padding: 0.5rem 1rem;
	}
	#grid {
		height: calc(100vh - 4rem);
	}
	.ag-theme-alpine {
		--ag-font-family: 'Fira Sans', 'Noto Sans SC', 'Twemoji Country Flags', Roboto, Arial,
			sans-serif;
		font-variant-numeric: tabular-nums;
	}
</style>
