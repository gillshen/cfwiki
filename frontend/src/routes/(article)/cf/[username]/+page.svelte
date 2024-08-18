<script lang="ts">
	import {
		Heading,
		Tabs,
		TabItem,
		Table,
		TableHead,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHeadCell,
		A,
		Badge,
		Button
	} from 'flowbite-svelte';

	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

	import {
		orderByDueDate,
		orderByStatus,
		formatMajors,
		orderByStudentName,
		orderBySchoolName,
		groupByYear
	} from '$lib/utils/applicationUtils';

	import { categorize, groupByTargetYear } from '$lib/utils/studentUtils';
	import { toShortDate } from '$lib/utils/dateUtils';
	import { isUndergraduate } from '$lib/api/program';
	import UserCohortCard from '$lib/components/list-items/UserCohortCard.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';

	export let data;
</script>

<Heading tag="h1" class="alt-page-title">
	{data.host.public_banner || `${data.host.username}\u2019s Mojo Dojo Casa House`}
</Heading>

<Tabs tabStyle="underline" class="mt-8">
	<TabItem title="Students" open>
		{#await data.students}
			<FetchingDataSign />
		{:then students}
			<div class="flex flex-col gap-12">
				{#each Object.entries(groupByTargetYear(data.host.username, students)) as [year, cohort]}
					{@const cohorts = categorize(cohort)}

					<div class="flex flex-col">
						<Heading tag="h3" class="text-2xl tabular-nums">{year.trim()}</Heading>

						<div class="grid grid-cols-3 gap-8 mt-4">
							{#each Object.entries(cohorts) as [contractType, cohort]}
								{#if cohort.length}
									<UserCohortCard {contractType} {cohort} />
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/await}

		{#if data.userId === data.host.id}
			<Button href="/student/new" class="mt-12" outline>Create a student file</Button>
		{/if}
	</TabItem>

	<TabItem title="Applications">
		{#await data.applications}
			<FetchingDataSign />
		{:then applications}
			<div class="flex flex-col gap-12">
				{#each Object.entries(groupByYear(applications)) as [year, appls]}
					<div>
						<Heading tag="h3" class="flex items-center gap-2 text-2xl tabular-nums mb-4">
							{year.trim()}
							<Badge>{appls.length}</Badge>
						</Heading>

						<Table hoverable={appls.length > 1}>
							<TableHead>
								<TableHeadCell class="pl-2"></TableHeadCell>
								<TableHeadCell>Type</TableHeadCell>
								<TableHeadCell>Student</TableHeadCell>
								<TableHeadCell>School</TableHeadCell>
								<TableHeadCell>Program/Major</TableHeadCell>
								<TableHeadCell>Round</TableHeadCell>
								<TableHeadCell>Due/Status</TableHeadCell>
							</TableHead>

							<TableBody>
								{#each appls
									.sort(orderBySchoolName)
									.sort(orderByStudentName)
									.sort(orderByDueDate)
									.sort(orderByStatus) as appl}
									<TableBodyRow>
										<TableBodyCell class="w-4 pl-2">
											<A href={`/application/${appl.id}`}><ArrowUpRightFromSquareOutline /></A>
										</TableBodyCell>

										<TableBodyCell class="font-normal max-w-30">{appl.program.type}</TableBodyCell>
										<TableBodyCell class="font-normal">{appl.student.fullname}</TableBodyCell>
										<TableBodyCell class="w-fit max-w-56 truncate font-normal">
											{appl.schools.map((s) => s.name).join(' + ')}
										</TableBodyCell>

										<TableBodyCell class="font-normal max-w-48 truncate">
											{#if isUndergraduate(appl.program)}
												{formatMajors(appl) || '-'}
											{:else}
												{appl.program.display_name}
											{/if}
										</TableBodyCell>

										<TableBodyCell class="font-normal max-w-16">{appl.round.name}</TableBodyCell>
										{#if appl.latest_log?.status && appl.latest_log.status !== 'Started'}
											<TableBodyCell>
												{appl.latest_log?.status || '-'}
											</TableBodyCell>
										{:else}
											<TableBodyCell class="font-normal">
												{toShortDate(appl.round.due_date) || '-'}
											</TableBodyCell>
										{/if}
									</TableBodyRow>
								{/each}
							</TableBody>
						</Table>
					</div>
				{/each}
			</div>
		{/await}
	</TabItem>
</Tabs>
