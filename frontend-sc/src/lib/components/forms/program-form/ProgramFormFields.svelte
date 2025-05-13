<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';

	import type { School } from '$lib/api/school';
	import type { Infer, SuperForm } from 'sveltekit-superforms';
	import type { NewProgramSchema } from '$lib/schemas/program';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import NcCombobox from '$lib/components/interactive/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import DismissibleBadge from '$lib/components/misc/DismissibleBadge.svelte';
	import { PROGRAM_TYPES } from '$lib/api/program';
	import { lexicalChineseLast } from '$lib/util/stringUtils';

	export let schools: School[];
	export let form: SuperForm<Infer<NewProgramSchema>>;

	const schoolSelectId = `new-program-form-school-select`;

	const { form: formData } = form;

	const handleSchoolSelection = () => {
		const selectedSchoolId = schools.find((s) => s.name === selectedSchoolName)?.id;

		// Clear the combobox to help the user focus on the badge
		selectedSchoolName = '';

		if (selectedSchoolId && !$formData.schools.includes(selectedSchoolId)) {
			$formData.schools = [...$formData.schools, selectedSchoolId];
		}
	};

	const handleSchoolRemoval = (schoolIdToRemove: number) => {
		$formData.schools = $formData.schools.filter((id) => id !== schoolIdToRemove);
	};

	const handleProgramTypeSelection = () => {
		if ($formData.type !== "Master's" && $formData.type !== 'Doctorate') {
			$formData.degree = '';
		}
		if ($formData.type.startsWith('UG')) {
			$formData.name = '';
		}
	};

	let selectedSchoolName = '';
</script>

<div class="flex flex-col gap-2 justify-start">
	<Form.Field {form} name="schools">
		<Form.Control>
			<div class="flex flex-col gap-2.5 justify-start">
				<Form.Label for={schoolSelectId}>Host institution</Form.Label>
				<NcCombobox
					bind:value={selectedSchoolName}
					items={schools.map((school) => school.name).sort(lexicalChineseLast)}
					onSelect={handleSchoolSelection}
					width="w-[420px]"
				/>
			</div>
			<select id={schoolSelectId} name="schools" multiple bind:value={$formData.schools} hidden>
				{#each schools as { id }}
					<option value={id}>{id}</option>
				{/each}
			</select>
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>
	{#if $formData.schools.length}
		<ul class="flex flex-col gap-2 mb-2">
			{#each $formData.schools as schoolId}
				{@const schoolName = schools.find((s) => s.id === schoolId)?.name}
				<DismissibleBadge onDismiss={() => handleSchoolRemoval(schoolId)} class="w-fit h-7"
					>{schoolName}</DismissibleBadge
				>
			{/each}
		</ul>
	{/if}
</div>

<Combobox
	{form}
	name="type"
	label="Program type"
	items={[...PROGRAM_TYPES]}
	width="w-[240px]"
	postSelect={handleProgramTypeSelection}
/>

<!-- Prefer disabled input to hidden one to minimize height change in dialogs -->

<Input
	{form}
	name="degree"
	label="Degree awarded"
	inputClass="w-[420px]"
	description={'Use common abbreviations, such as \u201cMS\u201d, when appropriate.'}
	disabled={$formData.type !== "Master's" && $formData.type !== 'Doctorate'}
/>

<Input
	{form}
	name="name"
	label="Program name"
	inputClass="w-[420px]"
	description={$formData.type === 'Non-degree'
		? undefined
		: 'Do not include the degree. Instead of \u201cMS in Finance\u201d, simply \u201cFinance\u201d.'}
	disabled={!$formData.type || $formData.type.startsWith('UG')}
/>

<Form.Button class="w-fit min-w-24">Submit</Form.Button>
