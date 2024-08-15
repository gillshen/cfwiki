<script lang="ts">
	import {
		Table,
		TableHead,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHeadCell,
		A
	} from 'flowbite-svelte';

	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

	import type { ApplicationListItem, ApplicationDetail } from '$lib/api/application';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import { isUndergraduate } from '$lib/api/program';
	import { formatCfNames } from '$lib/api/service';

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
					{#each applications as appl}
						<TableBodyRow>
							<TableBodyCell class="w-4 pl-2">
								<A href={`/application/${appl.id}`}><ArrowUpRightFromSquareOutline /></A>
							</TableBodyCell>
							<TableBodyCell class="max-w-20">{appl.student.fullname}</TableBodyCell>
							<TableBodyCell class="font-normal">
								{formatCfNames(appl.services, '顾问') || '-'}
							</TableBodyCell>
							<TableBodyCell class="font-normal">
								{formatCfNames(appl.services, '文案') || '-'}
							</TableBodyCell>
							{#if isUndergraduate(appl.program)}
								<TableBodyCell class="font-normal">
									<span class="text-gray-400">TODO</span>
								</TableBodyCell>
							{/if}
							<TableBodyCell class="font-normal max-w-16">{appl.round.name}</TableBodyCell>
							<TableBodyCell class="">{appl.latest_log?.status ?? '-'}</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		</svelte:fragment>
	</ApplicationsLoader>
</article>
