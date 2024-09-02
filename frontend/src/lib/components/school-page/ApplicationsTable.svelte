<script lang="ts">
	import { Table, TableBody, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

	import type { ApplicationListItem } from '$lib/api/application';
	import { orderByStudentName, orderByStatus, orderByRoundName } from '$lib/utils/applicationUtils';

	import ApplicationLink from '$lib/components/table-cells/ApplicationLink.svelte';
	import Student from '$lib/components/table-cells/Student.svelte';
	import ProgramOrMajors from '$lib/components/table-cells/ProgramOrMajors.svelte';
	import ApplicationRound from '$lib/components/table-cells/ApplicationRound.svelte';
	import ApplicationStatus from '$lib/components/table-cells/ApplicationStatus.svelte';
	import ShortDate from '$lib/components/table-cells/ShortDate.svelte';

	export let applications: ApplicationListItem[];
	export let isUndergraduate: boolean;
</script>

<Table hoverable={applications.length > 1}>
	<TableHead>
		<TableHeadCell></TableHeadCell>
		<TableHeadCell class="w-40">Status</TableHeadCell>
		<TableHeadCell class="w-40">Student</TableHeadCell>
		<TableHeadCell class="w-[30rem]">
			{isUndergraduate ? 'Major' : 'Track/Concentration'}
		</TableHeadCell>
		<TableHeadCell class="w-40">Adm. plan</TableHeadCell>
		<TableHeadCell class="w-40">Due</TableHeadCell>
	</TableHead>

	<TableBody>
		{#each applications
			.sort(orderByStudentName)
			.sort(orderByStatus)
			.sort(orderByRoundName) as application}
			<TableBodyRow>
				<ApplicationLink {application} />
				<ApplicationStatus {application} />
				<Student {application} />
				<ProgramOrMajors {application} />
				<ApplicationRound {application} />
				<ShortDate date={application.due_date} />
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
