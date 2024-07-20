<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createGrid,
		type GridOptions,
		type ValueFormatterParams,
		type ValueGetterParams
	} from 'ag-grid-community';

	import stateAbbreviations from '$lib/constants/states.js';
	import countryFlags from '$lib/constants/flags.js';

	export let data;

	function nameValueGetter(params: ValueGetterParams): string {
		const student = params.data;
		if (student.preferred_name && student.preferred_name !== student.firstname) {
			return `${student.fullname} ${student.preferred_name}`;
		}
		return student.fullname;
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
		const student = params.data;
		const flag = countryFlags[student.base_country];

		if (!student.base_city && !student.base_state) {
			return `${flag}\xa0\xa0${student.base_country}`;
		}

		// the state is known but not the city
		if (!student.base_city) {
			return `${flag}\xa0\xa0${student.base_state}`;
		}
		// the city is known, but no state (probably not in US/Canada)
		if (!student.base_state) {
			return `${flag}\xa0\xa0${student.base_city}`;
		}

		const state = stateAbbreviations[student.base_state];
		return `${flag}\xa0\xa0${student.base_city}, ${state}`;
	}

	const columnDefs = [
		{ headerName: 'Name', filter: true, valueGetter: nameValueGetter },
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
		{ headerName: 'Home', filter: true, valueGetter: homeValueGetter }
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
		font-family: 'Fira Sans', 'Twemoji Country Flags', Roboto, Arial, sans-serif;
	}
	#grid {
		height: 80vh;
	}
	.ag-theme-alpine {
		--ag-font-family: 'Fira Sans', 'Twemoji Country Flags', Roboto, Arial, sans-serif;
		font-variant-numeric: tabular-nums;
	}
</style>
