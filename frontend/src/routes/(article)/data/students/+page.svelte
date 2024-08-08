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

	function latestContractTypeValueGetter(params: ValueGetterParams): string {
		return params.data.latest_contract?.type ?? '';
	}

	function lastestTargetYearValueGetter(params: ValueGetterParams): number | null {
		return params.data.latest_contract?.target_year ?? null;
	}

	function contractStatusValueGetter(params: ValueGetterParams): string {
		return params.data.latest_contract?.status ?? '';
	}

	function _getLatestServices(student: StudentListItem, role: string): string {
		if (!student.latest_contract) {
			return '';
		}
		const services = student.latest_contract.services;
		return services
			.filter((s) => s.role === role)
			.map((s) => s.cf_username)
			.sort()
			.join(', ');
	}

	function stratPeopleValueGetter(params: ValueGetterParams): string {
		return _getLatestServices(params.data, '战略顾问');
	}

	function salesPeopleValueGetter(params: ValueGetterParams): string {
		return _getLatestServices(params.data, '顾问');
	}

	function workPeopleValueGetter(params: ValueGetterParams): string {
		return _getLatestServices(params.data, '文案');
	}

	function salesAssistantsValueGetter(params: ValueGetterParams): string {
		return _getLatestServices(params.data, '服务顾问');
	}

	function workAssistantsValueGetter(params: ValueGetterParams): string {
		return _getLatestServices(params.data, '流程顾问');
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
		{ headerName: '顾问', filter: true, valueGetter: salesPeopleValueGetter },
		{ headerName: '文案', filter: true, valueGetter: workPeopleValueGetter },
		{ headerName: '战略顾问', filter: true, valueGetter: stratPeopleValueGetter },
		{
			headerName: '服务顾问',
			filter: true,
			ValueGetter: salesAssistantsValueGetter,
			hide: true
		},
		{ headerName: '流程顾问', filter: true, valueGetter: workAssistantsValueGetter },
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

<Heading tag="h1" class="grid-title">Students</Heading>

<div id="grid" class="data-grid ag-theme-alpine full-page" />
