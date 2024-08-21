<script lang="ts">
	import { onMount } from 'svelte';
	import { Badge, Heading } from 'flowbite-svelte';

	import {
		createGrid,
		type GridOptions,
		type ValueFormatterParams,
		type ValueGetterParams,
		type ICellRendererParams
	} from 'ag-grid-community';

	import type { StudentListItem } from '$lib/api/student';
	import type { ContractType } from '$lib/api/contract';
	import { agGridOptions } from '$lib/abstract/agGridOptions';
	import { AgCellRenderer, SvelteCellRenderer } from '$lib/abstract/agCellRenderer';
	import { formatLocation, orderByName } from '$lib/utils/studentUtils';
	import { formatCfNames } from '$lib/utils/serviceUtils';
	import { makeDate, toISODate } from '$lib/utils/dateUtils';
	import { localeComparator } from '$lib/utils/gridUtils';
	import countryFlags from '$lib/constants/countryFlags';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import Gender from '$lib/components/grid-cells/Gender.svelte';

	export let data: {
		students: Promise<StudentListItem[]>;
		targetYear?: number | undefined;
		contractType?: ContractType | undefined;
		current?: boolean;
	};

	function _getName(student: StudentListItem): string {
		if (!student.preferred_name || student.preferred_name === student.given_name) {
			return student.fullname;
		} else {
			return `${student.fullname} ${student.preferred_name}`;
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

	class GenderRenderer extends SvelteCellRenderer {
		createComponent(params: ICellRendererParams): void {
			this.component = new Gender({
				target: this.eGui,
				props: { student: params.data }
			});
		}
	}

	function citizenshipValueFormatter(params: ValueFormatterParams): string {
		const flag = countryFlags[params.value];
		return `${flag}\xa0\xa0${params.value}`;
	}

	function dateOfBirthValueGetter(params: ValueGetterParams): Date | null {
		const dateString = params.data.date_of_birth;
		return dateString ? makeDate(dateString) : null;
	}

	function dateOfBirthValueFormatter(params: ValueFormatterParams): string {
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
		return formatCfNames(services, role);
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

	const columnDefs = [
		{
			headerName: 'Name',
			flex: 1,
			valueGetter: nameValueGetter,
			comparator: localeComparator,
			cellRenderer: NameRenderer
		},
		{
			headerName: 'Target year',
			filter: 'agNumberColumnFilter',
			valueGetter: lastestTargetYearValueGetter,
			hide: !!data.targetYear
		},
		{
			headerName: 'Contract type',
			valueGetter: latestContractTypeValueGetter,
			hide: !!data.contractType
		},
		{ headerName: 'Contract status', valueGetter: contractStatusValueGetter, hide: !!data.current },
		{ headerName: 'Gender', field: 'gender', cellRenderer: GenderRenderer },
		{ headerName: 'Citizenship', field: 'citizenship', valueFormatter: citizenshipValueFormatter },
		{
			headerName: 'Date of birth',
			filter: 'agDateColumnFilter',
			valueGetter: dateOfBirthValueGetter,
			valueFormatter: dateOfBirthValueFormatter
		},
		{
			headerName: 'Home',
			flex: 1,
			valueGetter: homeValueGetter,
			comparator: localeComparator,
			valueFormatter: homeValueFormatter
		},
		{ headerName: '顾问', valueGetter: salesPeopleValueGetter },
		{ headerName: '文案', valueGetter: workPeopleValueGetter },
		{ headerName: '战略', valueGetter: stratPeopleValueGetter },
		{ headerName: '服务', valueGetter: salesAssistantsValueGetter },
		{ headerName: '流程', valueGetter: workAssistantsValueGetter }
	];

	onMount(async () => {
		const students = await data.students;

		if (!students.length) {
			return;
		}

		const gridOptions: GridOptions = {
			defaultColDef: { filter: true },
			columnDefs,
			rowData: students.sort(orderByName),
			...agGridOptions
		};
		const gridElement: HTMLElement = document.querySelector('#grid')!;
		const gridApi = createGrid(gridElement, gridOptions);
		gridApi.autoSizeAllColumns();
	});
</script>

<Heading tag="h1" class="grid-title flex gap-2 items-center">
	Students:
	{#if data.current}
		Current
	{:else if data.contractType && data.targetYear}
		{data.contractType} {data.targetYear}
	{:else}
		All
	{/if}
	{#await data.students then students}
		{#if students.length}
			<Badge>{students.length}</Badge>
		{/if}
	{/await}
</Heading>

{#await data.students}
	<FetchingDataSign />
{:then students}
	{#if students.length}
		<div id="grid" class="data-grid ag-theme-alpine full-page" />
	{:else}
		<NoDataSign text="No students in this category" />
	{/if}
{/await}
