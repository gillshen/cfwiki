<script lang="ts">
	import { cn } from '$lib/utils';
	import { type SuperValidated, type Infer, type SuperForm, superForm } from 'sveltekit-superforms';
	import Label from '$lib/components/ui/label/label.svelte';

	import type { CommonEnrollmentSchema, NewEnrollmentSchema } from '$lib/schemas/enrollment';
	import type { School } from '$lib/api/school';
	import type { SchoolSchema } from '$lib/schemas/school';
	import CommonEnrollmentFormFields from './CommonEnrollmentFormFields.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import NcCombobox from '$lib/components/interactive/Combobox.svelte'; // non-form-controlled
	import NcRadioGroup from '$lib/components/interactive/RadioGroup.svelte'; // non-form-controlled
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import SchoolForm from '$lib/components/forms/SchoolForm.svelte';
	import { SECONDARY_PROGRESSIONS, UNIVERSITY_PROGRESSIONS } from '$lib/constants/progressions';

	export let data: SuperValidated<Infer<NewEnrollmentSchema>>;
	export let onUpdated: (event: { form: typeof data }) => any;
	export let action: string = '?/createEnrollment';
	export let className: string = '';
	export let studentId: number;
	export let schools: School[];
	export let newSchoolForm: SuperValidated<Infer<SchoolSchema>>;
	export { className as class };

	const id = `new-enrollment-form`;

	const form = superForm(data, { id, resetForm: false, onUpdated });
	const _form = form as unknown as SuperForm<Infer<CommonEnrollmentSchema>>;
	const { form: formData, enhance } = form;
	$formData.student = studentId;

	const schoolForm = superForm(newSchoolForm, {
		id: 'new-school-form',
		resetForm: false,
		onUpdated({ form }) {
			// restore school type selection and set school selection
			selectedSchoolType = form.data.type;
			selectedSchool = form.data.name;
			$formData.school = schools.find((school) => school.name === form.data.name)!.id;
		}
	});
	const { form: schoolFormData, enhance: schoolFormEnhance } = schoolForm;

	const programTypeItems = ['UG Freshman', 'UG Transfer', "Master's"];

	let selectedSchoolType = '';
	let selectedSchool = '';

	let progressions: string[];

	$: {
		switch (selectedSchoolType) {
			case 'Secondary School':
				progressions = [...SECONDARY_PROGRESSIONS];
				$schoolFormData.type = 'Secondary School';
				break;
			case 'University':
				progressions = [...UNIVERSITY_PROGRESSIONS];
				if ($formData.program_type === 'Secondary School') {
					$formData.program_type = '';
				}
				$schoolFormData.type = 'University';
				break;
			default:
				progressions = [];
				$schoolFormData.type = '';
		}
	}

	let schoolFormOpen = false;
</script>

<form
	method="POST"
	{id}
	{action}
	class={cn('max-w-prose flex flex-col gap-6 my-4 mx-auto', className)}
	use:enhance
>
	<input type="number" name="student" value={$formData.student} hidden />

	<div class="flex flex-col gap-2.5 pb-2">
		<Label>School type</Label>
		<NcRadioGroup
			bind:value={selectedSchoolType}
			items={['University', 'Secondary School']}
			onValueChange={() => {
				selectedSchool = '';
				$formData.curriculum = '';
			}}
		/>
	</div>

	<div class="flex flex-col gap-2 pb-2">
		<Label>School</Label>
		<NcCombobox
			bind:value={selectedSchool}
			items={schools
				.filter((school) => school.type === selectedSchoolType)
				.map((school) => school.name)
				.sort()}
			width="w-[420px]"
			disableSearch={!selectedSchoolType}
			searchDisabledEmptyText={selectedSchoolType
				? undefined
				: 'You need to select a school type first'}
			onSelect={() => {
				$formData.school = schools.find((school) => school.name === selectedSchool)?.id ?? 0;
			}}
		>
			<div slot="if-not-found">
				{#if selectedSchoolType}
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
						<!-- <SuperDebug data={$schoolFormData} /> -->
					</ButtonDialog>
				{/if}
			</div>
		</NcCombobox>
	</div>

	<input type="number" name="school" bind:value={$formData.school} hidden />

	{#if selectedSchoolType === 'Secondary School'}
		<input name="program_type" value="Secondary School" hidden />
	{:else}
		<Combobox
			{form}
			name="program_type"
			label="Program type"
			items={selectedSchoolType ? programTypeItems : []}
			disableSearch
			searchDisabledEmptyText="You need to select a school type first"
		/>
	{/if}

	<CommonEnrollmentFormFields form={_form} programType={selectedSchoolType} {progressions} />
	<!-- <SuperDebug data={$formData} /> -->
</form>
