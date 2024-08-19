<script lang="ts">
	import { Table, TableHead, TableBody, TableBodyRow, TableHeadCell } from 'flowbite-svelte';

	import type { ApplicationListItem, ApplicationDetail } from '$lib/api/application';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import ApplicationLink from '$lib/components/table-cells/ApplicationLink.svelte';
	import Student from '$lib/components/table-cells/Student.svelte';
	import ApplicationStatus from '$lib/components/table-cells/ApplicationStatus.svelte';
	import Majors from '$lib/components/table-cells/Majors.svelte';
	import ApplicationRound from '$lib/components/table-cells/ApplicationRound.svelte';
	import PlainCell from '$lib/components/table-cells/PlainCell.svelte';

	import { orderByStudentName, orderByStatus, orderByRoundName } from '$lib/utils/applicationUtils';
	import { isUndergraduate } from '$lib/utils/programUtils';
	import { formatCfNames } from '$lib/utils/serviceUtils';

	export let application: ApplicationDetail;
	export let coApplications: Promise<ApplicationListItem[]>;
</script>

<article class="col-span-2 mt-24">
	<ApplicationsLoader
		applications={coApplications}
		heading="Co-applicants"
		noDataText="No other applicants this year and term"
	>
		<svelte:fragment let:applications>
			<Table class="mt-8" hoverable={applications.length > 1}>
				<TableHead>
					<TableHeadCell></TableHeadCell>
					<TableHeadCell>Student</TableHeadCell>
					<TableHeadCell>顾问</TableHeadCell>
					<TableHeadCell>文案</TableHeadCell>
					{#if isUndergraduate(application.program)}
						<TableHeadCell>Major</TableHeadCell>
					{/if}
					<TableHeadCell>Round</TableHeadCell>
					<TableHeadCell>Status</TableHeadCell>
				</TableHead>

				<TableBody>
					{#each applications
						.sort(orderByStudentName)
						.sort(orderByStatus)
						.sort(orderByRoundName) as appl}
						<TableBodyRow>
							<ApplicationLink application={appl} />
							<Student application={appl} />
							<PlainCell text={formatCfNames(appl.services, '顾问')} />
							<PlainCell text={formatCfNames(appl.services, '文案')} />
							{#if isUndergraduate(appl.program)}
								<Majors application={appl} maxWidth="14rem" />
							{/if}
							<ApplicationRound application={appl} />
							<ApplicationStatus application={appl} />
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		</svelte:fragment>
	</ApplicationsLoader>
</article>
