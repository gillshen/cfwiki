<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Heading } from 'flowbite-svelte';

	import {
		createGrid,
		type GridApi,
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
	import { filterForActive, formatCfNames } from '$lib/utils/serviceUtils';
	import { makeDate, toISODate } from '$lib/utils/dateUtils';
	import { localeComparator, showColumn } from '$lib/utils/gridUtils';
	import countryFlags from '$lib/constants/countryFlags';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import RowCountBadge from '$lib/components/grid-pages/RowCountBadge.svelte';
	import ControlButton from '$lib/components/grid-pages/ControlButton.svelte';
	import ControlDrawer from '$lib/components/grid-pages/ControlDrawer.svelte';
	import DownloadButton from '$lib/components/grid-pages/DownloadButton.svelte';
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
		const services = filterForActive(student.latest_contract.services);
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
			flex: 1.5,
			valueGetter: nameValueGetter,
			comparator: localeComparator,
			cellRenderer: NameRenderer
		},
		{
			headerName: 'Target year',
			filter: 'agNumberColumnFilter',
			valueGetter: lastestTargetYearValueGetter
		},
		{ headerName: 'Contract type', valueGetter: latestContractTypeValueGetter },
		{ headerName: 'Contract status', valueGetter: contractStatusValueGetter },
		{ headerName: 'Gender', field: 'gender', cellRenderer: GenderRenderer },
		{
			headerName: 'Citizenship',
			field: 'citizenship',
			valueFormatter: citizenshipValueFormatter,
			useValueFormatterForExport: false
		},
		{
			headerName: 'Date of birth',
			filter: 'agDateColumnFilter',
			valueGetter: dateOfBirthValueGetter,
			valueFormatter: dateOfBirthValueFormatter
		},
		{
			headerName: 'Home',
			flex: 1.5,
			valueGetter: homeValueGetter,
			comparator: localeComparator,
			valueFormatter: homeValueFormatter,
			useValueFormatterForExport: false
		},
		{ headerName: '战略顾问', valueGetter: stratPeopleValueGetter },
		{ headerName: '顾问', valueGetter: salesPeopleValueGetter },
		{ headerName: '文案', valueGetter: workPeopleValueGetter, flex: 1.2 },
		{ headerName: '服务顾问', valueGetter: salesAssistantsValueGetter },
		{ headerName: '流程顾问', valueGetter: workAssistantsValueGetter }
	];

	const columnVisibility: Record<string, boolean> = {
		'Target year': !data.targetYear,
		'Contract type': !data.contractType,
		'Contract status': !data.current,
		Gender: true,
		Citizenship: true,
		'Date of birth': false,
		Home: true,
		战略顾问: false,
		顾问: true,
		文案: true,
		服务顾问: false,
		流程顾问: false
	};

	let gridApi: GridApi;
	let rowCount: number;
	const hideControl = writable(true);

	const showDisplayedRowCount = () => {
		if (gridApi) {
			rowCount = gridApi.getDisplayedRowCount();
		}
	};

	onMount(async () => {
		const students = await data.students;

		if (!students.length) {
			return;
		}

		const gridOptions: GridOptions = {
			defaultColDef: {
				filter: true,
				flex: 1,
				minWidth: 100
			},
			columnDefs,
			rowData: students.sort(orderByName),
			onFilterChanged: showDisplayedRowCount,
			onModelUpdated: showDisplayedRowCount,
			...agGridOptions
		};
		const gridElement: HTMLElement = document.querySelector('#grid')!;
		gridApi = createGrid(gridElement, gridOptions);

		for (const headerName in columnVisibility) {
			showColumn(gridApi, headerName, columnVisibility[headerName]);
		}
	});
</script>

<Heading tag="h1" class="grid-title flex gap-2 items-center justify-between">
	<div class="flex gap-4 items-center">
		Students:
		{#if data.current}
			Current
		{:else if data.contractType && data.targetYear}
			{data.contractType} {data.targetYear}
		{:else}
			All
		{/if}
		<RowCountBadge promisedData={data.students} {rowCount} />
		<ControlButton {hideControl} />
	</div>

	{#await data.students then _}
		<DownloadButton {gridApi} fileName="cf_students" />
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

<ControlDrawer {gridApi} {columnVisibility} {hideControl} />
