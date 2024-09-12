<script lang="ts">
	import { Table, TableBody, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

	import type { ComposedApplication } from '$lib/api/application';
	import { orderByStudentName, orderByStatus, orderByRoundName } from '$lib/utils/applicationUtils';

	import ApplicationLink from '$lib/components/table-cells/ApplicationLink.svelte';
	import Student from '$lib/components/table-cells/Student.svelte';
	import MajorsOrTrack from '$lib/components/table-cells/MajorsOrTrack.svelte';
	import ApplicationRound from '$lib/components/table-cells/ApplicationRound.svelte';
	import ApplicationStatus from '$lib/components/table-cells/ApplicationStatus.svelte';
	import ShortDate from '$lib/components/table-cells/ShortDate.svelte';

	export let applications: ComposedApplication[];
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
				<MajorsOrTrack {application} />
				<ApplicationRound {application} />
				<ShortDate date={application.due_date} />
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
