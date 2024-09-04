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
		Button
	} from 'flowbite-svelte';

	import type { CfUserListItem } from '$lib/api/user';
	import type { StudentOfCferListItem } from '$lib/api/student';
	import type { ApplicantListItem, ApplicationListItem } from '$lib/api/application';

	import { categorize, groupByTargetYear } from '$lib/utils/studentUtils';
	import UserCohortCard from '$lib/components/list-items/UserCohortCard.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import ApplicationLink from '$lib/components/table-cells/ApplicationLink.svelte';
	import ProgramType from '$lib/components/table-cells/ProgramType.svelte';
	import Student from '$lib/components/table-cells/Student.svelte';
	import Schools from '$lib/components/table-cells/Schools.svelte';
	import ProgramOrMajors from '$lib/components/table-cells/ProgramOrMajors.svelte';
	import ApplicationRound from '$lib/components/table-cells/ApplicationRound.svelte';
	import ShortDate from '$lib/components/table-cells/ShortDate.svelte';
	import ApplicationStatus from '$lib/components/table-cells/ApplicationStatus.svelte';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import ApplicationsAccordian from '$lib/components/containers/ApplicationsAccordian.svelte';
	import { defaultBanner } from '$lib/utils/userUtils';

	import {
		groupByYear,
		orderByStatus,
		orderByDueDate,
		orderByType,
		orderByStudentName,
		orderByRoundName,
		orderBySchoolName
	} from '$lib/utils/applicationUtils';

	export let data: {
		userId: number;
		host: CfUserListItem;
		students: Promise<StudentOfCferListItem[]>;
		applications: Promise<ApplicationListItem[]>;
		applicants: Promise<ApplicantListItem[]>;
	};

	$: userIsHost = data.host.id === data.userId;
</script>

<Heading tag="h1" class="alt-page-title">
	{data.host.public_banner || defaultBanner(data.host.username)}
</Heading>

<Tabs tabStyle="underline" class="mt-8">
	<TabItem title="Students" open>
		{#await data.students}
			<FetchingDataSign />
		{:then students}
			{#if students.length}
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
			{:else}
				<NoDataSign text="None" divClass="mt-6" />
			{/if}
		{/await}

		{#if userIsHost}
			<Button href="/student/new" class="mt-12" outline>Create a student profile</Button>
		{/if}
	</TabItem>

	<TabItem title="Applications">
		<ApplicationsLoader
			applications={data.applications}
			applicants={data.applicants}
			showHeading={false}
		>
			<svelte:fragment let:applications>
				<ApplicationsAccordian groupedApplications={groupByYear(applications)} divClass="-mt-4">
					<svelte:fragment let:subsetOfApplications>
						<Table hoverable={subsetOfApplications.length > 1}>
							<TableHead>
								<TableHeadCell class="pl-2 w-8"></TableHeadCell>
								<TableHeadCell class="w-16">Type</TableHeadCell>
								<TableHeadCell class="w-40">Due/Status</TableHeadCell>
								<TableHeadCell class="w-40">Student</TableHeadCell>
								<TableHeadCell class="w-80">School</TableHeadCell>
								<TableHeadCell class="w-80">Program/Major</TableHeadCell>
								<TableHeadCell class="w-40">Adm. plan</TableHeadCell>
							</TableHead>

							<TableBody>
								{#each subsetOfApplications
									.sort(orderBySchoolName)
									.sort(orderByStudentName)
									.sort(orderByRoundName)
									.sort(orderByType)
									.sort(orderByDueDate)
									.sort(orderByStatus) as appl}
									<TableBodyRow>
										<ApplicationLink application={appl} />
										<ProgramType application={appl} />
										{#if appl.latest_log && appl.latest_log.status !== 'Started'}
											<ApplicationStatus application={appl} />
										{:else}
											<ShortDate date={appl.due_date} />
										{/if}
										<Student application={appl} />
										<Schools application={appl} />
										<ProgramOrMajors application={appl} />
										<ApplicationRound application={appl} />
									</TableBodyRow>
								{/each}
							</TableBody>
						</Table>
					</svelte:fragment>
				</ApplicationsAccordian>
			</svelte:fragment>
		</ApplicationsLoader>
	</TabItem>
</Tabs>
