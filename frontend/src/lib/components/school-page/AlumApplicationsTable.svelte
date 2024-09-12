<script lang="ts">
	import { Table, TableBody, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

	import type { ComposedApplication } from '$lib/api/application';
	import { orderByStudentName, orderByStatus, orderByRoundName } from '$lib/utils/applicationUtils';

	import ApplicationLink from '$lib/components/table-cells/ApplicationLink.svelte';
	import Student from '$lib/components/table-cells/Student.svelte';
	import Schools from '$lib/components/table-cells/Schools.svelte';
	import ProgramOrMajors from '$lib/components/table-cells/ProgramOrMajors.svelte';
	import ApplicationRound from '$lib/components/table-cells/ApplicationRound.svelte';
	import ApplicationStatus from '$lib/components/table-cells/ApplicationStatus.svelte';

	export let applications: ComposedApplication[];
</script>

<Table hoverable={applications.length > 1}>
	<TableHead>
		<TableHeadCell></TableHeadCell>
		<TableHeadCell class="w-40">Status</TableHeadCell>
		<TableHeadCell class="w-40">Student</TableHeadCell>
		<TableHeadCell class="w-80">School</TableHeadCell>
		<TableHeadCell class="w-80">Program/Major</TableHeadCell>
		<TableHeadCell class="w-40">Adm. plan</TableHeadCell>
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
				<Schools {application} />
				<ProgramOrMajors {application} />
				<ApplicationRound {application} />
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
