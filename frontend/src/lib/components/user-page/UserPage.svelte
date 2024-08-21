<script lang="ts">
	import {
		Heading,
		Tabs,
		TabItem,
		Table,
		TableHead,
		TableBody,
		TableBodyRow,
		TableHeadCell,
		Badge,
		Button
	} from 'flowbite-svelte';

	import type { CfUserListItem } from '$lib/api/user';
	import type { StudentByUserListItem } from '$lib/api/student';
	import type { ApplicationListItem } from '$lib/api/application';

	import { categorize, groupByTargetYear } from '$lib/utils/studentUtils';
	import UserCohortCard from '$lib/components/list-items/UserCohortCard.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import ApplicationLink from '$lib/components/table-cells/ApplicationLink.svelte';
	import ProgramType from '$lib/components/table-cells/ProgramType.svelte';
	import Student from '$lib/components/table-cells/Student.svelte';
	import Schools from '$lib/components/table-cells/Schools.svelte';
	import ProgramOrMajors from '$lib/components/table-cells/ProgramOrMajors.svelte';
	import ApplicationRound from '$lib/components/table-cells/ApplicationRound.svelte';
	import ShortDate from '$lib/components/table-cells/ShortDate.svelte';
	import ApplicationStatus from '$lib/components/table-cells/ApplicationStatus.svelte';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';

	import {
		orderByDueDate,
		orderByStatus,
		orderByStudentName,
		orderBySchoolName,
		groupByYear,
		orderByRoundName
	} from '$lib/utils/applicationUtils';

	export let data: {
		userId: number;
		host: CfUserListItem;
		students: Promise<StudentByUserListItem[]>;
		applications: Promise<ApplicationListItem[]>;
	};

	const userIsHost = data.host.id === data.userId;
</script>

<Heading tag="h1" class="alt-page-title">
	{(userIsHost ? data.host.private_banner : data.host.public_banner) ||
		`${data.host.username}\u2019s Mojo Dojo Casa House`}
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
						<Heading tag="h2" class="text-xl tabular-nums">{year.trim()}</Heading>

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
		<ApplicationsLoader applications={data.applications} showHeading={false}>
			<svelte:fragment let:applications>
				<div class="flex flex-col gap-12">
					{#each Object.entries(groupByYear(applications)) as [year, appls]}
						<div>
							<Heading tag="h2" class="flex items-center gap-2 text-xl tabular-nums mb-4">
								{year.trim()}
								<Badge>{appls.length}</Badge>
							</Heading>

							<Table divClass="mt-4" hoverable={appls.length > 1}>
								<TableHead>
									<TableHeadCell class="pl-2"></TableHeadCell>
									<TableHeadCell>Type</TableHeadCell>
									<TableHeadCell>Due/Status</TableHeadCell>
									<TableHeadCell>Student</TableHeadCell>
									<TableHeadCell>School</TableHeadCell>
									<TableHeadCell>Program/Major</TableHeadCell>
									<TableHeadCell>Round</TableHeadCell>
								</TableHead>

								<TableBody>
									{#each appls
										.sort(orderBySchoolName)
										.sort(orderByStudentName)
										.sort(orderByRoundName)
										.sort(orderByDueDate)
										.sort(orderByStatus) as appl}
										<TableBodyRow>
											<ApplicationLink application={appl} />
											<ProgramType application={appl} />
											{#if appl.latest_log?.status && appl.latest_log.status !== 'Started'}
												<ApplicationStatus application={appl} />
											{:else}
												<ShortDate date={appl.round.due_date} />
											{/if}
											<Student application={appl} />
											<Schools application={appl} />
											<ProgramOrMajors application={appl} />
											<ApplicationRound application={appl} />
										</TableBodyRow>
									{/each}
								</TableBody>
							</Table>
						</div>
					{/each}
				</div>
			</svelte:fragment>
		</ApplicationsLoader>
	</TabItem>
</Tabs>
