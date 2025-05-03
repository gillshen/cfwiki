<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as HoverCard from '$lib/components/ui/hover-card/index';
	import * as Alert from '$lib/components/ui/alert';
	import Button from '$lib/components/ui/button/button.svelte';
	import Venus from 'lucide-svelte/icons/venus';
	import Mars from 'lucide-svelte/icons/mars';
	import NonBinary from 'lucide-svelte/icons/non-binary';
	import Pencil from 'lucide-svelte/icons/pencil-line';
	import LayoutGrid from 'lucide-svelte/icons/layout-grid';
	import List from 'lucide-svelte/icons/list';
	import Calendar from 'lucide-svelte/icons/calendar';
	import GraduationCap from 'lucide-svelte/icons/graduation-cap';
	import BookCheck from 'lucide-svelte/icons/book-check';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';

	import * as Timeline from '$lib/components/widgets/timeline/index';
	import * as ScoreCard from '$lib/components/widgets/score-card/index';
	import Section from '$lib/components/containers/Section.svelte';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import ContractCard from '$lib/components/widgets/ContractCard.svelte';
	import StudentApplicationCard from '$lib/components/widgets/StudentApplicationCard.svelte';
	import StudentApplicationsTable from '$lib/components/widgets/StudentApplicationsTable.svelte';

	import countryFlags from '$lib/constants/countries';
	import { formatLocation } from '$lib/util/studentUtils';
	import { canEdit as canEditContract } from '$lib/util/contractUtils';
	import { orderBySchoolName, orderByStatus, orderByYearDesc } from '$lib/util/applicationUtils';
	import { activeYears, toShortDate, toShortYearMonth } from '$lib/util/dateUtils';
	import { formatEnrollmentDates } from '$lib/util/enrollmentUtils';
	import { academicTerms } from '$lib/constants/progressions';
	import { actOverall, ieltsOverall, toeflOverall } from '$lib/util/scoresUtils';
	import { createTitle } from '$lib/util/siteUtils';
	import type { ComponentType } from 'svelte';

	export let data;

	const genderMap: Record<'male' | 'female' | 'other', ComponentType> = {
		male: Mars,
		female: Venus,
		other: NonBinary
	};

	const form = superForm(data.newApplicationPrepForm);
	const { form: formData, enhance } = form;

	$: contractItems = data.student.contracts
		.filter((contract) => canEditContract({ user: data.user, contract }))
		.map((contract) => ({
			value: contract.id.toString(),
			label: `${contract.type} ${contract.target_year}`
		}));

	const applicationTypeMap: Record<string, string[]> = {
		'': [],
		'UG Freshman': ['UG Freshman', 'Non-degree'],
		'UG Transfer': ['UG Transfer', 'Non-degree'],
		Graduate: ['Graduate', 'Non-degree'],
		Other: ['Non-degree']
	};

	let relevantApplicationTypes: string[] = [];
	let relevantYears: number[] = [];

	const onContractSelection = () => {
		const selectedContractId = parseInt($formData.contract as unknown as string);
		const selectedContract = data.student.contracts.find((c) => c.id === selectedContractId);
		relevantApplicationTypes = applicationTypeMap[selectedContract?.type ?? ''];
		relevantYears = activeYears().filter((y) => y <= (selectedContract?.target_year ?? 9999));
	};
</script>

<svelte:head>
	<title>{createTitle(data.student.fullname)}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/student/index">Students</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>{data.student.fullname}</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<section class="w-fit min-w-[60ch] mb-2 space-y-2 pb-8">
	<h1 class="page-title">
		{data.student.fullname}
		{#if data.student.preferred_name}
			&nbsp;{data.student.preferred_name}
		{/if}
	</h1>
	<div class="flex flex-row gap-2 items-center text-sm">
		<svelte:component this={genderMap[data.student.gender]} class="size-4" />
		<div class="text-gray-400">&bullet;</div>
		<div>{countryFlags[data.student.citizenship]}</div>
		<div>{data.student.citizenship}</div>
		{#if data.student.date_of_birth}
			<div class="text-gray-400">&bullet;</div>
			<div>b. {toShortDate(data.student.date_of_birth)}</div>
		{/if}
		<div class="text-gray-400">&bullet;</div>
		<div>@ {formatLocation(data.student)}</div>

		{#if data.userCanEdit}
			<Button
				variant="link"
				href="/student/{data.student.id}/update"
				class="ml-2 font-normal text-muted-foreground hover:no-underline hover:text-secondary-foreground/80"
			>
				<Pencil class="mr-1 size-4" />Edit
			</Button>
		{/if}
	</div>
	{#if data.student.comments}
		<div class="text-sm pb-2 text-stone-600 max-w-[40ch]">{data.student.comments}</div>
	{/if}

	{#if data.student.contracts.length}
		<div class="flex gap-4 flex-wrap pt-4">
			{#each data.student.contracts as contract}
				<ContractCard {contract} canEdit={canEditContract({ user: data.user, contract })} />
			{/each}
		</div>
		{#if data.userCanEdit}
			<div class="pt-4">
				<Button
					variant="outline"
					href="/student/{data.student.id}/contract/new"
					class="text-primary hover:no-underline">Add Contract</Button
				>
			</div>
		{/if}
	{:else}
		<Alert.Root class="w-fit pr-6 max-w-prose border-none bg-yellow-300">
			<TriangleAlert class="size-4" />
			<Alert.Title>We need a contract!</Alert.Title>
			<Alert.Description>
				<p>This student is not associated with any contract. Add one below.</p>
				<Button href="/student/{data.student.id}/contract/new" class="hover:no-underline mt-4"
					>Add Contract</Button
				>
			</Alert.Description>
		</Alert.Root>
	{/if}
</section>

<Section id="education" title="Education">
	{#key data.student}
		{#if data.student.enrollments.length}
			<Timeline.Root class="pb-2">
				{#each data.student.enrollments as enrollment}
					<Timeline.Item class="min-h-[120px] w-full">
						<h3 class="text-base font-semibold flex items-center pb-2">
							<a href="/school/{enrollment.school.id}" class="text-inherit"
								>{enrollment.school.name}</a
							>
							{#if data.userCanEdit}
								<Button
									variant="link"
									href="/student/{data.student.id}/edu/{enrollment.id}"
									class="ml-2 font-normal text-muted-foreground hover:no-underline hover:text-secondary-foreground/80 h-6"
								>
									<Pencil class="mr-1 size-4" />Edit
								</Button>
							{/if}
						</h3>

						<div class="flex flex-col gap-2">
							<div class="text-muted-foreground flex items-center gap-1.5">
								<Calendar class="size-4" />
								{formatEnrollmentDates(enrollment, toShortYearMonth)}
							</div>
							{#if enrollment.curriculum}
								<div class="text-muted-foreground flex items-center gap-1.5">
									<GraduationCap class="size-4" />
									{enrollment.curriculum}
								</div>
							{/if}
							<!-- TODO -->
							<div class="text-muted-foreground flex items-center gap-1.5">
								<BookCheck class="size-4" />
								<HoverCard.Root>
									<HoverCard.Trigger class="underline decoration-dotted hover:decoration-dotted"
										>GPA: (TODO)</HoverCard.Trigger
									>
									<HoverCard.Content class="w-[480px]">
										<pre
											class="mt-1 text-sm bg-gray-100 rounded-md p-2 w-full max-h-[200px] overflow-auto">{JSON.stringify(
												enrollment.grades,
												null,
												2
											)}</pre>
									</HoverCard.Content>
								</HoverCard.Root>
							</div>
						</div>
					</Timeline.Item>
				{/each}
			</Timeline.Root>
		{/if}
	{/key}

	{#if data.userCanEdit}
		<div class="pt-2">
			<Button
				variant="outline"
				href="/student/{data.student.id}/edu/new"
				class="text-primary hover:no-underline">Add Experience</Button
			>
		</div>
	{/if}
</Section>

<Section id="test-scores" title="Test Scores">
	<div class="flex gap-6 flex-wrap items-stretch pt-2 empty:pt-0">
		{#key data.student}{#each data.student.act as score}
				<ScoreCard.Root testName="ACT" testDate={score.date} scoreValue={actOverall(score)}>
					<ScoreCard.ActBarSet {score} />
				</ScoreCard.Root>
			{/each}{#each data.student.toefl as score}
				<ScoreCard.Root testName="TOEFL" testDate={score.date} scoreValue={toeflOverall(score)}>
					<ScoreCard.ToeflBarSet {score} />
				</ScoreCard.Root>
			{/each}{#each data.student.ielts as score}
				<ScoreCard.Root
					testName="IELTS"
					testDate={score.date}
					scoreValue={ieltsOverall(score)?.toFixed(1)}
				>
					<ScoreCard.IeltsBarSet {score} />
				</ScoreCard.Root>
			{/each}{#each data.student.duolingo as score}
				<ScoreCard.Root testName="Duolingo" testDate={score.date} scoreValue={score.overall}>
					<ScoreCard.DuolingoBarSet {score} />
				</ScoreCard.Root>
			{/each}{/key}{#if data.userCanEdit}
			<div class="w-full">
				<ButtonDialog buttonText="Add Test" dialogTitle="Add Test">
					<div>Dialog body</div>
				</ButtonDialog>
			</div>
		{/if}
	</div>
</Section>

<Section id="applications" title="Applications">
	{#await data.applications}
		<LoadingSign />
	{:then applications}
		{#if applications.length}
			<Tabs.Root value="grid-layout">
				<Tabs.List class="flex w-fit gap-1">
					<Tabs.Trigger value="grid-layout" class="size-7"
						><LayoutGrid class="size-4 shrink-0" /></Tabs.Trigger
					>
					<Tabs.Trigger value="table-layout" class="size-7"
						><List class="size-4 shrink-0" /></Tabs.Trigger
					>
					<!-- TODO -->
					<div class="bg-white p-1 rounded-sm">(TODO filters)</div>
				</Tabs.List>
				<Tabs.Content value="grid-layout">
					<div class="my-4 grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-6 w-fit">
						{#each applications
							.sort(orderBySchoolName)
							.sort(orderByStatus)
							.sort(orderByYearDesc) as application}
							<a href="/application/{application.id}" target="_self" class="hover:no-underline">
								<StudentApplicationCard
									{application}
									class="max-w-[360px] shadow-none hover:bg-muted/50"
								/>
							</a>
						{/each}
					</div>
				</Tabs.Content>
				<Tabs.Content value="table-layout">
					<StudentApplicationsTable {applications} />
				</Tabs.Content>
			</Tabs.Root>
		{/if}

		{#if data.userCanEdit}
			<div class={applications.length ? '' : 'mt-2'}>
				<ButtonDialog
					buttonText="Create Applications"
					dialogTitle="Create Applications"
					disabled={!data.student.contracts.length}
				>
					<form
						method="POST"
						action="?/startApplication"
						class="max-w-prose space-y-4 my-4 mx-auto"
						id="new-application-prep-form"
						use:enhance
					>
						<input name="username" value={data.username} hidden />
						<input type="number" name="student" value={data.student.id} hidden />
						<Combobox
							{form}
							name="contract"
							label="Contract"
							items={contractItems}
							postSelect={onContractSelection}
						/>
						<Combobox
							{form}
							name="type"
							label="Application type"
							items={relevantApplicationTypes}
						/>
						<Combobox {form} name="year" label="Year of admission" items={relevantYears} />
						<Combobox {form} name="term" label="Term" items={academicTerms} />
						<Form.Button class="w-fit min-w-24">Next</Form.Button>
					</form>
				</ButtonDialog>
			</div>
		{/if}
	{/await}
</Section>

{#if data.userCanEdit}
	<Section id="delete" hrule>
		<Button variant="destructive" class="w-fit">Delete Profile</Button>
	</Section>
{/if}
