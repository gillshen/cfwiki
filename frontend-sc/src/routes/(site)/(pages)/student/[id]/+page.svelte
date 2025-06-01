<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms';
	import { cn } from '$lib/utils';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as HoverCard from '$lib/components/ui/hover-card/index';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Plus from 'lucide-svelte/icons/plus';
	import MoveRight from 'lucide-svelte/icons/move-right';
	import UserPen from 'lucide-svelte/icons/user-pen';
	import Receipt from 'lucide-svelte/icons/receipt';
	import GraduationCap from 'lucide-svelte/icons/graduation-cap';
	import BookCheck from 'lucide-svelte/icons/book-check';
	import LayoutGrid from 'lucide-svelte/icons/layout-grid';
	import List from 'lucide-svelte/icons/list';

	import * as StudentPage from '$lib/components/widgets/student-page/index';
	import Section from '$lib/components/containers/Section.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import StudentApplicationCard from '$lib/components/widgets/StudentApplicationCard.svelte';
	import StudentApplicationsTable from '$lib/components/widgets/StudentApplicationsTable.svelte';

	import {
		userCanEdit as canEditContract,
		orderByStatusTargetYearDesc
	} from '$lib/util/contractUtils';

	import { orderBySchoolName, orderByStatus, orderByYearDesc } from '$lib/util/applicationUtils';
	import { activeYears } from '$lib/util/dateUtils';
	import { orderByDatesDesc } from '$lib/util/enrollmentUtils';
	import { actOverall, ieltsOverall, toeflOverall } from '$lib/util/scoresUtils';
	import { createTitle } from '$lib/util/siteUtils';
	import { ACADEMIC_TERMS } from '$lib/constants/progressions';

	export let data;

	let editMode = false;

	const form = superForm(data.newApplicationPrepForm);
	const { form: formData, enhance } = form;

	$: editableContracts = data.student.contracts.filter((contract) =>
		canEditContract({ user: data.user, contract })
	);

	$: contractItems = editableContracts.map((contract) => ({
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

	afterNavigate(() => {
		// simplify application creation by writing in likely values
		const contractsInEffect = data.student.contracts.filter(
			(contract) =>
				contract.status === 'In effect' && canEditContract({ user: data.user, contract })
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

<StudentPage.Layout>
	<svelte:fragment slot="breadcrumb">
		<Breadcrumb.Item>
			<Breadcrumb.Page>{data.student.fullname}</Breadcrumb.Page>
		</Breadcrumb.Item>
	</svelte:fragment>

	<StudentPage.Header student={data.student} slot="header" />

	<div slot="aside">
		{#if editMode}
			<StudentPage.Section title="Personal Info" icon={UserPen} contentClass="min-h-[160px]">
				<Button variant="link" href="/student/{data.student.id}/update"
					>Edit personal info<MoveRight class="size-4 ml-2" /></Button
				>
			</StudentPage.Section>
		{:else}
			<StudentPage.Bio student={data.student} />
		{/if}
	</div>

	{#if data.userCanEdit}
		<div class="w-[600px] mt-[72px] mb-[27px]">
			<div class="flex items-center space-x-2 w-fit ml-auto">
				<Switch id="edit-mode" bind:checked={editMode} />
				<Label
					for="edit-mode"
					class={cn('font-normal text-sm', editMode ? '' : 'text-muted-foreground')}>Edit</Label
				>
			</div>
		</div>
	{/if}

	<div class={cn('flex flex-col gap-8', data.userCanEdit ? 'pt-4' : 'mt-[138px]')}>
		<StudentPage.Section
			title={data.student.contracts.length > 1 ? 'Contacts' : 'Contract'}
			icon={Receipt}
			footer={editMode}
		>
			<div class="flex flex-col gap-2">
				{#each data.student.contracts as contract}
					<StudentPage.Contract
						{contract}
						{editMode}
						editable={canEditContract({ user: data.user, contract })}
						href="/student/{data.student.id}/contract/{contract.id}"
					/>
				{/each}
			</div>
			<Button
				slot="footer"
				variant="ghost"
				size="icon"
				href="/student/{data.student.id}/contract/new"
				class="bg-white border rounded-full shadow-md ml-2 mt-4"><Plus class="size-4" /></Button
			>
		</StudentPage.Section>

		<StudentPage.Section title="Educational Experiences" icon={GraduationCap} footer={editMode}>
			<div class="flex flex-col gap-2">
				{#if data.student.enrollments.length}
					{#each data.student.enrollments.sort(orderByDatesDesc) as enrollment}
						<StudentPage.Enrollment
							{enrollment}
							{editMode}
							editable={data.userCanEdit}
							href="/student/{data.student.id}/edu/{enrollment.id}"
						/>
					{/each}
				{:else}
					<p class="text-muted-foreground px-4">No record</p>
				{/if}
			</div>
			<Button
				slot="footer"
				variant="ghost"
				size="icon"
				href="/student/{data.student.id}/edu/new"
				class="bg-white border rounded-full shadow-md ml-2 mt-4"><Plus class="size-4" /></Button
			>
		</StudentPage.Section>

		<hgroup>
			<h3 class="text-sm text-muted-foreground mb-2 px-5 flex items-center">
				<BookCheck class="size-3 mr-2" />Test Scores
			</h3>
			<Card.Root class="text-sm shadow-none max-w-prose">
				<Card.Content class="pt-4">
					<div class="flex flex-col gap-4">
						{#key data.student}
							{#if data.student.test_scores.length}
								{#each data.student.test_scores.filter((s) => s.type === 'ACT') as score}
									<div>
										<Button variant="link"
											>ACT
											<div class="ml-2">{actOverall(score)}</div></Button
										>
										<p class="text-xs text-muted-foreground pl-4">{score.date}</p>
									</div>
									<!-- <ScoreCard.Root
												testName="ACT"
												testDate={score.date}
												scoreValue={actOverall(score)}
											>
												<ScoreCard.ActBarSet {score} />
											</ScoreCard.Root> -->
								{/each}
								{#each data.student.test_scores.filter((s) => s.type === 'TOEFL') as score}
									<div>
										<Button variant="link"
											>TOEFL
											<div class="ml-2">{toeflOverall(score)}</div></Button
										>
										<p class="text-xs text-muted-foreground pl-4">{score.date}</p>
									</div>
									<!-- <ScoreCard.Root
											testName="TOEFL"
											testDate={score.date}
											scoreValue={toeflOverall(score)}
										>
											<ScoreCard.ToeflBarSet {score} />
										</ScoreCard.Root> -->
								{/each}
							{/if}
						{/key}
					</div>
				</Card.Content>
				{#if editMode}
					<Card.Footer class="border-t pb-4">
						<Button
							variant="ghost"
							size="icon"
							class="bg-white border rounded-full shadow-md ml-2 mt-4"
							><Plus class="size-4" /></Button
						>
					</Card.Footer>
				{/if}
			</Card.Root>
		</hgroup>
	</div>

	<div class="ml-[240px] pl-8 pr-4" slot="footer">
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
</StudentPage.Layout>

<!-- <section class="ml-[240px] p-4 mb-8 flex items-start"> -->
<!-- <div
		class="w-[360px] shrink-0 sticky top-[76px] pl-4 pr-6 pb-4 mr-6 max-h-[calc(100vh-76px)] overflow-auto"
	>
		
<!-- <Section
		
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

<!-- </div>
</section> -->
