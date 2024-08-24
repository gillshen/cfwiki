<script lang="ts">
	import { Table, TableHead, TableBody, TableBodyRow, TableHeadCell } from 'flowbite-svelte';

	import type { ApplicationListItem } from '$lib/api/application';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import ApplicationLink from '$lib/components/table-cells/ApplicationLink.svelte';
	import Student from '$lib/components/table-cells/Student.svelte';
	import ApplicationStatus from '$lib/components/table-cells/ApplicationStatus.svelte';
	import MajorsOrTrack from '$lib/components/table-cells/MajorsOrTrack.svelte';
	import ApplicationRound from '$lib/components/table-cells/ApplicationRound.svelte';
	import PlainCell from '$lib/components/table-cells/PlainCell.svelte';

	import { orderByStudentName, orderByStatus, orderByRoundName } from '$lib/utils/applicationUtils';
	import { formatCfNames } from '$lib/utils/serviceUtils';

	export let coApplications: Promise<ApplicationListItem[]>;
</script>

<article class="col-span-2 mt-16">
	<ApplicationsLoader
		applications={coApplications}
		heading="Co-applicants"
		noDataText="No other applicants this year and term"
	>
		<svelte:fragment let:applications>
			<Table divClass="mt-8" hoverable={applications.length > 1}>
				<TableHead>
					<TableHeadCell></TableHeadCell>
					<TableHeadCell>Student</TableHeadCell>
					<TableHeadCell>顾问</TableHeadCell>
					<TableHeadCell>文案</TableHeadCell>
					<TableHeadCell>Major/Track</TableHeadCell>
					<TableHeadCell>Adm. plan</TableHeadCell>
					<TableHeadCell>Status</TableHeadCell>
				</TableHead>

				<TableBody>
					{#each applications
						.sort(orderByStudentName)
						.sort(orderByStatus)
						.sort(orderByRoundName) as application}
						<TableBodyRow>
							<ApplicationLink {application} />
							<Student {application} />
							<PlainCell text={formatCfNames(application.services, '顾问')} />
							<PlainCell text={formatCfNames(application.services, '文案')} />
							<MajorsOrTrack {application} />
							<ApplicationRound {application} />
							<ApplicationStatus {application} />
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		</svelte:fragment>
	</ApplicationsLoader>
</article>
