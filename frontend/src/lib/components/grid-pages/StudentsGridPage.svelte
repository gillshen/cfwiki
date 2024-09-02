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
	import countryFlags from '$lib/constants/countryFlags';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import RowCountBadge from '$lib/components/grid-pages/RowCountBadge.svelte';
	import ControlButton from '$lib/components/grid-pages/ControlButton.svelte';
	import ControlDrawer from '$lib/components/grid-pages/ControlDrawer.svelte';
	import DownloadButton from '$lib/components/grid-pages/DownloadButton.svelte';
	import Gender from '$lib/components/grid-cells/Gender.svelte';
	import { filterForActive, formatCfNames } from '$lib/utils/serviceUtils';
	import { makeDate, toISODate } from '$lib/utils/dateUtils';

	import {
		formatAlevelSummary,
		formatApSummary,
		formatIbSummary,
		formatLocation,
		orderByName
	} from '$lib/utils/studentUtils';

	import {
		getEnglishProficiency,
		getGreOrGmat,
		getSatOrAct,
		localeComparator,
		showColumn
	} from '$lib/utils/gridUtils';

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

	function satOrActValueGetter(params: ValueGetterParams): string {
		return getSatOrAct(params.data);
	}

	function apValueGetter(params: ValueGetterParams): string {
		return formatApSummary(params.data.ap_summary);
	}

	function ibValueGetter(params: ValueGetterParams): string {
		return formatIbSummary(params.data.ib_summary);
	}

	function alevelValueGetter(params: ValueGetterParams): string {
		return formatAlevelSummary(params.data.alevel_summary);
	}

	function greOrGmatValueGetter(params: ValueGetterParams): string {
		return getGreOrGmat(params.data);
	}

	function englishValueGetter(params: ValueGetterParams): string {
		return getEnglishProficiency(params.data);
	}

	const columnTypes = {
		numeric: {
			filter: 'agNumberColumnFilter'
		}
	};

	const columnDefs = [
		{
			headerName: 'Name',
			flex: 1.2,
			valueGetter: nameValueGetter,
			comparator: localeComparator,
			cellRenderer: NameRenderer,
			pinned: true
		},
		{
			headerName: 'Target Year',
			valueGetter: lastestTargetYearValueGetter,
			type: 'numeric',
			flex: 0.8
		},
		{ headerName: 'Contract Type', valueGetter: latestContractTypeValueGetter },
		{ headerName: 'Contract Status', valueGetter: contractStatusValueGetter },
		{ headerName: '战略顾问', valueGetter: stratPeopleValueGetter },
		{ headerName: '顾问', valueGetter: salesPeopleValueGetter },
		{ headerName: '文案', valueGetter: workPeopleValueGetter, flex: 1.2 },
		{ headerName: '服务顾问', valueGetter: salesAssistantsValueGetter },
		{ headerName: '流程顾问', valueGetter: workAssistantsValueGetter },
		{ headerName: 'Gender', field: 'gender', cellRenderer: GenderRenderer, flex: 0.8 },
		{
			headerName: 'Citizenship',
			field: 'citizenship',
			valueFormatter: citizenshipValueFormatter,
			useValueFormatterForExport: false
		},
		{
			headerName: 'Date of Birth',
			filter: 'agDateColumnFilter',
			valueGetter: dateOfBirthValueGetter,
			valueFormatter: dateOfBirthValueFormatter
		},
		{
			headerName: 'Home',
			valueGetter: homeValueGetter,
			comparator: localeComparator,
			valueFormatter: homeValueFormatter,
			useValueFormatterForExport: false
		},
		{ headerName: 'SAT/ACT', valueGetter: satOrActValueGetter },
		{ headerName: 'SAT', field: 'super_sat', type: ['numeric', 'rightAligned'] },
		{ headerName: 'ACT', field: 'super_act', type: ['numeric', 'rightAligned'] },
		{ headerName: 'AP', valueGetter: apValueGetter },
		{ headerName: 'IB', valueGetter: ibValueGetter },
		{ headerName: 'A-level', valueGetter: alevelValueGetter },
		{ headerName: 'GRE/GMAT', valueGetter: greOrGmatValueGetter },
		{ headerName: 'GRE', field: 'best_gre', type: ['numeric', 'rightAligned'] },
		{ headerName: 'GMAT', field: 'best_gmat', type: ['numeric', 'rightAligned'] },
		{ headerName: 'LSAT', field: 'best_lsat', type: ['numeric', 'rightAligned'] },
		{ headerName: 'Eng. Proficiency', valueGetter: englishValueGetter },
		{ headerName: 'TOEFL', field: 'best_toefl', type: ['numeric', 'rightAligned'] },
		{ headerName: 'IELTS', field: 'best_ielts', type: ['numeric', 'rightAligned'] },
		{ headerName: 'Duolingo', field: 'best_duolingo', type: ['numeric', 'rightAligned'] }
	];

	const columnVisibility: Record<string, boolean> = {
		Name: true,
		'Target Year': !data.targetYear,
		'Contract Type': !data.contractType,
		'Contract Status': !data.current,
		战略顾问: false,
		顾问: true,
		文案: true,
		服务顾问: false,
		流程顾问: false,
		Gender: true,
		Citizenship: true,
		'Date of Birth': false,
		Home: false,
		'SAT/ACT': data.contractType !== 'Graduate',
		SAT: false,
		ACT: false,
		AP: false,
		IB: false,
		'A-level': false,
		'GRE/GMAT': data.contractType !== 'UG Freshman' && data.contractType !== 'UG Transfer',
		GRE: false,
		GMAT: false,
		LSAT: false,
		'Eng. Proficiency': true,
		TOEFL: false,
		IELTS: false,
		Duolingo: false
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
			columnTypes,
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
