<script lang="ts">
	import { Table, TableHead, TableBody, TableBodyRow, TableHeadCell } from 'flowbite-svelte';

	import type { ApplicantListItem, ApplicationListItem } from '$lib/api/application';
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
	export let applicants: Promise<ApplicantListItem[]>;
</script>

<article class="col-span-2 mt-16">
	<ApplicationsLoader
		applications={coApplications}
		{applicants}
		heading="Other applicants"
		noDataText="No other applicants this year and term"
	>
		<svelte:fragment let:applications>
			<Table divClass="mt-6" hoverable={applications.length > 1}>
				<TableHead>
					<TableHeadCell class="w-8"></TableHeadCell>
					<TableHeadCell class="w-40">Status</TableHeadCell>
					<TableHeadCell class="w-40">Student</TableHeadCell>
					<TableHeadCell class="w-[30rem]">Major/Track</TableHeadCell>
					<TableHeadCell class="w-40">Adm. plan</TableHeadCell>
					<TableHeadCell class="w-40">顾问</TableHeadCell>
					<TableHeadCell class="w-40">文案</TableHeadCell>
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
							<PlainCell text={formatCfNames(application.services, '顾问')} />
							<PlainCell text={formatCfNames(application.services, '文案')} />
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		</svelte:fragment>
	</ApplicationsLoader>
</article>
