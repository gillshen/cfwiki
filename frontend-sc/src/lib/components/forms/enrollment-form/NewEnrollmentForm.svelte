<script lang="ts">
	import { cn } from '$lib/utils';
	import { type SuperValidated, type Infer, type SuperForm, superForm } from 'sveltekit-superforms';
	import type { CommonEnrollmentSchema, NewEnrollmentSchema } from '$lib/schemas/enrollment';
	import type { School } from '$lib/api/school';
	import type { SchoolSchema } from '$lib/schemas/school';
	import CommonEnrollmentFormFields from './CommonEnrollmentFormFields.svelte';
	import RadioGroup from '$lib/components/forms/RadioGroup.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
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
			$formData._school_type = form.data.type;
			$formData._school = form.data.name;
			$formData.school = schools.find((school) => school.name === form.data.name)!.id;
		}
	});
	const { form: schoolFormData, enhance: schoolFormEnhance } = schoolForm;

	let programTypeItems: string[];
	let progressions: string[];

	$: {
		if ($formData._school_type === 'Secondary School') {
			programTypeItems = ['Secondary School'];
			progressions = [...SECONDARY_PROGRESSIONS];
			$formData.program_type = 'Secondary School';
			$schoolFormData.type = 'Secondary School';
		} else if ($formData._school_type === 'University') {
			programTypeItems = ['UG Freshman', 'UG Transfer', "Master's"];
			progressions = [...UNIVERSITY_PROGRESSIONS];
			if ($formData.program_type === 'Secondary School') {
				$formData.program_type = '';
			}
			$schoolFormData.type = 'University';
		} else {
			programTypeItems = [];
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
	class={cn('max-w-prose space-y-4 my-4 mx-auto', className)}
	use:enhance
>
	<input type="number" name="student" value={$formData.student} hidden />

	<RadioGroup
		{form}
		name="_school_type"
		label="School type"
		items={['University', 'Secondary School']}
		onValueChange={() => {
			$formData._school = '';
			$formData.curriculum = '';
		}}
	/>

	<Combobox
		{form}
		name="_school"
		label="School"
		items={schools
			.filter((school) => school.type === $formData._school_type)
			.map((school) => school.name)
			.sort()}
		width="w-[420px]"
		disableSearch={!$formData._school_type}
		searchDisabledEmptyText={$formData._school_type
			? undefined
			: 'You need to select a school type first'}
		postSelect={() => {
			$formData.school = schools.find((school) => school.name === $formData._school)?.id ?? 0;
		}}
	>
		<div slot="if-not-found">
			{#if $formData._school_type}
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
	</Combobox>

	<input type="number" name="school" bind:value={$formData.school} hidden />

	<Combobox
		{form}
		name="program_type"
		label="Program type"
		items={programTypeItems}
		disableSearch
		searchDisabledEmptyText="You need to select a school type first"
	/>

	<CommonEnrollmentFormFields form={_form} programType={$formData._school_type} {progressions} />
	<!-- <SuperDebug data={$formData} /> -->
</form>
