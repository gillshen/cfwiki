<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createGrid,
		type GridOptions,
		type ValueFormatterParams,
		type ValueGetterParams,
		type ICellRendererParams
	} from 'ag-grid-community';
	import { Heading } from 'flowbite-svelte';

	import { type StudentListItem, type Contract, formatLocation } from '$lib/api/student';
	import AgCellRenderer from '$lib/abstract/agCellRenderer';
	import countryFlags from '$lib/constants/countryFlags';
	import { makeDate, toISODate } from '$lib/utils/dateUtils';

	export let data;

	function _getName(student: StudentListItem): string {
		if (student.preferred_name && student.preferred_name !== student.given_name) {
			return `${student.fullname} ${student.preferred_name}`;
		} else if (student.surname_first) {
			return student.fullname;
		} else {
			return `${student.surname}, ${student.given_name}`;
		}
	}

	class NameRenderer extends AgCellRenderer {
		declare eGui: HTMLAnchorElement;

		init(params: ICellRendererParams<any, any, any>): void {
			this.eGui = document.createElement('a');
			const student: StudentListItem = params.data;
			this.eGui.href = `/student/${student.id}/`;
			this.eGui.innerHTML = _getName(student);
		}
	}

	function nameValueGetter(params: ValueGetterParams): string {
		return _getName(params.data);
	}

	function genderValueFormatter(params: ValueFormatterParams): string {
		switch (params.value) {
			case 'female':
				return 'F';
			case 'male':
				return 'M';
			default:
				return params.value;
		}
	}

	function citizenshipValueFormatter(params: ValueFormatterParams): string {
		const flag = countryFlags[params.value];
		return `${flag}\xa0\xa0${params.value}`;
	}

	function dobValueGetter(params: ValueGetterParams): Date | null {
		const dob = params.data.date_of_birth;
		if (!dob) {
			return null;
		}
		return makeDate(dob);
	}

	function dobValueFormatter(params: ValueFormatterParams): string {
		return toISODate(params.value);
	}

	function homeValueGetter(params: ValueGetterParams): string {
		return formatLocation(params.data);
	}

	function homeValueFormatter(params: ValueFormatterParams): string {
		const home = formatLocation(params.data);
		if (!home) {
			return '';
		}
		const flag = countryFlags[params.data.base_country];
		return `${flag}\xa0\xa0${home}`;
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

	const localeCmp = (a: string, b: string, nodeA: any, nodeB: any, isDescending: boolean) => {
		return a.localeCompare(b, 'zh-CN');
	};

	const columnDefs = [
		{
			headerName: 'Name',
			filter: true,
			valueGetter: nameValueGetter,
			comparator: localeCmp,
			cellRenderer: NameRenderer
		},
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
		{
			headerName: 'Date of birth',
			filter: 'agDateColumnFilter',
			valueGetter: dobValueGetter,
			valueFormatter: dobValueFormatter
		},
		{
			headerName: 'Home',
			filter: true,
			valueGetter: homeValueGetter,
			comparator: localeCmp,
			valueFormatter: homeValueFormatter
		},
		{ headerName: 'Contract type', filter: true, valueGetter: latestContractTypeValueGetter },
		{
			headerName: 'Target year',
			filter: 'agNumberColumnFilter',
			valueGetter: lastestTargetYearValueGetter
		},
		{ headerName: 'Contract status', filter: true, valueGetter: contractStatusValueGetter }
	];

	const gridOptions: GridOptions = {
		columnDefs,
		rowData: data.students.sort((a, b) => a.fullname.localeCompare(b.fullname, 'zh-CN')),
		suppressDragLeaveHidesColumns: true
	};

	onMount(() => {
		const gridElement: HTMLElement = document.querySelector('#grid')!;
		const gridApi = createGrid(gridElement, gridOptions);
		gridApi.sizeColumnsToFit();
	});
</script>

<Heading tag="h1" class="text-3xl font-bold py-6">Students</Heading>

<div id="grid" class="data-grid ag-theme-alpine full-page" />
