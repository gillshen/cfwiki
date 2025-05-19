<script lang="ts">
	import { afterNavigate } from '$app/navigation';

	import { superForm } from 'sveltekit-superforms';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as Form from '$lib/components/ui/form/index';
	import Label from '$lib/components/ui/label/label.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import MultipleSelect from '$lib/components/forms/MultipleSelect.svelte';
	import NcCombobox from '$lib/components/interactive/Combobox.svelte'; // non-form-controlled
	import Input from '$lib/components/forms/Input.svelte';
	import Textarea from '$lib/components/forms/Textarea.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import SchoolForm from '$lib/components/forms/SchoolForm.svelte';
	import ProgramFormFields from '$lib/components/forms/program-form/ProgramFormFields.svelte';
	import NewApplicationRoundFormFields from '$lib/components/forms/application-round-form/NewApplicationRoundFormFields.svelte';
	import StudentApplicationListItem from '$lib/components/widgets/StudentApplicationListItem.svelte';

	import type { School } from '$lib/api/school';
	import { orderByName } from '$lib/util/schoolUtils';
	import { enhanceDisplayName, orderByName as orderByProgramName } from '$lib/util/programUtils';
	import { formatRound, orderByDueDate, orderByRoundName } from '$lib/util/applicationRoundUtils';
	import { endedEarly } from '$lib/util/serviceUtils';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;

	const form = superForm(data.newApplicationForm, {
		resetForm: true,
		invalidateAll: 'force',
		onUpdated({ form }) {
			if (form.valid) {
				// reset form: TODO resetting school and program not working
				console.log('clearing selected school and program');
				selectedSchool = '';
				selectedProgram = '';
				// TODO staff_names preservation is buggy and works only sometimes
				$formData.staff_names = [...form.data.staff_names];
			}
		}
	});
	const { form: formData, enhance } = form;

	// Declare all forms here or it would be a pain to ensure reactivity

	const schoolForm = superForm(data.newSchoolForm, {
		id: 'new-school-form',
		resetForm: true,
		onUpdated({ form }) {
			if (form.valid) {
				// set school selection
				selectedSchool = form.data.name;
			}
		}
	});
	const { enhance: schoolFormEnhance } = schoolForm;

	const programForm = superForm(data.newProgramForm, {
		id: 'new-program-form',
		resetForm: true,
		onUpdated: async ({ form }) => {
			if (form.valid) {
				// manually reset the degree and name fields
				$programFormData.degree = '';
				$programFormData.name = '';

				// set program selection
				const programs = await data.programs;
				// the newly created program should have the largest id
				const newProgramId = Math.max(...programs.map((p) => p.id));
				selectedProgram = newProgramId.toString();

				// set the staff_names field (cleared somehow by creating a new program)
				setDefaultStaff();
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
		id: 'new-application-round-form',
		resetForm: true,
		onUpdated: async ({ form }) => {
			if (form.valid) {
				// set application round selection
				const applicationRounds = await data.applicationRounds;
				// the newly created round should have the largest id
				const newRoundId = Math.max(...applicationRounds.map((round) => round.id));
				// must assign the id as a string to the form data to update the combobox selection
				$formData.round = newRoundId.toString() as unknown as number;

				// set the staff_names field (cleared somehow by creating a new application round)
				setDefaultStaff();
			}
		}
	});
	const { enhance: roundFormEnhance } = roundForm;

	const staffNameOptions = [...new Set(data.contract.services.map((s) => s.cf_username))].sort();

	const setDefaultStaff = () => {
		if (!$formData.staff_names.length) {
			const likelyServing = data.contract.services.filter((s) => !endedEarly(s));
			$formData.staff_names = [...new Set(likelyServing.map((s) => s.cf_username).sort())];
		}
	};

	// initialize the `staff_names` field:
	afterNavigate(setDefaultStaff);

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
		<h2 class="page-title">Create Application</h2>

		<div class="text-sm flex gap-2 pt-2 pb-6">
			<div><a href="/student/{data.studentId}">{data.contract.student_name}</a></div>
			<div class="text-muted-foreground/50">&bullet;</div>
			<div>{data.programType}</div>
			<div class="text-muted-foreground/50">&bullet;</div>
			<div>{data.term} {data.year}</div>
		</div>

		<form
			method="POST"
			class="max-w-prose flex flex-col gap-6 pb-4"
			action="?/createApplication"
			use:enhance
			id="application-form"
		>
			{#await Promise.all([data.schools, data.programs, data.applicationRounds])}
				<LoadingSign />
			{:then [schools, programs, applicationRounds]}
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
						onSelect={() => ($formData.round = 0)}
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
					emptyText={selectedProgram ? undefined : 'You need to select a program first'}
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
									action="?/createApplicationRound"
									class="flex flex-col gap-4 items-start justify-start text-left mx-auto my-4"
									use:roundFormEnhance
									id="round-form"
								>
									<NewApplicationRoundFormFields
										form={roundForm}
										programId={parseInt(selectedProgram)}
										year={data.year}
										term={data.term}
									/>
								</form>
							</ButtonDialog>
						{/if}
					</div>
				</Combobox>

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
					disableSearch
				/>

				<Textarea
					{form}
					name="comments"
					label="Comments"
					class="max-w-[420px]"
					maxlength={1000}
					description="Anything you want to note about this application"
					optional
				/>

				<input name="contract" type="number" value={data.contract.id} hidden />

				<Form.Button class="w-fit min-w-24">Submit</Form.Button>
				<!-- <SuperDebug data={$formData} /> -->
			{/await}
		</form>
	</section>

	<section class="text-sm flex flex-col min-w-[320px] shrink-0">
		{#key data.applications}
			{#await data.applications then applications}
				{#if applications.length}
					<h3 class="text-base font-semibold w-fit my-4">
						{data.programType} Applications of {data.year}
					</h3>
					<div class="relative">
						<Badge class="absolute -top-2 -right-2 min-w-8 size-8 rounded-full justify-center"
							>{applications.length}</Badge
						>
						<div
							class="max-h-[calc(100vh-220px)] flex flex-col rounded-[10px] border shadow-xl overflow-auto overscroll-contain p-2"
						>
							{#each applications.sort().toReversed() as application}
								<StudentApplicationListItem {application} />
							{/each}
						</div>
					</div>
				{/if}
			{/await}
		{/key}
	</section>
</div>
