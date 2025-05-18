<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms';
	import { cn } from '$lib/utils';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as HoverCard from '$lib/components/ui/hover-card/index';
	import * as Alert from '$lib/components/ui/alert';
	import Button from '$lib/components/ui/button/button.svelte';
	import LayoutGrid from 'lucide-svelte/icons/layout-grid';
	import List from 'lucide-svelte/icons/list';
	import Calendar from 'lucide-svelte/icons/calendar';
	import GraduationCap from 'lucide-svelte/icons/graduation-cap';
	import BookCheck from 'lucide-svelte/icons/book-check';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
	import UserPen from 'lucide-svelte/icons/user-pen';

	import * as Timeline from '$lib/components/widgets/timeline/index';
	import * as ScoreCard from '$lib/components/widgets/score-card/index';
	import Section from '$lib/components/containers/Section.svelte';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import MoveRightButton from '$lib/components/misc/MoveRightButton.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import ContractCard from '$lib/components/widgets/ContractCard.svelte';
	import StudentApplicationCard from '$lib/components/widgets/StudentApplicationCard.svelte';
	import StudentApplicationsTable from '$lib/components/widgets/StudentApplicationsTable.svelte';

	import countryFlags from '$lib/constants/countries';
	import { formatLocation } from '$lib/util/studentUtils';

	import {
		userCanEdit as canEditContract,
		orderByStatusTargetYearDesc
	} from '$lib/util/contractUtils';

	import { orderBySchoolName, orderByStatus, orderByYearDesc } from '$lib/util/applicationUtils';
	import { activeYears, toShortDate, toShortYearMonth } from '$lib/util/dateUtils';
	import { formatEnrollmentDates, orderByDatesDesc } from '$lib/util/enrollmentUtils';
	import { actOverall, ieltsOverall, toeflOverall } from '$lib/util/scoresUtils';
	import { createTitle } from '$lib/util/siteUtils';
	import { ACADEMIC_TERMS } from '$lib/constants/progressions';
	import { toTitleCase } from '$lib/util/stringUtils';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	export let data;

	const form = superForm(data.newApplicationPrepForm);
	const { form: formData, enhance } = form;

	$: contractItems = data.student.contracts
		.filter((contract) => canEditContract({ user: data.user, contract }))
		.map((contract) => ({
			value: contract.id.toString(),
			label: `${contract.type} ${contract.target_year}`
		}));

	$: hasTestScores =
		data.student.sat.length ||
		data.student.act.length ||
		data.student.ap.length ||
		data.student.ib.length ||
		data.student.alevel.length ||
		data.student.gre.length ||
		data.student.gmat.length ||
		data.student.lsat.length ||
		data.student.toefl.length ||
		data.student.ielts.length ||
		data.student.duolingo.length;

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

	afterNavigate(() => {
		// simplify contract creation by writing in likely values
		const contractsInEffect = data.student.contracts.filter(
			(contract) => contract.status === 'In effect'
		);
		if (contractsInEffect.length === 1) {
			const { id, type, target_year } = contractsInEffect[0];
			$formData.contract = id.toString() as unknown as number;
			$formData.type = type;
			$formData.year = target_year.toString() as unknown as number;
			onContractSelection();
		}
	});
</script>

<svelte:head>
	<title>{createTitle(data.student.fullname)}</title>
</svelte:head>

<section
	class="sticky top-[60px] h-[calc(100vh-60px)] w-[360px] max-w-[360px] shrink-0 px-4 pt-4 overflow-auto"
>
	<BreadcrumbContainer class="static bg-transparent">
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/student/index">Students</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page>{data.student.fullname}</Breadcrumb.Page>
		</Breadcrumb.Item>
	</BreadcrumbContainer>

	<section class="flex flex-col text-sm h-[calc(100vh-60px-70px)] grow-0">
		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-2 mb-4">
				<h2 class="page-title">
					{data.student.fullname}
					{data.student.preferred_name || ''}
				</h2>
			</div>

			<!-- citizenship -->
			<hgroup class="flex flex-col gap-0.5">
				<h3 class="text-muted-foreground/70">Citizenship</h3>
				<p>
					{data.student.citizenship}&nbsp; {countryFlags[data.student.citizenship]}
				</p>
			</hgroup>

			<!-- gender -->
			<hgroup class="flex flex-col gap-0.5">
				<h3 class="text-muted-foreground/70">Gender</h3>
				<p>{toTitleCase(data.student.gender)}</p>
			</hgroup>

			<!-- date of birth -->
			<hgroup class="flex flex-col gap-0.5">
				<h3 class="text-muted-foreground/70">Date of Birth</h3>
				{#if data.student.date_of_birth}
					<p>{toShortDate(data.student.date_of_birth)}</p>
				{:else}
					<p class="text-muted-foreground/70">n/a</p>
				{/if}
			</hgroup>

			<!-- residence -->
			<hgroup class="flex flex-col gap-0.5">
				<h3 class="text-muted-foreground/70">Residence</h3>
				{#if data.student.base_country}
					<p>{formatLocation(data.student)}</p>
				{:else}
					<p class="text-muted-foreground/70">n/a</p>
				{/if}
			</hgroup>

			<!-- comments -->
			<hgroup class="flex flex-col gap-0.5">
				<h3 class="text-muted-foreground/70">Comments</h3>
				{#if data.student.comments}
					<p>{data.student.comments}</p>
				{:else}
					<p class="text-muted-foreground/70">n/a</p>
				{/if}
			</hgroup>
		</div>

		{#if data.userCanEdit}
			<div class="flex items-center space-x-2 mt-12 my-8">
				<Switch id="edit-mode" />
				<Label for="edit-mode" class="font-normal">Edit Mode</Label>
			</div>
		{/if}
	</section>
</section>

<div class="pt-8 pl-6 w-[752px]">
	<Section
		id="contracts"
		title={data.student.contracts.length > 1 ? 'Contracts' : 'Contract'}
		class="bg-muted/50 px-8 py-6 mb-6 rounded-xl"
	>
		{#if data.student.contracts.length}
			<div class="flex gap-6 flex-wrap">
				{#each data.student.contracts.sort(orderByStatusTargetYearDesc) as contract}
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
			<Alert.Root class="w-fit h-[180px] pr-8 mt-4 max-w-prose border-none bg-yellow-300">
				<TriangleAlert class="size-4" />
				<Alert.Title>We need a contract!</Alert.Title>
				<Alert.Description class="h-full flex flex-col">
					<p>This student is not associated with any contract. Add one below.</p>
					<div class="flex-grow flex justify-center items-center">
						<Button href="/student/{data.student.id}/contract/new" class="hover:no-underline"
							>Add Contract</Button
						>
					</div>
				</Alert.Description>
			</Alert.Root>
		{/if}
	</Section>

	<Section id="education" title="Education" class="bg-muted/50 px-8 py-6 mb-6 rounded-xl">
		{#key data.student}
			{#if data.student.enrollments.length}
				<Timeline.Root class="pb-2">
					{#each data.student.enrollments.sort(orderByDatesDesc) as enrollment, index}
						<Timeline.Item class="min-h-[120px] w-full">
							<h3 class="text-base font-semibold flex items-center pb-2 h-8 overflow-visible">
								<a href="/school/{enrollment.school.id}" class="text-inherit"
									>{enrollment.school.name}</a
								>
								{#if data.userCanEdit}
									<MoveRightButton
										href="/student/{data.student.id}/edu/{enrollment.id}"
										class="ml-2"
									/>
								{/if}
							</h3>

							<fieldset
								class={cn(
									'flex flex-col gap-2 pt-2',
									index < data.student.enrollments.length - 1 ? 'pb-8' : ''
								)}
							>
								<div class="text-muted-foreground flex items-center gap-2">
									<Calendar class="size-4 text-primary" />
									{formatEnrollmentDates(enrollment, toShortYearMonth)}
								</div>
								<div class="text-muted-foreground flex items-center gap-2">
									<GraduationCap class="size-4 text-primary" />
									<div class="flex items-center gap-1">
										{#if enrollment.curriculum}
											{enrollment.curriculum}
											{#if enrollment.program_type === 'UG Transfer'}
												<div class="text-muted-foreground/50">&bullet;</div>
												<div>Transfer</div>
											{/if}
										{:else}
											{enrollment.program_type}
										{/if}
									</div>
								</div>
								<!-- TODO -->
								<div class="text-muted-foreground flex items-center gap-2">
									<BookCheck class="size-4 text-primary" />
									<HoverCard.Root>
										<HoverCard.Trigger
											class="underline underline-offset-4 decoration-dotted hover:decoration-dotted hover:decoration-mint-600"
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
							</fieldset>
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

	<Section id="test-scores" title="Test Scores" class="bg-muted/50 px-8 py-6 mb-6 rounded-xl">
		{#key data.student}
			{#if hasTestScores}
				<div class="flex gap-6 flex-wrap items-stretch pt-2">
					{#each data.student.act as score}
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
					{/each}
				</div>
			{/if}
		{/key}
		{#if data.userCanEdit}
			<div class={cn('w-full', hasTestScores ? 'pt-4' : 'pt-2')}>
				<ButtonDialog buttonText="Add Test" dialogTitle="Add Test">
					<div>Dialog body</div>
				</ButtonDialog>
			</div>
		{/if}
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
						<div class="my-4 grid lg:grid-cols-2 xl:grid-cols-3 gap-6 w-fit">
							{#each applications
								.sort(orderBySchoolName)
								.sort(orderByStatus)
								.sort(orderByYearDesc) as application}
								<a href="/application/{application.id}" target="_self" class="hover:no-underline">
									<StudentApplicationCard {application} class="max-w-[360px] hover:bg-muted/50" />
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
						disabled={!data.canCreateApplications}
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
							<Combobox {form} name="term" label="Term" items={[...ACADEMIC_TERMS]} />
							<Form.Button class="w-fit min-w-24">Next</Form.Button>
						</form>
					</ButtonDialog>
				</div>
			{/if}
		{/await}
	</Section>
</div>
