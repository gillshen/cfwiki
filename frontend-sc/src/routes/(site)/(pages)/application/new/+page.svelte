<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as Form from '$lib/components/ui/form/index';
	import Label from '$lib/components/ui/label/label.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import StudentApplicationCard from '$lib/components/widgets/StudentApplicationCard.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import MultipleSelect from '$lib/components/forms/MultipleSelect.svelte';
	import NcCombobox from '$lib/components/interactive/Combobox.svelte'; // non-form-controlled
	import Input from '$lib/components/forms/Input.svelte';
	import Textarea from '$lib/components/forms/Textarea.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import SchoolForm from '$lib/components/forms/SchoolForm.svelte';
	import ProgramFormFields from '$lib/components/forms/program-form/ProgramFormFields.svelte';

	import type { School } from '$lib/api/school';
	import { orderByName } from '$lib/util/schoolUtils';
	import { enhanceDisplayName, orderByName as orderByProgramName } from '$lib/util/programUtils';
	import { formatRound, orderByDueDate, orderByRoundName } from '$lib/util/applicationRoundUtils';
	import { endedEarly } from '$lib/util/serviceUtils';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;

	const form = superForm(data.newApplicationForm);
	const { form: formData, enhance } = form;

	// Declare all forms here or it would be a pain to ensure reactivity

	const schoolForm = superForm(data.newSchoolForm, {
		onUpdated({ form }) {
			if (form.valid) {
				// set school selection
				selectedSchool = form.data.name;
			}
		}
	});
	const { enhance: schoolFormEnhance } = schoolForm;

	const programForm = superForm(data.newProgramForm, {
		resetForm: false, // avoid resetting the school and program type fields
		onUpdated: async ({ form }) => {
			if (form.valid) {
				// manually reset the degree and name fields
				$programFormData.degree = '';
				$programFormData.name = '';

				// set program selection
				const programs = await data.programs;
				// the newly created program should have the largest id
				const newProgramId = Math.max(...programs.map((p) => p.id));
				console.log(newProgramId);
				selectedProgram = newProgramId.toString();
			}
		}
	});
	const { form: programFormData, enhance: programFormEnhance } = programForm;

	// set a reasonable default
	if (
		data.programType === 'UG Freshman' ||
		data.programType === 'UG Transfer' ||
		data.programType === 'Non-degree'
	) {
		$programFormData.type = data.programType;
	}

	const roundForm = superForm(data.newApplicationRoundForm, {
		resetForm: false,
		onUpdated({ form }) {
			// TODO set application round
		}
	});
	const { enhance: roundFormEnhance } = roundForm;

	const staffNameOptions = [...new Set(data.contract.services.map((s) => s.cf_username))].sort();

	// initialize the `staff` field:
	if (!$formData.staff_names.length) {
		const likelyServing = data.contract.services.filter((s) => !endedEarly(s));
		$formData.staff_names = [...new Set(likelyServing.map((s) => s.cf_username).sort())];
	}

	const onSchoolSelection = (schools: School[]) => {
		// TODO the current behavior is tha even if the user doesn't actually change
		// their school choice,  the program and round fields will still be cleared,
		// which is not ideal; should clear the other fields only on real changes
		selectedProgram = '';
		$formData.round = 0;

		// set the default school in the program form
		const selectedSchoolId = schools.find((s) => s.name === selectedSchool)?.id;
		if (selectedSchoolId) {
			$programFormData.schools = [selectedSchoolId];
		}
	};

	let selectedSchool = '';
	let selectedProgram = '';

	let schoolFormOpen = false;
	let programFormOpen = false;
	let roundFormOpen = false;

	$: {
		if (!$formData.major_1) {
			$formData.major_2 = '';
		}
		if (!$formData.major_2) {
			$formData.major_3 = '';
		}
	}
</script>

<svelte:head>
	<title>{createTitle('Create Application')}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>Applications</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>New</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<div class="flex justify-between space-between gap-12">
	<section>
		<h1 class="page-title">Create Application</h1>

		<div class="text-sm flex gap-2 pt-2 pb-6">
			<div><a href="/student/{data.studentId}">{data.contract.student_name}</a></div>
			<div class="text-muted-foreground/50">&bullet;</div>
			<div>{data.programType}</div>
			<div class="text-muted-foreground/50">&bullet;</div>
			<div>{data.term} {data.year}</div>
		</div>

		<form
			method="POST"
			class="max-w-prose flex flex-col gap-6"
			action="?/createApplication"
			use:enhance
			id="application-form"
		>
			{#await Promise.all([data.schools, data.programs])}
				<LoadingSign />
			{:then [schools, programs]}
				<div class="flex flex-col gap-2.5">
					<Label>School</Label>
					<NcCombobox
						bind:value={selectedSchool}
						width="w-[420px]"
						items={schools.sort(orderByName).map((school) => school.name)}
						onSelect={() => onSchoolSelection(schools)}
					>
						<div slot="if-not-found">
							<ButtonDialog
								buttonVariant="secondary"
								buttonSize="sm"
								buttonText="Add School"
								buttonClass="mt-4 mx-auto"
								contentClass="min-w-[529px]"
								dialogTitle="Create School Profile"
								open={schoolFormOpen}
							>
								<form
									method="POST"
									action="?/createSchool"
									class="flex flex-col gap-4 items-start justify-start mx-auto my-4"
									use:schoolFormEnhance
									id="school-form"
								>
									<SchoolForm form={schoolForm} />
								</form>
							</ButtonDialog>
						</div>
					</NcCombobox>
				</div>

				<div class="flex flex-col gap-2.5 h-[68px]">
					<Label>Program</Label>
					<NcCombobox
						bind:value={selectedProgram}
						width="w-[420px]"
						items={programs
							.filter((p) => p.schools.map((s) => s.name).includes(selectedSchool))
							.sort(orderByProgramName)
							.map((p) => ({ label: enhanceDisplayName(p), value: p.id.toString() }))}
						onSelect={() => {
							$formData.round = 0;
							// TODO
						}}
						emptyText={selectedSchool ? undefined : 'You need to select a school first'}
					>
						<div slot="if-not-found">
							{#if selectedSchool}
								<ButtonDialog
									buttonVariant="secondary"
									buttonSize="sm"
									buttonText="Add Program"
									buttonClass="mt-4 mx-auto"
									contentClass="min-w-[529px]"
									dialogTitle="Create Program Profile"
									open={programFormOpen}
								>
									<form
										method="POST"
										action="?/createProgram"
										class="flex flex-col gap-4 items-start justify-start text-left mx-auto my-4"
										use:programFormEnhance
										id="program-form"
									>
										<ProgramFormFields form={programForm} {schools} />
									</form>
								</ButtonDialog>
							{/if}
						</div>
					</NcCombobox>
				</div>
			{/await}

			{#await data.applicationRounds then applicationRounds}
				<Combobox
					{form}
					name="round"
					label="Admission plan"
					width="w-[420px]"
					items={applicationRounds
						.filter((r) => r.program_iteration.program.toString() === selectedProgram)
						.sort(orderByRoundName)
						.sort(orderByDueDate)
						.map((r) => ({ label: formatRound(r), value: r.id.toString() }))}
					disableSearch
					searchDisabledEmptyText={selectedProgram
						? undefined
						: 'You need to select a program first'}
				>
					<div slot="if-not-found">
						{#if selectedProgram}
							<ButtonDialog
								buttonVariant="secondary"
								buttonSize="sm"
								buttonText="Add Plan"
								buttonClass="mt-4 mx-auto"
								contentClass="min-w-[529px]"
								dialogTitle="Create Admission Plan"
								open={roundFormOpen}
							>
								<form
									method="POST"
									action="?/createProgram"
									class="flex flex-col gap-4 items-start justify-start mx-auto my-4"
									use:roundFormEnhance
									id="round-form"
								>
									<pre>{JSON.stringify(roundForm.form, null, 2)}</pre>
								</form>
							</ButtonDialog>
						{/if}
					</div>
				</Combobox>
			{/await}

			<Input
				{form}
				name="major_1"
				label="First-choice major or track"
				maxlength={100}
				inputClass="w-[420px]"
				optional
			/>

			{#if $formData.major_1.trim()}
				<Input
					{form}
					name="major_2"
					label="Second-choice major or track"
					maxlength={100}
					inputClass="w-[420px]"
					optional
				/>

				{#if $formData.major_2.trim()}
					<Input
						{form}
						name="major_3"
						label="Third-choice major or track"
						maxlength={100}
						inputClass="w-[420px]"
						optional
					/>
				{/if}
			{/if}

			<MultipleSelect
				{form}
				name="staff_names"
				label="CF Involvement"
				items={staffNameOptions}
				description="Select all and only those involved in this application"
			/>

			<Textarea
				{form}
				name="comments"
				label="Comments"
				class="w-[420px]"
				maxlength={1000}
				description="Anything you want to note about this application"
				optional
			/>

			<input name="contract" type="number" value={data.contract.id} class="hidden" />

			<Form.Button class="w-fit min-w-24">Submit</Form.Button>
			<!-- <SuperDebug data={$formData} /> -->
		</form>
	</section>

	<section class="text-sm flex flex-col">
		{#await data.applications then applications}
			{#if applications.length}
				<div
					class="py-4 px-8 border-t border-l border-r rounded-[10px] backdrop-blur bg-muted/70 shadow-sm z-10 flex items-center"
				>
					<h3 class="text-base font-semibold">{data.programType} Applications of {data.year}</h3>
					<Badge variant="outline" class="ml-4 min-w-8 h-5 justify-center bg-popover"
						>{applications.length}</Badge
					>
				</div>
				<!-- Workaround for a Firefox bug where backdrop-blur does not work with rounded corners  -->
				<div
					id="existing-applications-list"
					class="max-h-[calc(100vh-180px)] min-h-[500px] -mt-[56px] pt-[56px] flex flex-col rounded-[10px] border overflow-auto overscroll-none px-2 pb-2"
				>
					{#each applications.sort().toReversed() as application}
						<a
							href="/application/{application.id}"
							target="_self"
							class="hover:no-underline first:mt-1"
						>
							<StudentApplicationCard
								{application}
								compact
								hideYear
								class="border-none shadow-none w-[370px] hover:bg-muted/70 rounded-md"
							/>
						</a>
					{/each}
				</div>
			{/if}
		{/await}
	</section>
</div>

<style>
	#existing-applications-list::-webkit-scrollbar-track {
		margin-block-start: calc(56px + 2px);
	}
</style>
